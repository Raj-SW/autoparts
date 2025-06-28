import { ObjectId } from "mongodb";

export interface IPart {
  _id?: ObjectId;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  manufacturer?: string;

  // Compatibility object (replaces individual vehicle fields)
  compatibility: Record<string, any>;

  // Pricing
  price: number;
  costPrice: number;
  currency: string;

  // Inventory
  stock: number;
  lowStockThreshold: number;
  sku: string;
  location?: string;

  // Images array with objects containing url, publicId, width, height
  images: {
    url: string;
    publicId: string;
    width: number;
    height: number;
  }[];

  // Specifications as generic object
  specifications: Record<string, any>;

  // SEO and search
  tags: string[];
  searchKeywords: string[];

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Ratings and reviews
  averageRating: number;
  reviewCount: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  lastModifiedBy: ObjectId;
}

export const PartSchema = {
  partNumber: { type: "string", required: true, unique: true },
  name: { type: "string", required: true },
  description: { type: "string", required: true },
  category: { type: "string", required: true },
  subcategory: { type: "string" },
  brand: { type: "string", required: true },
  manufacturer: { type: "string" },

  compatibility: { type: "object" },

  price: { type: "number", required: true },
  costPrice: { type: "number", required: true },
  currency: { type: "string", default: "USD" },

  stock: { type: "number", required: true, default: 0 },
  lowStockThreshold: { type: "number", default: 10 },
  sku: { type: "string", required: true, unique: true },
  location: { type: "string" },

  images: { type: "array", default: [] },

  specifications: { type: "object" },

  tags: { type: "array", default: [] },
  searchKeywords: { type: "array", default: [] },

  isActive: { type: "boolean", default: true },
  isFeatured: { type: "boolean", default: false },

  averageRating: { type: "number" },
  reviewCount: { type: "number", default: 0 },

  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  createdBy: { type: "objectId" },
  lastModifiedBy: { type: "objectId" },
};
