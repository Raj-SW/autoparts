import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { verifyPassword } from "@/lib/auth/password";
import { generateTokens } from "@/lib/auth/jwt";
import { loginSchema } from "@/utils/validation";
import { IUser } from "@/models/User";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await loginSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const { email, password } = validatedData;

    // Get database connection
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    // Find user by email
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if email is verified (optional - you can make this required)
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Email not verified",
          message: "Please verify your email before logging in",
        },
        { status: 403 }
      );
    }

    // Generate tokens
    const tokens = generateTokens({
      _id: user._id!,
      email: user.email,
      role: user.role,
    });

    // Update last login time
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          refreshToken: tokens.refreshToken, // Store refresh token
        },
      }
    );

    // Return success response with tokens
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id!.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again later." },
      { status: 500 }
    );
  }
}
