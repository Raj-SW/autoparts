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

  // Vehicle compatibility
  compatibility: {
    make: string[];
    model: string[];
    year: number[];
    engine?: string[];
  };

  // Pricing
  price: number;
  salePrice?: number;
  costPrice: number;
  currency: string;

  // Inventory
  stock: number;
  lowStockThreshold: number;
  sku: string;
  location?: string;

  // Images and media
  images: string[];
  thumbnailImage?: string;
  technicalDiagram?: string;

  // Specifications
  specifications: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    material?: string;
    color?: string;
    warranty?: string;
    condition: "new" | "used" | "refurbished";
  };

  // SEO and search
  tags: string[];
  searchKeywords: string[];

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Ratings and reviews
  averageRating?: number;
  reviewCount?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: ObjectId;
  lastModifiedBy?: ObjectId;
}

export const PartSchema = {
  partNumber: { type: "string", required: true, unique: true },
  name: { type: "string", required: true },
  description: { type: "string", required: true },
  category: { type: "string", required: true },
  subcategory: { type: "string" },
  brand: { type: "string", required: true },
  manufacturer: { type: "string" },

  compatibility: {
    make: { type: "array" },
    model: { type: "array" },
    year: { type: "array" },
    engine: { type: "array" },
  },

  price: { type: "number", required: true },
  salePrice: { type: "number" },
  costPrice: { type: "number", required: true },
  currency: { type: "string", default: "USD" },

  stock: { type: "number", required: true, default: 0 },
  lowStockThreshold: { type: "number", default: 10 },
  sku: { type: "string", required: true, unique: true },
  location: { type: "string" },

  images: { type: "array", default: [] },
  thumbnailImage: { type: "string" },
  technicalDiagram: { type: "string" },

  specifications: {
    weight: { type: "number" },
    dimensions: {
      length: { type: "number" },
      width: { type: "number" },
      height: { type: "number" },
    },
    material: { type: "string" },
    color: { type: "string" },
    warranty: { type: "string" },
    condition: {
      type: "string",
      enum: ["new", "used", "refurbished"],
      default: "new",
    },
  },

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
