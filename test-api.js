const http = require("http");

const BASE_URL = "http://localhost:3000";

// Test configuration
const testUser = {
  email: "test@example.com",
  password: "TestPass123!",
  name: "Test User",
  phoneNumber: "+1234567890",
};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test functions
async function testRegistration() {
  console.log("🧪 Testing User Registration...");
  try {
    const response = await makeRequest("POST", "/api/auth/register", testUser);
    console.log(`Status: ${response.status}`);
    if (response.status === 201) {
      console.log("✅ Registration successful");
      return response.data.tokens?.accessToken;
    } else {
      console.log("❌ Registration failed:", response.data);
      return null;
    }
  } catch (error) {
    console.log("❌ Registration error:", error.message);
    return null;
  }
}

async function testLogin() {
  console.log("\n🧪 Testing User Login...");
  try {
    const response = await makeRequest("POST", "/api/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });
    console.log(`Status: ${response.status}`);
    if (response.status === 200) {
      console.log("✅ Login successful");
      return response.data.tokens?.accessToken;
    } else {
      console.log("❌ Login failed:", response.data);
      return null;
    }
  } catch (error) {
    console.log("❌ Login error:", error.message);
    return null;
  }
}

async function testProfile(accessToken) {
  console.log("\n🧪 Testing Get Profile...");
  try {
    const response = await makeRequest("GET", "/api/auth/profile", null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(`Status: ${response.status}`);
    if (response.status === 200) {
      console.log("✅ Profile retrieved successfully");
      return true;
    } else {
      console.log("❌ Profile retrieval failed:", response.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Profile error:", error.message);
    return false;
  }
}

async function testPartsCatalog() {
  console.log("\n🧪 Testing Parts Catalog...");
  try {
    const response = await makeRequest("GET", "/api/parts");
    console.log(`Status: ${response.status}`);
    if (response.status === 200) {
      console.log("✅ Parts catalog accessible");
      console.log(`Found ${response.data.parts?.length || 0} parts`);
      return true;
    } else {
      console.log("❌ Parts catalog failed:", response.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Parts catalog error:", error.message);
    return false;
  }
}

async function testQuoteSubmission() {
  console.log("\n🧪 Testing Quote Submission...");
  try {
    const quoteData = {
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
      },
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2020,
      },
      items: [
        {
          name: "Brake Pads",
          quantity: 1,
          notes: "Front brake pads needed",
        },
      ],
      urgency: "medium",
      preferredContact: "email",
    };

    const response = await makeRequest("POST", "/api/quotes", quoteData);
    console.log(`Status: ${response.status}`);
    if (response.status === 201) {
      console.log("✅ Quote submission successful");
      return true;
    } else {
      console.log("❌ Quote submission failed:", response.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Quote submission error:", error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting API Tests...\n");
  console.log("Make sure the development server is running (pnpm dev)\n");

  let accessToken = null;
  let testsPassed = 0;
  let totalTests = 5;

  // Test 1: Registration
  accessToken = await testRegistration();
  if (accessToken) testsPassed++;

  // Test 2: Login
  if (!accessToken) {
    accessToken = await testLogin();
  }
  if (accessToken) testsPassed++;

  // Test 3: Profile
  if (accessToken) {
    const profileSuccess = await testProfile(accessToken);
    if (profileSuccess) testsPassed++;
  }

  // Test 4: Parts Catalog
  const partsSuccess = await testPartsCatalog();
  if (partsSuccess) testsPassed++;

  // Test 5: Quote Submission
  const quoteSuccess = await testQuoteSubmission();
  if (quoteSuccess) testsPassed++;

  // Summary
  console.log("\n📊 Test Results:");
  console.log("================");
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((testsPassed / totalTests) * 100)}%`);

  if (testsPassed === totalTests) {
    console.log("\n🎉 All tests passed! Your API is working correctly.");
  } else {
    console.log(
      "\n⚠️  Some tests failed. Check your configuration and server status."
    );
  }

  console.log("\n💡 Tips:");
  console.log("- Make sure MongoDB is running and accessible");
  console.log("- Check that all environment variables are set correctly");
  console.log("- Verify the development server is running on port 3000");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
