// MongoDB initialization script for Docker Compose
// This script creates the autoparts database and user

print("Creating autoparts database and user...");

// Switch to the autoparts database
db = db.getSiblingDB("autoparts");

// Create a user for the autoparts application
db.createUser({
  user: "autoparts_user",
  pwd: "autoparts_pass",
  roles: [
    {
      role: "readWrite",
      db: "autoparts",
    },
  ],
});

// Create initial collections with indexes
print("Creating collections and indexes...");

// Users collection
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phoneNumber: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: 1 });

// Parts collection
db.createCollection("parts");
db.parts.createIndex({ partNumber: 1 }, { unique: true });
db.parts.createIndex({ sku: 1 }, { unique: true });
db.parts.createIndex({ name: 1 });
db.parts.createIndex({ category: 1 });
db.parts.createIndex({ brand: 1 });
db.parts.createIndex({ "compatibility.make": 1 });
db.parts.createIndex({ "compatibility.model": 1 });
db.parts.createIndex({ "compatibility.year": 1 });
db.parts.createIndex({ isActive: 1 });
db.parts.createIndex({ createdAt: 1 });

// Orders collection
db.createCollection("orders");
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: 1 });
db.orders.createIndex({ updatedAt: 1 });

// Quotes collection
db.createCollection("quotes");
db.quotes.createIndex({ quoteNumber: 1 }, { unique: true });
db.quotes.createIndex({ "customer.email": 1 });
db.quotes.createIndex({ status: 1 });
db.quotes.createIndex({ createdAt: 1 });
db.quotes.createIndex({ expiresAt: 1 });

// Partners collection
db.createCollection("partners");
db.partners.createIndex({ email: 1 }, { unique: true });
db.partners.createIndex({ companyName: 1 });
db.partners.createIndex({ isActive: 1 });
db.partners.createIndex({ createdAt: 1 });

print("Database setup completed successfully!");
print("Created user: autoparts_user with readWrite permissions");
print("Created collections: users, parts, orders, quotes, partners");
print("Created appropriate indexes for performance optimization");
