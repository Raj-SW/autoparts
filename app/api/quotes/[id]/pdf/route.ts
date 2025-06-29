import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";
import { IQuote } from "@/models/Quote";
import { ObjectId } from "mongodb";
import { pdfGenerator } from "@/lib/pdf/pdf-generator";

// GET /api/quotes/[id]/pdf - Download quote PDF
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

      // Generate PDF
      console.log(`📄 Generating PDF for quote ${quote.quoteNumber}...`);
      const pdfBuffer = await pdfGenerator.generateQuotePDF(quote);
      console.log(
        `✅ PDF generated successfully for quote ${quote.quoteNumber}`
      );

      // Return PDF file
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Quote-${quote.quoteNumber}.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
        },
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }
  }
);
