import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { generateTokens, generateEmailVerificationToken } from "@/lib/auth/jwt";
import { registerSchema } from "@/utils/validation";
import { IUser } from "@/models/User";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await registerSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const { email, password, name, phoneNumber } = validatedData;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Weak password", issues: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken(email);

    // Create new user
    const newUser: Omit<IUser, "_id"> = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phoneNumber,
      role: "user",
      isEmailVerified: false,
      emailVerificationToken,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    if (!result.insertedId) {
      throw new Error("Failed to create user");
    }

    // Generate tokens
    const tokens = generateTokens({
      _id: result.insertedId,
      email: newUser.email,
      role: newUser.role,
    });

    // TODO: Send verification email
    console.log("Verification token:", emailVerificationToken);

    // Return success response with tokens
    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: result.insertedId.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
