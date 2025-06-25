const fs = require("fs");
const path = require("path");

console.log("🚀 Auto Parts E-commerce Setup");
console.log("==============================\n");

// Check if .env.local exists
const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env.local file...");

  const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/autoparts

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# WhatsApp Business API (Optional)
WHATSAPP_API_URL=https://api.whatsapp.com/
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# AI Features (Optional)
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_VISION_API_KEY=your-google-vision-api-key

# Admin Default Credentials (Change in Production)
ADMIN_EMAIL=admin@autoparts.com
ADMIN_PASSWORD=changeThisPassword123!
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env.local file created successfully!");
  console.log(
    "⚠️  Please update the environment variables with your actual values.\n"
  );
} else {
  console.log("✅ .env.local file already exists.\n");
}

console.log("📋 Setup Instructions:");
console.log("=====================");
console.log("1. Install MongoDB locally or use MongoDB Atlas");
console.log("2. Update .env.local with your actual configuration values");
console.log('3. Run "pnpm dev" to start the development server');
console.log("4. Open http://localhost:3000 in your browser\n");

console.log("🔧 Required Setup:");
console.log("==================");
console.log("• MongoDB: Install MongoDB Community Server or use MongoDB Atlas");
console.log("• Stripe: Create a Stripe account and get API keys");
console.log("• Email: Configure SMTP settings for email notifications");
console.log("• JWT Secrets: Generate secure random strings for JWT secrets\n");

console.log("🚀 Quick Start Commands:");
console.log("=======================");
console.log("pnpm dev          - Start development server");
console.log("pnpm build        - Build for production");
console.log("pnpm start        - Start production server");
console.log("pnpm lint         - Run ESLint\n");

console.log("📚 API Endpoints:");
console.log("=================");
console.log("POST /api/auth/register    - User registration");
console.log("POST /api/auth/login       - User login");
console.log("GET  /api/auth/profile     - Get user profile");
console.log("PUT  /api/auth/profile     - Update user profile");
console.log("POST /api/auth/refresh     - Refresh JWT token");
console.log("GET  /api/admin/dashboard  - Admin dashboard stats");
console.log("GET  /api/parts            - Get parts catalog");
console.log("POST /api/parts            - Create new part (admin)");
console.log("GET  /api/parts/[id]       - Get specific part");
console.log("PUT  /api/parts/[id]       - Update part (admin)");
console.log("DELETE /api/parts/[id]     - Delete part (admin)");
console.log("GET  /api/quotes           - Get quotes");
console.log("POST /api/quotes           - Submit quote request\n");

console.log("🎯 Next Steps:");
console.log("==============");
console.log("1. Configure your environment variables");
console.log("2. Set up MongoDB database");
console.log("3. Test the API endpoints");
console.log("4. Build the frontend components");
console.log("5. Deploy to production\n");
