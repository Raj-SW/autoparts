#!/usr/bin/env node

/**
 * Health check script for Docker container
 * This script checks if the Next.js application is responding properly
 */

const http = require("http");

const options = {
  hostname: "localhost",
  port: process.env.PORT || 3000,
  path: "/api/health",
  method: "GET",
  timeout: 3000,
};

// Create a simple health endpoint check
const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log("Health check passed");
    process.exit(0);
  } else {
    console.log(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on("error", (err) => {
  console.log(`Health check failed with error: ${err.message}`);
  process.exit(1);
});

req.on("timeout", () => {
  console.log("Health check timed out");
  req.destroy();
  process.exit(1);
});

req.end();
