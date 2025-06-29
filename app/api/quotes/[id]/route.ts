import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";
import { IQuote } from "@/models/Quote";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { emailService } from "@/lib/email/email-service";
import { pdfGenerator } from "@/lib/pdf/pdf-generator";

// Quote update schema for admin responses
const quoteUpdateSchema = z.object({
  quotedPrice: z.number().min(0).optional(),
  quotationNotes: z.string().optional(),
  validUntil: z.string().optional(),
  status: z
    .enum(["pending", "quoted", "accepted", "rejected", "expired"])
    .optional(),
});

// GET /api/quotes/[id] - Get specific quote
export const GET = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid quote ID" },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const quotesCollection = db.collection<IQuote>("quotes");

      const quote = await quotesCollection.findOne({ _id: new ObjectId(id) });

      if (!quote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }

      return NextResponse.json({
        quote: {
          id: quote._id!.toString(),
          ...quote,
          _id: undefined,
        },
      });
    } catch (error) {
      console.error("Get quote error:", error);
      return NextResponse.json(
        { error: "Failed to fetch quote" },
        { status: 500 }
      );
    }
  }
);

// PUT /api/quotes/[id] - Update quote (Admin response)
export const PUT = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid quote ID" },
          { status: 400 }
        );
      }

      const body = await request.json();

      let validatedData;
      try {
        validatedData = await quoteUpdateSchema.parseAsync(body);
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

      // Get the existing quote
      const existingQuote = await quotesCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingQuote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }

      // Prepare update data
      const updateData: Partial<IQuote> = {
        ...validatedData,
        updatedAt: new Date(),
      };

      // If providing a quote response, set additional fields
      if (validatedData.quotedPrice !== undefined) {
        updateData.quotedBy = new ObjectId(user.userId);
        updateData.quotedAt = new Date();
        updateData.respondedAt = new Date();

        // Set status to quoted if not explicitly provided
        if (!validatedData.status) {
          updateData.status = "quoted";
        }

        // Set default validity (7 days from now) if not provided
        if (!validatedData.validUntil) {
          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + 7);
          updateData.validUntil = validUntil;
        } else {
          updateData.validUntil = new Date(validatedData.validUntil);
        }
      }

      // Update the quote
      const result = await quotesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }

      // Get the updated quote
      const updatedQuote = await quotesCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!updatedQuote) {
        throw new Error("Failed to retrieve updated quote");
      }

      // Send email notification to customer if quote was provided
      if (
        validatedData.quotedPrice !== undefined &&
        updateData.status === "quoted"
      ) {
        try {
          console.log(
            `📧 Sending quote response to customer for quote ${updatedQuote.quoteNumber}...`
          );

          // Generate PDF for the quote response
          const pdfBuffer = await pdfGenerator.generateQuotePDF(updatedQuote);
          console.log(
            `📄 Quote response PDF generated for ${updatedQuote.quoteNumber}`
          );

          // Send quote response email to customer
          const customerEmailSent =
            await emailService.sendQuoteResponseToCustomer(
              updatedQuote,
              pdfBuffer
            );
          console.log(
            `📧 Quote response ${
              customerEmailSent ? "sent successfully" : "failed"
            } for quote ${updatedQuote.quoteNumber}`
          );
        } catch (emailError) {
          console.error(
            `❌ Failed to send quote response email for ${updatedQuote.quoteNumber}:`,
            emailError
          );
          // Don't fail the entire request if email fails
        }
      }

      return NextResponse.json({
        message: "Quote updated successfully",
        quote: {
          id: updatedQuote._id!.toString(),
          ...updatedQuote,
          _id: undefined,
        },
      });
    } catch (error) {
      console.error("Update quote error:", error);
      return NextResponse.json(
        { error: "Failed to update quote" },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/quotes/[id] - Delete quote (Admin only)
export const DELETE = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid quote ID" },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const quotesCollection = db.collection<IQuote>("quotes");

      const result = await quotesCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Quote deleted successfully",
      });
    } catch (error) {
      console.error("Delete quote error:", error);
      return NextResponse.json(
        { error: "Failed to delete quote" },
        { status: 500 }
      );
    }
  }
);
