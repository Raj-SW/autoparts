import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, AuthUser } from "@/middleware/auth";
import { updateProfileSchema, changePasswordSchema } from "@/utils/validation";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from "@/lib/auth/password";
import { IUser } from "@/models/User";
import { ObjectId } from "mongodb";
import { z } from "zod";

// GET /api/auth/profile - Get current user profile
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    const userProfile = await usersCollection.findOne(
      { _id: new ObjectId(user.userId) },
      {
        projection: {
          password: 0,
          refreshToken: 0,
          emailVerificationToken: 0,
          passwordResetToken: 0,
        },
      }
    );

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userProfile._id!.toString(),
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        phoneNumber: userProfile.phoneNumber,
        address: userProfile.address,
        isEmailVerified: userProfile.isEmailVerified,
        createdAt: userProfile.createdAt,
        lastLogin: userProfile.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
});

// PUT /api/auth/profile - Update user profile
export const PUT = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await updateProfileSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    // Check if email is being updated and ensure uniqueness
    if (validatedData.email) {
      const existingUser = await usersCollection.findOne({
        email: validatedData.email,
        _id: { $ne: new ObjectId(user.userId) },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) {
      updateData.email = validatedData.email;
      // Reset email verification when email is changed
      updateData.isEmailVerified = false;
    }
    if (validatedData.phoneNumber !== undefined)
      updateData.phoneNumber = validatedData.phoneNumber;
    if (validatedData.address) updateData.address = validatedData.address;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
});

// PATCH /api/auth/profile/password - Change password
export const PATCH = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await changePasswordSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const { currentPassword, newPassword } = validatedData;

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Weak password", issues: passwordValidation.errors },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    // Get user with password
    const userDoc = await usersCollection.findOne({
      _id: new ObjectId(user.userId),
    });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(
      currentPassword,
      userDoc.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: { refreshToken: "" }, // Invalidate refresh token
      }
    );

    return NextResponse.json({
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
});
