import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is required");
  }
  return secret;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
}

interface RefreshTokenPayload {
  userId: string;
  tokenVersion?: number;
}

export function generateTokens(user: {
  _id: ObjectId;
  email: string;
  role: "admin" | "user";
}) {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  // Generate access token (expires in 15 minutes)
  const accessToken = jwt.sign(payload, getJwtSecret(), {
    expiresIn: "15m",
  });

  // Generate refresh token (expires in 7 days)
  const refreshPayload: RefreshTokenPayload = {
    userId: user._id.toString(),
    tokenVersion: 0, // Can be used to invalidate tokens
  };

  const refreshToken = jwt.sign(refreshPayload, getJwtRefreshSecret(), {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, getJwtRefreshSecret()) as RefreshTokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export function generateEmailVerificationToken(email: string): string {
  return jwt.sign({ email, type: "email-verification" }, getJwtSecret(), {
    expiresIn: "24h",
  });
}

export function generatePasswordResetToken(userId: string): string {
  return jwt.sign({ userId, type: "password-reset" }, getJwtSecret(), {
    expiresIn: "1h",
  });
}

export function verifyEmailToken(token: string): { email: string } {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (decoded.type !== "email-verification") {
      throw new Error("Invalid token type");
    }
    return { email: decoded.email };
  } catch (error) {
    throw new Error("Invalid or expired email verification token");
  }
}

export function verifyPasswordResetToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (decoded.type !== "password-reset") {
      throw new Error("Invalid token type");
    }
    return { userId: decoded.userId };
  } catch (error) {
    throw new Error("Invalid or expired password reset token");
  }
}
