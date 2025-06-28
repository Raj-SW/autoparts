import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = cloudinary.config();

    const hasConfig = !!(
      config.cloud_name &&
      config.api_key &&
      config.api_secret
    );

    if (!hasConfig) {
      return NextResponse.json(
        {
          error: "Cloudinary not configured properly",
          config: {
            cloud_name: !!config.cloud_name,
            api_key: !!config.api_key,
            api_secret: !!config.api_secret,
          },
        },
        { status: 500 }
      );
    }

    // Test Cloudinary connection with a simple API call
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      message: "Cloudinary is configured and accessible",
      status: result.status,
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? "***configured***" : "missing",
        api_secret: config.api_secret ? "***configured***" : "missing",
      },
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    return NextResponse.json(
      {
        error: "Cloudinary connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
