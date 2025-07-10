import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, withAdminAuth, AuthUser } from "@/middleware/auth";
import { createPartnerApplicationSchema } from "@/utils/validation";
import { IPartner } from "@/models/Partner";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { pdfGenerator } from "@/lib/pdf/pdf-generator";
import { getEmailService } from "@/lib/email/email-service";

// Helper function to generate application number
function generateApplicationNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PA-${timestamp.slice(-6)}-${random}`;
}

// POST /api/partners - Create new partner application (Authenticated users only)
export const POST = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await createPartnerApplicationSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const db = await getDatabase();
    const partnersCollection = db.collection<IPartner>("partners");

    // Check if user already has a pending or approved application
    const existingApplication = await partnersCollection.findOne({
      userId: new ObjectId(user.userId),
      status: { $in: ["pending", "approved", "under_review"] },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: "You already have an active partnership application",
          applicationNumber: existingApplication.applicationNumber,
          status: existingApplication.status,
        },
        { status: 409 }
      );
    }

    // Create new partner application
    const applicationNumber = generateApplicationNumber();
    const newPartner: Omit<IPartner, "_id"> = {
      ...validatedData,
      userId: new ObjectId(user.userId),
      applicationNumber,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await partnersCollection.insertOne(newPartner);

    if (!result.insertedId) {
      throw new Error("Failed to create partner application");
    }

    // Get the created partner with ID for PDF generation
    const createdPartner = await partnersCollection.findOne({
      _id: result.insertedId,
    });

    if (!createdPartner) {
      throw new Error("Failed to retrieve created partner application");
    }

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await pdfGenerator.generatePartnerApplicationPDF(
        createdPartner
      );
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Continue without PDF if generation fails
      pdfBuffer = Buffer.from("PDF generation failed");
    }

    // Send emails (don't fail the request if email fails)
    try {
      // Send confirmation email to applicant
      await getEmailService().sendPartnerApplicationConfirmationToApplicant(
        createdPartner,
        pdfBuffer
      );

      // Send notification email to admin
      await getEmailService().sendPartnerApplicationNotificationToAdmin(
        createdPartner,
        pdfBuffer
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Log but don't fail the request
    }

    return NextResponse.json(
      {
        message: "Partnership application submitted successfully",
        application: {
          id: result.insertedId.toString(),
          applicationNumber,
          status: "pending",
          businessName: newPartner.businessName,
          contactName: newPartner.contactName,
          email: newPartner.email,
          createdAt: newPartner.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create partner application error:", error);
    return NextResponse.json(
      { error: "Failed to submit partnership application" },
      { status: 500 }
    );
  }
});

// GET /api/partners - Get partner applications (Admin: all, User: own only)
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status");
    const businessType = searchParams.get("businessType");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const db = await getDatabase();
    const partnersCollection = db.collection<IPartner>("partners");

    // Build query based on user role
    const query: any = {};

    if (user.role !== "admin") {
      // Regular users can only see their own applications
      query.userId = new ObjectId(user.userId);
    }

    // Add filters
    if (status) query.status = status;
    if (businessType) query.businessType = businessType;

    // Get total count for pagination
    const totalCount = await partnersCollection.countDocuments(query);

    // Get partner applications with pagination and sorting
    const partners = await partnersCollection
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    // For admin, also get summary statistics
    let statistics = null;
    if (user.role === "admin") {
      const [pending, approved, rejected, underReview] = await Promise.all([
        partnersCollection.countDocuments({ status: "pending" }),
        partnersCollection.countDocuments({ status: "approved" }),
        partnersCollection.countDocuments({ status: "rejected" }),
        partnersCollection.countDocuments({ status: "under_review" }),
      ]);

      statistics = {
        total: totalCount,
        pending,
        approved,
        rejected,
        underReview,
      };
    }

    return NextResponse.json({
      partners: partners.map((partner) => ({
        ...partner,
        _id: partner._id!.toString(),
        userId: partner.userId.toString(),
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      statistics,
    });
  } catch (error) {
    console.error("Get partner applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner applications" },
      { status: 500 }
    );
  }
});
