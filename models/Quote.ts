import { ObjectId } from "mongodb";

export interface IQuoteItem {
  partId?: ObjectId;
  partNumber?: string;
  name: string;
  description?: string;
  quantity: number;
  notes?: string;
}

export interface IQuote {
  _id?: ObjectId;
  quoteNumber: string;
  userId?: ObjectId;

  // Customer information
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };

  // Vehicle information
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin?: string;
    engine?: string;
    trim?: string;
  };

  // Quote items
  items: IQuoteItem[];

  // Additional information
  message?: string;
  urgency: "low" | "medium" | "high" | "urgent";
  preferredDeliveryDate?: Date;

  // Quote response
  quotedPrice?: number;
  quotedBy?: ObjectId;
  quotedAt?: Date;
  validUntil?: Date;
  quotationNotes?: string;

  // Status
  status: "pending" | "quoted" | "accepted" | "rejected" | "expired";

  // Communication preferences
  preferredContact: "email" | "phone" | "whatsapp";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

export const QuoteSchema = {
  quoteNumber: { type: "string", required: true, unique: true },
  userId: { type: "objectId" },

  customer: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    phone: { type: "string", required: true },
    company: { type: "string" },
    address: {
      street: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      zipCode: { type: "string" },
      country: { type: "string" },
    },
  },

  vehicle: {
    make: { type: "string", required: true },
    model: { type: "string", required: true },
    year: { type: "number", required: true },
    vin: { type: "string" },
    engine: { type: "string" },
    trim: { type: "string" },
  },

  items: { type: "array", required: true },

  message: { type: "string" },
  urgency: {
    type: "string",
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  preferredDeliveryDate: { type: "date" },

  quotedPrice: { type: "number" },
  quotedBy: { type: "objectId" },
  quotedAt: { type: "date" },
  validUntil: { type: "date" },
  quotationNotes: { type: "string" },

  status: {
    type: "string",
    enum: ["pending", "quoted", "accepted", "rejected", "expired"],
    default: "pending",
  },

  preferredContact: {
    type: "string",
    enum: ["email", "phone", "whatsapp"],
    default: "email",
  },

  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  respondedAt: { type: "date" },
};
