import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export const UserSchema = {
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  name: { type: "string", required: true },
  role: { type: "string", enum: ["admin", "user"], default: "user" },
  phoneNumber: { type: "string" },
  address: {
    street: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    zipCode: { type: "string" },
    country: { type: "string" },
  },
  isEmailVerified: { type: "boolean", default: false },
  emailVerificationToken: { type: "string" },
  passwordResetToken: { type: "string" },
  passwordResetExpires: { type: "date" },
  refreshToken: { type: "string" },
  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  lastLogin: { type: "date" },
  isActive: { type: "boolean", default: true },
};
