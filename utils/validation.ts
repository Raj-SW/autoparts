import { z } from "zod";

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// Part validation schemas
export const createPartSchema = z.object({
  partNumber: z.string().min(1, "Part number is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  manufacturer: z.string().optional(),
  compatibility: z.object({
    make: z.array(z.string()),
    model: z.array(z.string()),
    year: z.array(z.number()),
    engine: z.array(z.string()).optional(),
  }),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive("Cost price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU is required"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        publicId: z.string().min(1, "Public ID is required"),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
    )
    .optional(),
  specifications: z
    .object({
      weight: z.number().positive().optional(),
      dimensions: z
        .object({
          length: z.number().positive().optional(),
          width: z.number().positive().optional(),
          height: z.number().positive().optional(),
        })
        .optional(),
      material: z.string().optional(),
      color: z.string().optional(),
      warranty: z.string().optional(),
      condition: z.enum(["new", "used", "refurbished"]),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  searchKeywords: z.array(z.string()).optional(),
});

export const updatePartSchema = createPartSchema.partial();

// Order validation schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        partId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "At least one item is required"),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.enum(["stripe", "paypal", "cash", "bank_transfer"]),
  customerNotes: z.string().optional(),
});

// Quote validation schemas
export const createQuoteSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    company: z.string().optional(),
  }),
  vehicle: z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    vin: z.string().optional(),
    engine: z.string().optional(),
    trim: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Part name is required"),
        description: z.string().optional(),
        quantity: z.number().int().positive(),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
  message: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]),
  preferredContact: z.enum(["email", "phone", "whatsapp"]),
});

// Checkout order schema (simplified for our checkout process)
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        partId: z.string().min(1, "Part ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
  shipping: z.object({
    method: z.string().min(1, "Shipping method is required"),
    cost: z.number().min(0, "Shipping cost must be non-negative"),
    estimatedDays: z
      .number()
      .min(1, "Estimated delivery days must be at least 1"),
    address: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(8, "Phone number must be at least 8 characters"),
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(1, "City is required"),
      postalCode: z.string().optional(),
      country: z.string().min(1, "Country is required"),
    }),
  }),
  payment: z.object({
    method: z.enum(["card", "cod"], {
      required_error: "Payment method is required",
    }),
    status: z
      .enum(["pending", "processing", "paid", "failed", "refunded"])
      .optional(),
    paymentIntentId: z.string().optional(),
    cardDetails: z
      .object({
        cardNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        cvv: z.string().optional(),
        cardHolder: z.string().optional(),
      })
      .optional(),
  }),
  customerNotes: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
});

// Partner validation schemas
export const createPartnerApplicationSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  businessType: z.enum(["garage", "workshop", "dealer", "mechanic", "other"], {
    required_error: "Business type is required",
  }),
  yearsOperation: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"], {
    required_error: "Years of operation is required",
  }),
  location: z.string().min(2, "Location is required"),
  address: z.string().min(5, "Full address is required"),

  contactName: z.string().min(2, "Contact name is required"),
  position: z.string().min(2, "Position is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),

  specialization: z
    .array(z.string())
    .min(1, "At least one vehicle type must be selected"),
  monthlyVolume: z.enum(
    ["under-10k", "10k-25k", "25k-50k", "50k-100k", "over-100k"],
    {
      required_error: "Monthly volume estimate is required",
    }
  ),
  currentSuppliers: z.string().optional(),
  additionalInfo: z.string().optional(),

  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the partnership terms and conditions",
  }),
  marketingConsent: z.boolean().optional(),
});

export const updatePartnerStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "under_review"]),
  partnerLevel: z.enum(["bronze", "silver", "gold"]).optional(),
  discountRate: z.number().min(0).max(50).optional(),
  creditLimit: z.number().min(0).optional(),
  adminNotes: z.string().optional(),
});

// Helper function to validate data
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parseAsync(data);
}
