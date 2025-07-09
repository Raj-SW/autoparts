import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

/**
 * Health check endpoint for Docker container monitoring
 * Checks application status and database connectivity
 */
export async function GET(request: NextRequest) {
  try {
    const healthCheck = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "unknown",
    };

    // Check database connectivity
    try {
      const db = await getDatabase();
      await db.admin().ping();
      healthCheck.database = "connected";
    } catch (dbError) {
      healthCheck.database = "disconnected";
      healthCheck.status = "DEGRADED";
      console.warn("Database health check failed:", dbError);
    }

    // Return appropriate status code
    const statusCode = healthCheck.status === "OK" ? 200 : 503;

    return NextResponse.json(healthCheck, { status: statusCode });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}
