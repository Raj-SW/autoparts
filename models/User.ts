import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "customer";
  phone?: string;
  phoneNumber?: string; // Keep for backward compatibility
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emailVerified: boolean;
  isEmailVerified?: boolean; // Keep for backward compatibility
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastLogin?: Date; // Keep for backward compatibility
  isActive: boolean;
  adminNotes?: string;
}

export const UserSchema = {
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  name: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "customer"], default: "customer" },
  phone: { type: "string" },
  phoneNumber: { type: "string" }, // Keep for backward compatibility
  address: {
    street: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    zipCode: { type: "string" },
    country: { type: "string" },
  },
  emailVerified: { type: "boolean", default: false },
  isEmailVerified: { type: "boolean", default: false }, // Keep for backward compatibility
  emailVerificationToken: { type: "string" },
  passwordResetToken: { type: "string" },
  passwordResetExpires: { type: "date" },
  refreshToken: { type: "string" },
  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  lastLoginAt: { type: "date" },
  lastLogin: { type: "date" }, // Keep for backward compatibility
  isActive: { type: "boolean", default: true },
  adminNotes: { type: "string" },
};
