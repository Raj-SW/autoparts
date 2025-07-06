import { sendEmail } from "./email-service";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    partNumber: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    method: string;
    address: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      country: string;
    };
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const subject = `Order Confirmation - ${orderData.orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #D72638; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 18px; color: #D72638; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { background-color: #D72638; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <h2>Hello ${orderData.customerName},</h2>
          <p>We've received your order and are preparing it for shipment. Here are the details:</p>
          
          <div class="order-details">
            <h3>Order #${orderData.orderNumber}</h3>
            <p><strong>Estimated Delivery:</strong> ${
              orderData.estimatedDelivery
                ? formatDate(orderData.estimatedDelivery)
                : "TBD"
            }</p>
            <p><strong>Shipping Method:</strong> ${
              orderData.shipping.method
            }</p>
            
            <h4>Items Ordered:</h4>
            ${orderData.items
              .map(
                (item) => `
              <div class="item">
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <strong>${item.name}</strong><br>
                    <small>Part #: ${item.partNumber}</small><br>
                    <small>Quantity: ${item.quantity}</small>
                  </div>
                  <div style="text-align: right;">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #D72638;">
              <div style="display: flex; justify-content: space-between;">
                <span class="total">Total:</span>
                <span class="total">${formatPrice(orderData.total)}</span>
              </div>
            </div>
          </div>
          
          <div class="order-details">
            <h4>Shipping Address:</h4>
            <p>
              ${orderData.shipping.address.firstName} ${
    orderData.shipping.address.lastName
  }<br>
              ${orderData.shipping.address.address}<br>
              ${orderData.shipping.address.city}, ${
    orderData.shipping.address.country
  }
            </p>
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_API_URL}/track?order=${
    orderData.orderNumber
  }" class="button">
              Track Your Order
            </a>
          </p>
          
          <p>If you have any questions, please don't hesitate to contact our customer support team.</p>
        </div>
        
        <div class="footer">
          <p>AutoParts Mauritius<br>
          Email: support@autoparts.mu | Phone: +230 5712 3456</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Order Confirmation - ${orderData.orderNumber}
    
    Hello ${orderData.customerName},
    
    We've received your order and are preparing it for shipment.
    
    Order Details:
    - Order Number: ${orderData.orderNumber}
    - Total: ${formatPrice(orderData.total)}
    - Estimated Delivery: ${
      orderData.estimatedDelivery
        ? formatDate(orderData.estimatedDelivery)
        : "TBD"
    }
    - Shipping Method: ${orderData.shipping.method}
    
    Items:
    ${orderData.items
      .map(
        (item) =>
          `- ${item.name} (${item.partNumber}) x${
            item.quantity
          } - ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n")}
    
    Track your order: ${process.env.NEXT_PUBLIC_API_URL}/track?order=${
    orderData.orderNumber
  }
    
    Thank you for choosing AutoParts Mauritius!
  `;

  try {
    await sendEmail({
      to: orderData.customerEmail,
      subject,
      html,
      text,
    });
    console.log(
      `Order confirmation email sent for order ${orderData.orderNumber}`
    );
  } catch (error) {
    console.error(
      `Failed to send order confirmation email for ${orderData.orderNumber}:`,
      error
    );
  }
}

export async function sendOrderStatusUpdateEmail(
  orderData: OrderEmailData,
  newStatus: string,
  trackingNumber?: string
) {
  const statusMessages = {
    confirmed:
      "Your order has been confirmed and is being prepared for shipment.",
    processing:
      "Your order is currently being processed and prepared for shipment.",
    shipped:
      "Great news! Your order has been shipped and is on its way to you.",
    delivered:
      "Your order has been delivered successfully. We hope you're satisfied with your purchase!",
    cancelled:
      "Your order has been cancelled. If you have any questions, please contact our support team.",
  };

  const statusTitles = {
    confirmed: "Order Confirmed",
    processing: "Order Processing",
    shipped: "Order Shipped",
    delivered: "Order Delivered",
    cancelled: "Order Cancelled",
  };

  const subject = `${
    statusTitles[newStatus as keyof typeof statusTitles] || "Order Update"
  } - ${orderData.orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #D72638; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .status-update { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #D72638; }
        .button { background-color: #D72638; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update</h1>
          <p>Order #${orderData.orderNumber}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${orderData.customerName},</h2>
          
          <div class="status-update">
            <h3>${
              statusTitles[newStatus as keyof typeof statusTitles] ||
              "Order Update"
            }</h3>
            <p>${
              statusMessages[newStatus as keyof typeof statusMessages] ||
              "Your order status has been updated."
            }</p>
            
            ${
              trackingNumber
                ? `
              <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
              <p>You can use this tracking number to monitor your shipment with the carrier.</p>
            `
                : ""
            }
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_API_URL}/track?order=${
    orderData.orderNumber
  }" class="button">
              Track Your Order
            </a>
          </p>
          
          <p>If you have any questions, please don't hesitate to contact our customer support team.</p>
        </div>
        
        <div class="footer">
          <p>AutoParts Mauritius<br>
          Email: support@autoparts.mu | Phone: +230 5712 3456</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Order Update - ${orderData.orderNumber}
    
    Hello ${orderData.customerName},
    
    ${
      statusMessages[newStatus as keyof typeof statusMessages] ||
      "Your order status has been updated."
    }
    
    ${trackingNumber ? `Tracking Number: ${trackingNumber}` : ""}
    
    Track your order: ${process.env.NEXT_PUBLIC_API_URL}/track?order=${
    orderData.orderNumber
  }
    
    Thank you for choosing AutoParts Mauritius!
  `;

  try {
    await sendEmail({
      to: orderData.customerEmail,
      subject,
      html,
      text,
    });
    console.log(
      `Order status update email sent for order ${orderData.orderNumber}`
    );
  } catch (error) {
    console.error(
      `Failed to send order status update email for ${orderData.orderNumber}:`,
      error
    );
  }
}
