import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, withAdminAuth, AuthUser } from "@/middleware/auth";
import { createQuoteSchema } from "@/utils/validation";
import { IQuote } from "@/models/Quote";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { emailService } from "@/lib/email/email-service";
import { pdfGenerator } from "@/lib/pdf/pdf-generator";

// GET /api/quotes - Get quotes (Admin: all quotes, User: own quotes)
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");

    const db = await getDatabase();
    const quotesCollection = db.collection<IQuote>("quotes");

    // Build query based on user role
    const query: any = {};

    // Non-admin users can only see their own quotes
    if (user.role !== "admin") {
      query.userId = new ObjectId(user.userId);
    }

    if (status) query.status = status;
    if (urgency) query.urgency = urgency;

    // Get total count for pagination
    const totalCount = await quotesCollection.countDocuments(query);

    // Get quotes with pagination
    const quotes = await quotesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      quotes: quotes.map((quote) => ({
        id: quote._id!.toString(),
        ...quote,
        _id: undefined,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Get quotes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
});

// POST /api/quotes - Create new quote request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await createQuoteSchema.parseAsync(body);
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
    const quotesCollection = db.collection<IQuote>("quotes");

    // Get authenticated user if available
    const authHeader = request.headers.get("authorization");
    let userId: ObjectId | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const { authenticate } = await import("@/middleware/auth");
        const { user } = await authenticate(request);
        if (user) {
          userId = new ObjectId(user.userId);
        }
      } catch (error) {
        // User not authenticated, continue as guest
      }
    }

    // Generate quote number
    const quoteCount = await quotesCollection.countDocuments();
    const quoteNumber = `QT${new Date().getFullYear()}${String(
      quoteCount + 1
    ).padStart(6, "0")}`;

    // Create new quote
    const newQuote: Omit<IQuote, "_id"> = {
      quoteNumber,
      userId,
      customer: validatedData.customer,
      vehicle: validatedData.vehicle,
      items: validatedData.items,
      message: validatedData.message,
      urgency: validatedData.urgency,
      preferredContact: validatedData.preferredContact,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await quotesCollection.insertOne(newQuote);

    if (!result.insertedId) {
      throw new Error("Failed to create quote");
    }

    // Generate PDF and send notifications
    try {
      const createdQuote = { ...newQuote, _id: result.insertedId };

      console.log(`📧 Sending notifications for quote ${quoteNumber}...`);

      // Generate PDF for the quote
      const pdfBuffer = await pdfGenerator.generateQuotePDF(createdQuote);
      console.log(`📄 PDF generated for quote ${quoteNumber}`);

      // Send notification to admin with PDF attachment
      const adminEmailSent = await emailService.sendQuoteNotificationToAdmin(
        createdQuote,
        pdfBuffer
      );
      console.log(
        `📧 Admin notification ${
          adminEmailSent ? "sent successfully" : "failed"
        } for quote ${quoteNumber}`
      );

      // Send confirmation email to customer
      const customerEmailSent =
        await emailService.sendQuoteConfirmationToCustomer(createdQuote);
      console.log(
        `📧 Customer confirmation ${
          customerEmailSent ? "sent successfully" : "failed"
        } for quote ${quoteNumber}`
      );

      console.log(
        `✅ Quote ${quoteNumber} created and all notifications processed`
      );
    } catch (emailError) {
      console.error(
        `❌ Failed to send notifications for quote ${quoteNumber}:`,
        emailError
      );
      // Don't fail the entire request if email fails
    }

    return NextResponse.json(
      {
        message:
          "Quote request submitted successfully. We will contact you soon.",
        quote: {
          id: result.insertedId.toString(),
          ...newQuote,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quote error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
