import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { withAdminAuth, AuthUser } from "@/middleware/auth";

// POST /api/upload - Upload image to Cloudinary (Admin only)
export const POST = withAdminAuth(
  async (request: NextRequest, user: AuthUser) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type. Allowed types: ${allowedTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Validate file size (10MB limit, minimum 1KB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const minSize = 1024; // 1KB minimum for valid images

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 10MB" },
          { status: 400 }
        );
      }

      if (file.size < minSize) {
        return NextResponse.json(
          {
            error:
              "File size too small. This doesn't appear to be a valid image file.",
          },
          { status: 400 }
        );
      }

      console.log(
        `Uploading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
      );

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log(`Buffer created, size: ${buffer.length} bytes`);

      // Upload to Cloudinary with improved error handling
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "autoparts",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
              { format: "auto" },
            ],
            // Add some additional options for better compatibility
            invalidate: true,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result?.public_id);
              resolve(result);
            }
          }
        );

        uploadStream.end(buffer);
      });

      const uploadResult = result as any;

      return NextResponse.json({
        message: "Image uploaded successfully",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
      });
    } catch (error) {
      console.error("Image upload error:", error);

      // Return more specific error messages
      if (error && typeof error === "object" && "message" in error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/upload - Delete image from Cloudinary (Admin only)
export const DELETE = withAdminAuth(
  async (request: NextRequest, user: AuthUser) => {
    try {
      const { searchParams } = new URL(request.url);
      const publicId = searchParams.get("publicId");

      if (!publicId) {
        return NextResponse.json(
          { error: "No public ID provided" },
          { status: 400 }
        );
      }

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      return NextResponse.json({
        message: "Image deleted successfully",
        result,
      });
    } catch (error) {
      console.error("Image delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }
  }
);
