import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, withAdminAuth, AuthUser } from "@/middleware/auth";
import { updatePartnerStatusSchema } from "@/utils/validation";
import { IPartner } from "@/models/Partner";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { pdfGenerator } from "@/lib/pdf/pdf-generator";
import { getEmailService } from "@/lib/email/email-service";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/partners/[id] - Get specific partner application
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withAuth(async (req: NextRequest, user: AuthUser) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid partner ID" },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const partnersCollection = db.collection<IPartner>("partners");

      // Build query based on user role
      const query: any = { _id: new ObjectId(id) };

      if (user.role !== "admin") {
        // Regular users can only see their own applications
        query.userId = new ObjectId(user.userId);
      }

      const partner = await partnersCollection.findOne(query);

      if (!partner) {
        return NextResponse.json(
          { error: "Partner application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        partner: {
          ...partner,
          _id: partner._id!.toString(),
          userId: partner.userId.toString(),
        },
      });
    } catch (error) {
      console.error("Get partner application error:", error);
      return NextResponse.json(
        { error: "Failed to fetch partner application" },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PATCH /api/partners/[id] - Update partner application status (Admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return withAdminAuth(async (req: NextRequest, user: AuthUser) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid partner ID" },
          { status: 400 }
        );
      }

      const body = await request.json();

      let validatedData;
      try {
        validatedData = await updatePartnerStatusSchema.parseAsync(body);
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

      // Get current partner application
      const currentPartner = await partnersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!currentPartner) {
        return NextResponse.json(
          { error: "Partner application not found" },
          { status: 404 }
        );
      }

      // Prepare update data
      const updateData: Partial<IPartner> = {
        ...validatedData,
        updatedAt: new Date(),
        reviewedBy: new ObjectId(user.userId),
        reviewedAt: new Date(),
      };

      // Set status-specific timestamps
      if (
        validatedData.status === "approved" &&
        currentPartner.status !== "approved"
      ) {
        updateData.approvedAt = new Date();
      } else if (
        validatedData.status === "rejected" &&
        currentPartner.status !== "rejected"
      ) {
        updateData.rejectedAt = new Date();
      }

      // Update the partner application
      const result = await partnersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Partner application not found" },
          { status: 404 }
        );
      }

      // Get updated partner for email notification
      const updatedPartner = await partnersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!updatedPartner) {
        throw new Error("Failed to retrieve updated partner application");
      }

      // Send status update email to applicant (don't fail if email fails)
      try {
        let pdfBuffer: Buffer | undefined;

        // Generate PDF for approved/rejected applications
        if (
          validatedData.status === "approved" ||
          validatedData.status === "rejected"
        ) {
          try {
            pdfBuffer = await pdfGenerator.generatePartnerApplicationPDF(
              updatedPartner
            );
          } catch (pdfError) {
            console.error("PDF generation failed:", pdfError);
          }
        }

        await getEmailService().sendPartnerStatusUpdateToApplicant(
          updatedPartner,
          pdfBuffer
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Log but don't fail the request
      }

      return NextResponse.json({
        message: "Partner application updated successfully",
        partner: {
          ...updatedPartner,
          _id: updatedPartner._id!.toString(),
          userId: updatedPartner.userId.toString(),
        },
      });
    } catch (error) {
      console.error("Update partner application error:", error);
      return NextResponse.json(
        { error: "Failed to update partner application" },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE /api/partners/[id] - Delete partner application (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAdminAuth(async (req: NextRequest, user: AuthUser) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid partner ID" },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const partnersCollection = db.collection<IPartner>("partners");

      // Check if partner application exists
      const partner = await partnersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!partner) {
        return NextResponse.json(
          { error: "Partner application not found" },
          { status: 404 }
        );
      }

      // Don't allow deletion of approved partners
      if (partner.status === "approved") {
        return NextResponse.json(
          { error: "Cannot delete approved partner applications" },
          { status: 400 }
        );
      }

      // Delete the partner application
      const result = await partnersCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "Failed to delete partner application" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Partner application deleted successfully",
      });
    } catch (error) {
      console.error("Delete partner application error:", error);
      return NextResponse.json(
        { error: "Failed to delete partner application" },
        { status: 500 }
      );
    }
  })(request, { params });
}
