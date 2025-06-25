import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { verifyRefreshToken, generateTokens } from "@/lib/auth/jwt";
import { IUser } from "@/models/User";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Get database connection
    const db = await getDatabase();
    const usersCollection = db.collection<IUser>("users");

    // Find user and verify stored refresh token
    const user = await usersCollection.findOne({
      _id: new ObjectId(payload.userId),
      refreshToken: refreshToken,
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid refresh token or user not found" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokens({
      _id: user._id!,
      email: user.email,
      role: user.role,
    });

    // Update refresh token in database
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
          updatedAt: new Date(),
        },
      }
    );

    // Return new tokens
    return NextResponse.json({
      message: "Tokens refreshed successfully",
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Failed to refresh tokens" },
      { status: 500 }
    );
  }
}
