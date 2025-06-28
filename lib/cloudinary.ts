import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Missing Cloudinary environment variables:");
  console.error("CLOUDINARY_CLOUD_NAME:", !!process.env.CLOUDINARY_CLOUD_NAME);
  console.error("CLOUDINARY_API_KEY:", !!process.env.CLOUDINARY_API_KEY);
  console.error("CLOUDINARY_API_SECRET:", !!process.env.CLOUDINARY_API_SECRET);
} else {
  console.log("Cloudinary configured successfully");
}

export default cloudinary;
