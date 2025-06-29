import nodemailer from "nodemailer";
import { IQuote } from "@/models/Quote";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: "A.M.O Distribution",
          address: process.env.EMAIL_USER!,
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  async sendQuoteNotificationToAdmin(
    quote: IQuote,
    pdfBuffer: Buffer
  ): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || "nsseetohul@gmail.com";

    const subject = `🔔 New Quote Request - ${
      quote.quoteNumber
    } (${quote.urgency.toUpperCase()})`;

    const html = this.generateAdminQuoteNotificationHTML(quote);

    const attachments: EmailAttachment[] = [
      {
        filename: `Quote-${quote.quoteNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
      attachments,
    });
  }

  async sendQuoteConfirmationToCustomer(quote: IQuote): Promise<boolean> {
    const subject = `✅ Quote Request Received - ${quote.quoteNumber}`;

    const html = this.generateCustomerConfirmationHTML(quote);

    return this.sendEmail({
      to: quote.customer.email,
      subject,
      html,
    });
  }

  async sendQuoteResponseToCustomer(
    quote: IQuote,
    pdfBuffer?: Buffer
  ): Promise<boolean> {
    const subject = `💰 Quote Ready - ${quote.quoteNumber}`;

    const html = this.generateQuoteResponseHTML(quote);

    const attachments: EmailAttachment[] = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Quote-Response-${quote.quoteNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      });
    }

    return this.sendEmail({
      to: quote.customer.email,
      subject,
      html,
      attachments,
    });
  }

  private generateAdminQuoteNotificationHTML(quote: IQuote): string {
    const urgencyColor = {
      low: "#22c55e",
      medium: "#f59e0b",
      high: "#f97316",
      urgent: "#ef4444",
    }[quote.urgency];

    const urgencyIcon = {
      low: "🟢",
      medium: "🟡",
      high: "🟠",
      urgent: "🔴",
    }[quote.urgency];

    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${urgencyColor}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h1>${urgencyIcon} New Quote Request</h1>
          <p>Quote #${quote.quoteNumber}</p>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; margin-top: 10px;">
          <h3>Customer: ${quote.customer.name}</h3>
          <p>Email: ${quote.customer.email}</p>
          <p>Phone: ${quote.customer.phone}</p>
          <p>Vehicle: ${quote.vehicle.year} ${quote.vehicle.make} ${
      quote.vehicle.model
    }</p>
          
          <h4>Requested Parts:</h4>
          ${quote.items
            .map(
              (item) => `
            <div style="border: 1px solid #eee; padding: 10px; margin: 5px 0;">
              <strong>${item.name}</strong> (Qty: ${item.quantity})
              ${item.description ? `<br>Description: ${item.description}` : ""}
            </div>
          `
            )
            .join("")}
          
          ${
            quote.message
              ? `<p><strong>Message:</strong> ${quote.message}</p>`
              : ""
          }
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://wa.me/${quote.customer.phone.replace(
              /[^\d]/g,
              ""
            )}" 
               style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCustomerConfirmationHTML(quote: IQuote): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Request Confirmed</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Quote Request Confirmed</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Quote #${
            quote.quoteNumber
          }</p>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          
          <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #16a34a;">Thank you, ${
              quote.customer.name
            }! 🎉</h2>
            <p style="margin: 0; font-size: 16px; color: #555;">
              We've received your quote request and our team is already working on it. 
              You'll receive a detailed quote within <strong>1 hour during business hours</strong>.
            </p>
          </div>

          <!-- Quick Summary -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
            <h3 style="margin: 0 0 15px 0; color: #16a34a;">📋 Your Request Summary</h3>
            <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${
              quote.vehicle.year
            } ${quote.vehicle.make} ${quote.vehicle.model}</p>
            <p style="margin: 5px 0;"><strong>Parts Requested:</strong> ${
              quote.items.length
            } item(s)</p>
            <p style="margin: 5px 0;"><strong>Priority:</strong> ${
              quote.urgency.charAt(0).toUpperCase() + quote.urgency.slice(1)
            }</p>
            <p style="margin: 5px 0;"><strong>Preferred Contact:</strong> ${
              quote.preferredContact.charAt(0).toUpperCase() +
              quote.preferredContact.slice(1)
            }</p>
          </div>

          <!-- What's Next -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
            <h3 style="margin: 0 0 15px 0; color: #16a34a;">🚀 What happens next?</h3>
            <ol style="margin: 0; padding-left: 20px; color: #555;">
              <li style="margin-bottom: 8px;">Our experts review your request and check parts availability</li>
              <li style="margin-bottom: 8px;">We prepare a detailed quote with competitive pricing</li>
              <li style="margin-bottom: 8px;">You receive the quote via your preferred contact method</li>
              <li style="margin-bottom: 8px;">Once approved, we arrange delivery or pickup</li>
            </ol>
          </div>

          <!-- Contact Options -->
          <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin: 0 0 20px 0; color: #16a34a;">Need immediate assistance? 🤝</h3>
            <a href="https://wa.me/23057123456?text=Hi! I just submitted quote request ${
              quote.quoteNumber
            }. Can you help me with the status?" 
               style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; margin: 10px; font-weight: bold;">
              📱 WhatsApp Us
            </a>
            <a href="tel:+23057123456" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; margin: 10px; font-weight: bold;">
              📞 Call Us
            </a>
          </div>

          <!-- Business Hours -->
          <div style="background: #f1f3f5; padding: 20px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">⏰ Business Hours</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Monday - Saturday: 9:00 AM - 5:00 PM<br>
              Sunday: Closed<br><br>
              <strong>Quote Response Time:</strong> Within 1 hour during business hours<br>
              <strong>WhatsApp:</strong> Usually within 15 minutes!
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            A.M.O Distribution - Your Trusted Auto Parts Partner<br>
            📞 +230 5712-3456 | 📧 amodistribution.mu@gmail.com<br>
            🌐 Serving Mauritius with Quality Auto Parts
          </p>
        </div>

      </body>
      </html>
    `;
  }

  private generateQuoteResponseHTML(quote: IQuote): string {
    const validUntilDate = quote.validUntil
      ? new Date(quote.validUntil).toLocaleDateString()
      : "N/A";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Quote is Ready</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #D72638 0%, #B91C2C 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">💰 Your Quote is Ready!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Quote #${
            quote.quoteNumber
          }</p>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          
          <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #D72638;">Hello ${
              quote.customer.name
            }! 👋</h2>
            <p style="margin: 0; font-size: 16px; color: #555;">
              Great news! We've prepared your detailed quote for the requested auto parts.
            </p>
          </div>

          <!-- Quote Details -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #D72638;">
            <h3 style="margin: 0 0 15px 0; color: #D72638;">📋 Quote Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Total Price:</td>
                <td style="padding: 8px 0; font-size: 20px; font-weight: bold; color: #D72638;">Rs ${
                  quote.quotedPrice?.toLocaleString() || "Contact for price"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Valid Until:</td>
                <td style="padding: 8px 0;">${validUntilDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Vehicle:</td>
                <td style="padding: 8px 0;">${quote.vehicle.year} ${
      quote.vehicle.make
    } ${quote.vehicle.model}</td>
              </tr>
            </table>
          </div>

          <!-- Items -->
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #D72638;">
            <h3 style="margin: 0 0 15px 0; color: #D72638;">🔧 Quoted Items</h3>
            ${quote.items
              .map(
                (item) => `
              <div style="border: 1px solid #e9ecef; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${item.name}</h4>
                <p style="margin: 5px 0; color: #666;"><strong>Quantity:</strong> ${
                  item.quantity
                }</p>
                ${
                  item.description
                    ? `<p style="margin: 5px 0; color: #666;">${item.description}</p>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Quote Notes -->
          ${
            quote.quotationNotes
              ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 15px 0; color: #856404;">📝 Additional Notes</h3>
            <p style="margin: 0; color: #856404;">${quote.quotationNotes}</p>
          </div>
          `
              : ""
          }

          <!-- Action Buttons -->
          <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin: 0 0 20px 0; color: #D72638;">Ready to proceed? 🚀</h3>
            <a href="https://wa.me/23057123456?text=Hi! I received quote ${
              quote.quoteNumber
            } for Rs ${quote.quotedPrice?.toLocaleString()}. I would like to ACCEPT this quote and proceed with the order." 
               style="display: inline-block; background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 10px; font-weight: bold; font-size: 16px;">
              ✅ Accept Quote
            </a>
            <a href="https://wa.me/23057123456?text=Hi! I received quote ${
              quote.quoteNumber
            }. I have some questions about the quote. Can we discuss?" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 10px; font-weight: bold; font-size: 16px;">
              💬 Ask Questions
            </a>
          </div>

          <!-- Important Info -->
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
            <h4 style="margin: 0 0 10px 0; color: #dc2626;">⚠️ Important Information</h4>
            <ul style="margin: 0; padding-left: 20px; color: #dc2626;">
              <li>This quote is valid until ${validUntilDate}</li>
              <li>Prices may vary based on final part specifications</li>
              <li>Installation service available (additional charges apply)</li>
              <li>All parts come with manufacturer warranty</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="background: #f1f3f5; padding: 20px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">📞 Contact Us</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>Phone:</strong> +230 5712-3456<br>
              <strong>Email:</strong> amodistribution.mu@gmail.com<br>
              <strong>WhatsApp:</strong> +230 5712-3456<br><br>
              <em>We're here to help with any questions!</em>
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            A.M.O Distribution - Quality Auto Parts, Competitive Prices<br>
            Thank you for choosing us for your automotive needs! 🚗
          </p>
        </div>

      </body>
      </html>
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
