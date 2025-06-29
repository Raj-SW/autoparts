import puppeteer from "puppeteer";
import { IQuote } from "@/models/Quote";

export interface PDFGenerationOptions {
  format?: "A4" | "Letter";
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
}

class PDFGenerator {
  private defaultOptions: PDFGenerationOptions = {
    format: "A4",
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
    printBackground: true,
  };

  async generateQuotePDF(
    quote: IQuote,
    options?: PDFGenerationOptions
  ): Promise<Buffer> {
    const htmlContent = this.generateQuoteHTML(quote);
    const pdfOptions = { ...this.defaultOptions, ...options };

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: pdfOptions.format as any,
        margin: pdfOptions.margin,
        printBackground: pdfOptions.printBackground,
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw new Error("Failed to generate PDF");
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private generateQuoteHTML(quote: IQuote): string {
    const isQuoted = quote.status === "quoted" && quote.quotedPrice;
    const currentDate = new Date().toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote ${quote.quoteNumber}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            background: linear-gradient(135deg, #D72638 0%, #B91C2C 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 8px;
          }
          
          .company-logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .company-details {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .quote-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          
          .quote-details, .document-info {
            flex: 1;
          }
          
          .section {
            margin-bottom: 30px;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .section-header {
            background: #D72638;
            color: white;
            padding: 15px 20px;
            font-weight: bold;
            font-size: 16px;
          }
          
          .section-content {
            padding: 20px;
          }
          
          .two-column {
            display: flex;
            gap: 30px;
          }
          
          .column {
            flex: 1;
          }
          
          .field {
            margin-bottom: 15px;
          }
          
          .field-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
          }
          
          .field-value {
            color: #333;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          .items-table th,
          .items-table td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
          }
          
          .items-table th {
            background: #f8f9fa;
            font-weight: bold;
            color: #555;
          }
          
          .items-table tbody tr:nth-child(even) {
            background: #f8f9fa;
          }
          
          .urgency-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .urgency-low { background: #d4edda; color: #155724; }
          .urgency-medium { background: #fff3cd; color: #856404; }
          .urgency-high { background: #f8d7da; color: #721c24; }
          .urgency-urgent { background: #f5c6cb; color: #721c24; }
          
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-pending { background: #fff3cd; color: #856404; }
          .status-quoted { background: #d1ecf1; color: #0c5460; }
          .status-accepted { background: #d4edda; color: #155724; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          
          .price-section {
            background: #f8f9fa;
            border: 2px solid #D72638;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          
          .total-price {
            font-size: 32px;
            font-weight: bold;
            color: #D72638;
            margin: 10px 0;
          }
          
          .price-note {
            font-size: 14px;
            color: #666;
            font-style: italic;
          }
          
          .message-section {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .contact-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            color: rgba(215, 38, 56, 0.1);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
          }
          
          @media print {
            .container {
              padding: 0;
            }
            
            .section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- Header -->
          <div class="header">
            <div class="company-logo">A.M.O DISTRIBUTION</div>
            <div class="company-details">
              Auto Parts Specialists | Mauritius<br>
              📞 +230 5712-3456 | 📧 amodistribution.mu@gmail.com
            </div>
          </div>
          
          <!-- Quote Information -->
          <div class="quote-info">
            <div class="quote-details">
              <h2 style="margin: 0 0 10px 0; color: #D72638;">
                ${isQuoted ? "QUOTE RESPONSE" : "QUOTE REQUEST"}
              </h2>
              <div class="field">
                <div class="field-label">Quote Number:</div>
                <div class="field-value" style="font-size: 18px; font-weight: bold;">${
                  quote.quoteNumber
                }</div>
              </div>
              <div class="field">
                <div class="field-label">Status:</div>
                <div class="field-value">
                  <span class="status-badge status-${quote.status}">${
      quote.status
    }</span>
                </div>
              </div>
              <div class="field">
                <div class="field-label">Priority:</div>
                <div class="field-value">
                  <span class="urgency-badge urgency-${quote.urgency}">${
      quote.urgency
    }</span>
                </div>
              </div>
            </div>
            
            <div class="document-info">
              <div class="field">
                <div class="field-label">Document Date:</div>
                <div class="field-value">${currentDate}</div>
              </div>
              <div class="field">
                <div class="field-label">Request Date:</div>
                <div class="field-value">${new Date(
                  quote.createdAt
                ).toLocaleDateString()}</div>
              </div>
              ${
                quote.quotedAt
                  ? `
              <div class="field">
                <div class="field-label">Quote Date:</div>
                <div class="field-value">${new Date(
                  quote.quotedAt
                ).toLocaleDateString()}</div>
              </div>
              `
                  : ""
              }
              ${
                quote.validUntil
                  ? `
              <div class="field">
                <div class="field-label">Valid Until:</div>
                <div class="field-value">${new Date(
                  quote.validUntil
                ).toLocaleDateString()}</div>
              </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <!-- Customer Information -->
          <div class="section">
            <div class="section-header">👤 Customer Information</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="field">
                    <div class="field-label">Name:</div>
                    <div class="field-value">${quote.customer.name}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value">${quote.customer.email}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value">${quote.customer.phone}</div>
                  </div>
                </div>
                <div class="column">
                  ${
                    quote.customer.company
                      ? `
                  <div class="field">
                    <div class="field-label">Company:</div>
                    <div class="field-value">${quote.customer.company}</div>
                  </div>
                  `
                      : ""
                  }
                  <div class="field">
                    <div class="field-label">Preferred Contact:</div>
                    <div class="field-value" style="text-transform: capitalize;">
                      ${quote.preferredContact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Vehicle Information -->
          <div class="section">
            <div class="section-header">🚗 Vehicle Information</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="field">
                    <div class="field-label">Make:</div>
                    <div class="field-value">${quote.vehicle.make}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Model:</div>
                    <div class="field-value">${quote.vehicle.model}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Year:</div>
                    <div class="field-value">${quote.vehicle.year}</div>
                  </div>
                </div>
                <div class="column">
                  ${
                    quote.vehicle.engine
                      ? `
                  <div class="field">
                    <div class="field-label">Engine:</div>
                    <div class="field-value">${quote.vehicle.engine}</div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    quote.vehicle.vin
                      ? `
                  <div class="field">
                    <div class="field-label">VIN:</div>
                    <div class="field-value">${quote.vehicle.vin}</div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    quote.vehicle.trim
                      ? `
                  <div class="field">
                    <div class="field-label">Trim:</div>
                    <div class="field-value">${quote.vehicle.trim}</div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
          
          <!-- Requested Parts -->
          <div class="section">
            <div class="section-header">🔧 ${
              isQuoted ? "Quoted Parts" : "Requested Parts"
            }</div>
            <div class="section-content">
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 40%;">Part Name</th>
                    <th style="width: 35%;">Description</th>
                    <th style="width: 10%;">Quantity</th>
                    <th style="width: 10%;">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${quote.items
                    .map(
                      (item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td style="font-weight: bold;">${item.name}</td>
                      <td>${item.description || "-"}</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="font-size: 12px;">${item.notes || "-"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Customer Message -->
          ${
            quote.message
              ? `
          <div class="section">
            <div class="section-header">💬 Customer Message</div>
            <div class="section-content">
              <div class="message-section">
                "${quote.message}"
              </div>
            </div>
          </div>
          `
              : ""
          }
          
          <!-- Quote Response (if quoted) -->
          ${
            isQuoted
              ? `
          <div class="price-section">
            <h3 style="margin: 0 0 10px 0; color: #D72638;">TOTAL QUOTED PRICE</h3>
            <div class="total-price">Rs ${quote.quotedPrice?.toLocaleString()}</div>
            <div class="price-note">Price is valid until ${
              quote.validUntil
                ? new Date(quote.validUntil).toLocaleDateString()
                : "specified date"
            }</div>
          </div>
          
          ${
            quote.quotationNotes
              ? `
          <div class="section">
            <div class="section-header">📝 Quote Notes</div>
            <div class="section-content">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #D72638;">
                ${quote.quotationNotes}
              </div>
            </div>
          </div>
          `
              : ""
          }
          `
              : ""
          }
          
          <!-- Contact Information -->
          <div class="contact-info">
            <h4 style="margin: 0 0 10px 0; color: #D72638;">📞 Contact Information</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Phone:</strong> +230 5712-3456<br>
                <strong>Email:</strong> amodistribution.mu@gmail.com<br>
                <strong>WhatsApp:</strong> +230 5712-3456
              </div>
              <div style="text-align: right; color: #666;">
                <strong>Business Hours:</strong><br>
                Monday - Saturday: 9:00 AM - 5:00 PM<br>
                Sunday: Closed
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>
              <strong>A.M.O Distribution</strong> - Your Trusted Auto Parts Partner<br>
              Serving Mauritius with Quality Auto Parts Since Inception<br><br>
              <em>This document was generated on ${currentDate}</em>
            </p>
          </div>
          
        </div>
        
        <!-- Watermark -->
        <div class="watermark">${quote.status.toUpperCase()}</div>
        
      </body>
      </html>
    `;
  }
}

export const pdfGenerator = new PDFGenerator();
