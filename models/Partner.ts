import { ObjectId } from "mongodb";

export interface IPartner {
  _id?: ObjectId;
  userId: ObjectId; // Reference to the user who submitted the application

  // Business Information
  businessName: string;
  businessType: "garage" | "workshop" | "dealer" | "mechanic" | "other";
  yearsOperation: "0-1" | "1-3" | "3-5" | "5-10" | "10+";
  location: string;
  address: string;

  // Contact Information
  contactName: string;
  position: string;
  phone: string;
  email: string;

  // Business Details
  specialization: string[]; // Vehicle types they service
  monthlyVolume: "under-10k" | "10k-25k" | "25k-50k" | "50k-100k" | "over-100k";
  currentSuppliers?: string;
  additionalInfo?: string;

  // Partnership Status
  status: "pending" | "approved" | "rejected" | "under_review";
  partnerLevel?: "bronze" | "silver" | "gold";
  discountRate?: number; // Percentage discount for approved partners
  creditLimit?: number; // Credit limit in currency

  // Admin Notes
  adminNotes?: string;
  reviewedBy?: ObjectId; // Admin who reviewed the application
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;

  // Terms Agreement
  termsAccepted: boolean;
  marketingConsent: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  applicationNumber: string; // Unique application number
}

export const PartnerSchema = {
  userId: { type: "objectId", required: true },

  businessName: { type: "string", required: true },
  businessType: {
    type: "string",
    enum: ["garage", "workshop", "dealer", "mechanic", "other"],
    required: true,
  },
  yearsOperation: {
    type: "string",
    enum: ["0-1", "1-3", "3-5", "5-10", "10+"],
    required: true,
  },
  location: { type: "string", required: true },
  address: { type: "string", required: true },

  contactName: { type: "string", required: true },
  position: { type: "string", required: true },
  phone: { type: "string", required: true },
  email: { type: "string", required: true },

  specialization: { type: "array", required: true },
  monthlyVolume: {
    type: "string",
    enum: ["under-10k", "10k-25k", "25k-50k", "50k-100k", "over-100k"],
    required: true,
  },
  currentSuppliers: { type: "string" },
  additionalInfo: { type: "string" },

  status: {
    type: "string",
    enum: ["pending", "approved", "rejected", "under_review"],
    default: "pending",
  },
  partnerLevel: {
    type: "string",
    enum: ["bronze", "silver", "gold"],
  },
  discountRate: { type: "number", min: 0, max: 50 },
  creditLimit: { type: "number", min: 0 },

  adminNotes: { type: "string" },
  reviewedBy: { type: "objectId" },
  reviewedAt: { type: "date" },
  approvedAt: { type: "date" },
  rejectedAt: { type: "date" },

  termsAccepted: { type: "boolean", required: true },
  marketingConsent: { type: "boolean", default: false },

  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  applicationNumber: { type: "string", required: true, unique: true },
};
