import jsPDF from "jspdf";

interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state?: string;
      zipCode?: string;
      country: string;
    };
  };
  items: Array<{
    name: string;
    partNumber: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  const doc = new jsPDF();

  // Company colors
  const primaryColor = [215, 38, 56]; // #D72638
  const darkGray = [51, 51, 51];
  const lightGray = [128, 128, 128];

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Set up the document
  let yPosition = 20;

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("AutoParts Mauritius", 20, 32);

  // Invoice details (top right)
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 140, 25);
  doc.text(`Order #: ${invoiceData.orderNumber}`, 140, 30);
  doc.text(`Date: ${formatDate(invoiceData.invoiceDate)}`, 140, 35);

  yPosition = 55;

  // Company information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("From:", 20, yPosition);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  yPosition += 5;
  doc.text("AutoParts Mauritius", 20, yPosition);
  yPosition += 4;
  doc.text("123 Royal Road", 20, yPosition);
  yPosition += 4;
  doc.text("Port Louis, Mauritius", 20, yPosition);
  yPosition += 4;
  doc.text("Phone: +230 5712 3456", 20, yPosition);
  yPosition += 4;
  doc.text("Email: info@autoparts.mu", 20, yPosition);

  // Customer information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 110, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let customerY = 60;
  doc.text(invoiceData.customer.name, 110, customerY);
  customerY += 4;
  doc.text(invoiceData.customer.email, 110, customerY);
  customerY += 4;
  doc.text(invoiceData.customer.phone, 110, customerY);
  customerY += 4;
  doc.text(invoiceData.customer.address.street, 110, customerY);
  customerY += 4;
  doc.text(
    `${invoiceData.customer.address.city}, ${invoiceData.customer.address.country}`,
    110,
    customerY
  );

  yPosition = Math.max(yPosition, customerY) + 15;

  // Items table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition, 170, 8, "F");

  doc.setTextColor(...darkGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 22, yPosition + 5);
  doc.text("Part #", 100, yPosition + 5);
  doc.text("Qty", 130, yPosition + 5);
  doc.text("Price", 145, yPosition + 5);
  doc.text("Total", 170, yPosition + 5);

  yPosition += 10;

  // Items
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  invoiceData.items.forEach((item, index) => {
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPosition - 2, 170, 8, "F");
    }

    doc.setTextColor(...darkGray);
    doc.text(item.name, 22, yPosition + 3);
    doc.text(item.partNumber, 100, yPosition + 3);
    doc.text(item.quantity.toString(), 130, yPosition + 3);
    doc.text(formatPrice(item.price), 145, yPosition + 3);
    doc.text(formatPrice(item.total), 170, yPosition + 3);

    yPosition += 8;
  });

  yPosition += 5;

  // Totals section
  const totalsStartY = yPosition;

  // Subtotal
  doc.setFontSize(9);
  doc.text("Subtotal:", 140, yPosition);
  doc.text(formatPrice(invoiceData.subtotal), 170, yPosition);
  yPosition += 6;

  // Shipping
  if (invoiceData.shipping > 0) {
    doc.text("Shipping:", 140, yPosition);
    doc.text(formatPrice(invoiceData.shipping), 170, yPosition);
    yPosition += 6;
  }

  // Discount
  if (invoiceData.discount && invoiceData.discount > 0) {
    doc.text("Discount:", 140, yPosition);
    doc.text(`-${formatPrice(invoiceData.discount)}`, 170, yPosition);
    yPosition += 6;
  }

  // Tax
  if (invoiceData.tax > 0) {
    doc.text("Tax (VAT):", 140, yPosition);
    doc.text(formatPrice(invoiceData.tax), 170, yPosition);
    yPosition += 6;
  }

  // Total
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(140, yPosition, 190, yPosition);
  yPosition += 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text("Total:", 140, yPosition);
  doc.text(formatPrice(invoiceData.total), 170, yPosition);

  yPosition += 15;

  // Payment information
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Payment Information:", 20, yPosition);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  yPosition += 5;
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, yPosition);
  yPosition += 4;
  doc.text(`Payment Status: ${invoiceData.paymentStatus}`, 20, yPosition);

  if (invoiceData.dueDate && invoiceData.paymentStatus !== "paid") {
    yPosition += 4;
    doc.text(`Due Date: ${formatDate(invoiceData.dueDate)}`, 20, yPosition);
  }

  // Notes
  if (invoiceData.notes) {
    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 20, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 5;

    // Split notes into multiple lines if needed
    const noteLines = doc.splitTextToSize(invoiceData.notes, 170);
    noteLines.forEach((line: string) => {
      doc.text(line, 20, yPosition);
      yPosition += 4;
    });
  }

  // Footer
  yPosition = 280;
  doc.setTextColor(...lightGray);
  doc.setFontSize(8);
  doc.text("Thank you for your business!", 20, yPosition);
  doc.text(
    "AutoParts Mauritius - Your trusted automotive parts supplier",
    20,
    yPosition + 4
  );

  return doc;
}

export function generateInvoiceNumber(orderNumber: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const orderSuffix = orderNumber.replace("AMO-", "");

  return `INV-${year}${month}-${orderSuffix}`;
}

export async function generateAndSaveInvoice(
  invoiceData: InvoiceData
): Promise<Buffer> {
  const pdf = generateInvoicePDF(invoiceData);
  return Buffer.from(pdf.output("arraybuffer"));
}
