#!/usr/bin/env node

/**
 * Environment Variable Generator for EasyPanel Deployment
 *
 * This script helps generate secure environment variables for production deployment.
 * Run with: node scripts/generate-env.js
 */

const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateSecretKey(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

function generateJWTSecret() {
  return crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 32);
}

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function generateEnvironmentVariables() {
  console.log("🚀 EasyPanel Environment Variable Generator");
  console.log("===========================================\n");

  // Required inputs
  const domain = await prompt(
    "Enter your domain (e.g., autoparts.example.com): "
  );
  const mongoPassword = await prompt(
    "Enter MongoDB password (from EasyPanel): "
  );
  const emailUser = await prompt("Enter your email address for SMTP: ");
  const emailPass = await prompt("Enter your email app password: ");
  const adminEmail = await prompt("Enter admin email address: ");

  // Optional inputs
  console.log("\n--- Optional Services (press Enter to skip) ---");
  const stripeSecretKey = await prompt("Stripe Secret Key (sk_live_...): ");
  const stripeWebhookSecret = await prompt(
    "Stripe Webhook Secret (whsec_...): "
  );
  const stripePublishableKey = await prompt(
    "Stripe Publishable Key (pk_live_...): "
  );

  const cloudinaryName = await prompt("Cloudinary Cloud Name: ");
  const cloudinaryApiKey = await prompt("Cloudinary API Key: ");
  const cloudinaryApiSecret = await prompt("Cloudinary API Secret: ");

  // Generate secure secrets
  const jwtSecret = generateJWTSecret();
  const jwtRefreshSecret = generateJWTSecret();

  // Build environment variables
  const envVars = {
    // Required
    MONGODB_URI: `mongodb://autoparts_user:${mongoPassword}@autoparts-mongodb:27017/autoparts`,
    JWT_SECRET: jwtSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    NEXT_PUBLIC_API_URL: `https://${domain}`,
    NEXT_PUBLIC_APP_URL: `https://${domain}`,
    EMAIL_HOST: "smtp.gmail.com",
    EMAIL_PORT: "587",
    EMAIL_SECURE: "false",
    EMAIL_USER: emailUser,
    EMAIL_PASS: emailPass,
    ADMIN_EMAIL: adminEmail,
    NODE_ENV: "production",
  };

  // Add optional services if provided
  if (stripeSecretKey) {
    envVars.STRIPE_SECRET_KEY = stripeSecretKey;
    envVars.STRIPE_WEBHOOK_SECRET = stripeWebhookSecret || "";
    envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = stripePublishableKey || "";
  }

  if (cloudinaryName) {
    envVars.CLOUDINARY_CLOUD_NAME = cloudinaryName;
    envVars.CLOUDINARY_API_KEY = cloudinaryApiKey || "";
    envVars.CLOUDINARY_API_SECRET = cloudinaryApiSecret || "";
  }

  // Display results
  console.log("\n🔐 Generated Environment Variables");
  console.log("====================================\n");

  console.log("Copy these to your EasyPanel environment variables:\n");

  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      console.log(`${key}=${value}`);
    }
  }

  console.log("\n📝 Additional Setup Commands");
  console.log("=============================\n");

  console.log("1. Create admin user after deployment:");
  console.log(`curl -X POST https://${domain}/api/auth/register \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log(
    "  -d '{\n" +
      '    "name": "Admin User",\n' +
      `    "email": "${adminEmail}",\n` +
      '    "password": "AdminPassword123!",\n' +
      '    "role": "admin"\n' +
      "  }'"
  );

  console.log("\n2. Test login:");
  console.log(`curl -X POST https://${domain}/api/auth/login \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log(
    "  -d '{\n" +
      `    "email": "${adminEmail}",\n` +
      '    "password": "AdminPassword123!"\n' +
      "  }'"
  );

  if (stripeSecretKey) {
    console.log("\n3. Configure Stripe webhook endpoint:");
    console.log(`   ${domain}/api/payment/webhook`);
  }

  console.log("\n✅ Environment setup complete!");
  console.log("\nNext steps:");
  console.log("1. Copy the environment variables to EasyPanel");
  console.log("2. Deploy your application");
  console.log("3. Run the admin user creation command");
  console.log("4. Test your application");

  rl.close();
}

// Handle errors
process.on("SIGINT", () => {
  console.log("\n\n👋 Environment generation cancelled.");
  rl.close();
  process.exit(0);
});

// Run the generator
generateEnvironmentVariables().catch((error) => {
  console.error("Error generating environment variables:", error);
  rl.close();
  process.exit(1);
});
