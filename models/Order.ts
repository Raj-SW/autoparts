import { ObjectId } from "mongodb";

export interface IOrderItem {
  partId: ObjectId;
  partNumber: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  discount?: number;
  image?: string;
}

export interface IOrder {
  _id?: ObjectId;
  orderNumber: string;
  userId: ObjectId;

  // Customer information
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  // Order items
  items: IOrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  currency: string;

  // Payment
  paymentMethod: "stripe" | "paypal" | "cash" | "bank_transfer";
  paymentStatus: "pending" | "processing" | "paid" | "failed" | "refunded";
  paymentIntentId?: string;
  paidAt?: Date;

  // Shipping
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;

  // Order status
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

  // Notes
  customerNotes?: string;
  adminNotes?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
}

export const OrderSchema = {
  orderNumber: { type: "string", required: true, unique: true },
  userId: { type: "objectId", required: true },

  customer: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    phone: { type: "string", required: true },
    address: {
      street: { type: "string", required: true },
      city: { type: "string", required: true },
      state: { type: "string", required: true },
      zipCode: { type: "string", required: true },
      country: { type: "string", required: true },
    },
  },

  items: { type: "array", required: true },

  subtotal: { type: "number", required: true },
  tax: { type: "number", required: true },
  shipping: { type: "number", required: true },
  discount: { type: "number" },
  total: { type: "number", required: true },
  currency: { type: "string", default: "USD" },

  paymentMethod: {
    type: "string",
    enum: ["stripe", "paypal", "cash", "bank_transfer"],
    required: true,
  },
  paymentStatus: {
    type: "string",
    enum: ["pending", "processing", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentIntentId: { type: "string" },
  paidAt: { type: "date" },

  shippingMethod: { type: "string", required: true },
  trackingNumber: { type: "string" },
  estimatedDelivery: { type: "date" },
  actualDelivery: { type: "date" },

  status: {
    type: "string",
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
    default: "pending",
  },

  customerNotes: { type: "string" },
  adminNotes: { type: "string" },

  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  confirmedAt: { type: "date" },
  shippedAt: { type: "date" },
  deliveredAt: { type: "date" },
  cancelledAt: { type: "date" },
  refundedAt: { type: "date" },
};
