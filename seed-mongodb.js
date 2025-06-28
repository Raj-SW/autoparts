const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

// Database connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/amo-autoparts";

// Helper function to generate random dates
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper function to generate order numbers
function generateOrderNumber() {
  return (
    "AMO-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substr(2, 4).toUpperCase()
  );
}

// Helper function to generate quote numbers
function generateQuoteNumber() {
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 999999) + 1;
  return `QT${year}${number.toString().padStart(6, "0")}`;
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("parts").deleteMany({}),
      db.collection("orders").deleteMany({}),
      db.collection("quotes").deleteMany({}),
    ]);

    // Create indexes
    console.log("Creating indexes...");
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("parts").createIndex({ partNumber: 1 }, { unique: true }),
      db.collection("parts").createIndex({ sku: 1 }, { unique: true }),
      db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true }),
      db.collection("quotes").createIndex({ quoteNumber: 1 }, { unique: true }),
      db.collection("parts").createIndex({ "compatibility.make": 1 }),
      db.collection("parts").createIndex({ category: 1 }),
      db.collection("parts").createIndex({ brand: 1 }),
      db.collection("orders").createIndex({ userId: 1 }),
      db.collection("quotes").createIndex({ userId: 1 }),
    ]);

    // Seed Users
    console.log("Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        _id: new ObjectId(),
        email: "admin@autoparts.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        phoneNumber: "+230 5712-3456",
        address: {
          street: "123 Port Louis Street",
          city: "Port Louis",
          state: "Port Louis",
          zipCode: "11101",
          country: "Mauritius",
        },
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
      {
        _id: new ObjectId(),
        email: "user@example.com",
        password: hashedPassword,
        name: "John Doe",
        role: "user",
        phoneNumber: "+230 5234-5678",
        address: {
          street: "456 Quatre Bornes Ave",
          city: "Quatre Bornes",
          state: "Plaines Wilhems",
          zipCode: "72201",
          country: "Mauritius",
        },
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date("2023-06-15"),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
      {
        _id: new ObjectId(),
        email: "raj.patel@gmail.com",
        password: hashedPassword,
        name: "Raj Patel",
        role: "user",
        phoneNumber: "+230 5345-6789",
        address: {
          street: "789 Curepipe Road",
          city: "Curepipe",
          state: "Plaines Wilhems",
          zipCode: "74001",
          country: "Mauritius",
        },
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date("2023-08-20"),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
      {
        _id: new ObjectId(),
        email: "sarah.lim@outlook.com",
        password: hashedPassword,
        name: "Sarah Lim",
        role: "user",
        phoneNumber: "+230 5456-7890",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date("2023-09-10"),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        email: "ahmed.hassan@yahoo.com",
        password: hashedPassword,
        name: "Ahmed Hassan",
        role: "user",
        phoneNumber: "+230 5567-8901",
        address: {
          street: "321 Rose Hill Street",
          city: "Rose Hill",
          state: "Plaines Wilhems",
          zipCode: "71201",
          country: "Mauritius",
        },
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date("2023-07-05"),
        updatedAt: new Date(),
        lastLogin: randomDate(new Date(2024, 0, 1), new Date()),
      },
    ];

    const insertedUsers = await db.collection("users").insertMany(users);
    console.log(`Inserted ${insertedUsers.insertedCount} users`);

    // Get user IDs for foreign key references
    const adminUser = users[0];
    const regularUsers = users.slice(1);

    // Seed Parts
    console.log("Seeding parts...");
    const parts = [
      // BMW Parts
      {
        _id: new ObjectId(),
        partNumber: "BMW-BRK-001",
        name: "BMW 3 Series Brake Pads - Front Set",
        description:
          "High-quality ceramic brake pads for BMW 3 Series (E90/E91/E92/E93). Provides excellent stopping power and reduced brake dust.",
        category: "Brake",
        subcategory: "Brake Pads",
        brand: "BMW",
        manufacturer: "Brembo",
        compatibility: {
          make: ["BMW"],
          model: ["3 Series", "320i", "325i", "330i"],
          year: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
          engine: ["2.0L", "2.5L", "3.0L"],
        },
        price: 89.99,
        salePrice: 79.99,
        costPrice: 45.0,
        currency: "USD",
        stock: 25,
        lowStockThreshold: 5,
        sku: "BMW-BRK-001-FRONT",
        location: "A-1-15",
        images: ["/images/bmw-brake-pads-front.jpg"],
        thumbnailImage: "/images/bmw-brake-pads-front-thumb.jpg",
        specifications: {
          weight: 2.5,
          dimensions: { length: 15.2, width: 8.5, height: 2.0 },
          material: "Ceramic",
          color: "Black",
          warranty: "2 years or 40,000 km",
          condition: "new",
        },
        tags: ["BMW", "brake", "ceramic", "front", "3-series"],
        searchKeywords: [
          "bmw brake pads",
          "3 series brake",
          "ceramic brake pads",
          "front brake",
        ],
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        reviewCount: 24,
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },
      {
        _id: new ObjectId(),
        partNumber: "BMW-OIL-002",
        name: "BMW Engine Oil Filter",
        description:
          "Genuine BMW engine oil filter for optimal engine protection. Compatible with most BMW models.",
        category: "Engine",
        subcategory: "Filters",
        brand: "BMW",
        manufacturer: "Mann Filter",
        compatibility: {
          make: ["BMW"],
          model: ["3 Series", "5 Series", "X3", "X5"],
          year: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
          engine: ["2.0L", "3.0L", "4.0L"],
        },
        price: 24.99,
        costPrice: 12.5,
        currency: "USD",
        stock: 50,
        lowStockThreshold: 10,
        sku: "BMW-OIL-002-FILTER",
        location: "B-2-08",
        images: ["/images/bmw-oil-filter.jpg"],
        specifications: {
          weight: 0.3,
          dimensions: { length: 8.0, width: 8.0, height: 6.5 },
          material: "Paper/Metal",
          warranty: "1 year",
          condition: "new",
        },
        tags: ["BMW", "oil filter", "engine", "maintenance"],
        searchKeywords: ["bmw oil filter", "engine filter", "oil change"],
        isActive: true,
        isFeatured: false,
        averageRating: 4.6,
        reviewCount: 18,
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Mercedes Parts
      {
        _id: new ObjectId(),
        partNumber: "MB-SUS-003",
        name: "Mercedes C-Class Shock Absorber",
        description:
          "Premium shock absorber for Mercedes C-Class. Provides superior ride comfort and handling.",
        category: "Suspension",
        subcategory: "Shock Absorbers",
        brand: "Mercedes-Benz",
        manufacturer: "Bilstein",
        compatibility: {
          make: ["Mercedes-Benz"],
          model: ["C-Class", "C200", "C250", "C300"],
          year: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
          engine: ["2.0L", "2.5L", "3.0L"],
        },
        price: 159.99,
        costPrice: 95.0,
        currency: "USD",
        stock: 12,
        lowStockThreshold: 3,
        sku: "MB-SUS-003-SHOCK",
        location: "C-1-22",
        images: ["/images/mercedes-shock-absorber.jpg"],
        specifications: {
          weight: 3.2,
          dimensions: { length: 45.0, width: 12.0, height: 12.0 },
          material: "Steel/Aluminum",
          warranty: "3 years or 60,000 km",
          condition: "new",
        },
        tags: ["Mercedes", "shock absorber", "suspension", "c-class"],
        searchKeywords: [
          "mercedes shock",
          "c class suspension",
          "shock absorber",
        ],
        isActive: true,
        isFeatured: true,
        averageRating: 4.9,
        reviewCount: 15,
        createdAt: new Date("2023-01-20"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Audi Parts
      {
        _id: new ObjectId(),
        partNumber: "AUDI-ELC-004",
        name: "Audi A4 Headlight Assembly",
        description:
          "Complete headlight assembly for Audi A4. Includes xenon bulbs and auto-leveling system.",
        category: "Electrical",
        subcategory: "Lighting",
        brand: "Audi",
        manufacturer: "Hella",
        compatibility: {
          make: ["Audi"],
          model: ["A4", "A4 Avant"],
          year: [2012, 2013, 2014, 2015, 2016],
          engine: ["2.0L", "3.0L"],
        },
        price: 450.0,
        salePrice: 399.99,
        costPrice: 250.0,
        currency: "USD",
        stock: 6,
        lowStockThreshold: 2,
        sku: "AUDI-ELC-004-HEAD",
        location: "D-3-05",
        images: ["/images/audi-headlight.jpg"],
        specifications: {
          weight: 4.5,
          dimensions: { length: 35.0, width: 25.0, height: 20.0 },
          material: "Polycarbonate/ABS",
          warranty: "2 years",
          condition: "new",
        },
        tags: ["Audi", "headlight", "xenon", "A4"],
        searchKeywords: ["audi headlight", "a4 headlight", "xenon headlight"],
        isActive: true,
        isFeatured: false,
        averageRating: 4.7,
        reviewCount: 8,
        createdAt: new Date("2023-03-10"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Toyota Hilux Parts
      {
        _id: new ObjectId(),
        partNumber: "TOY-SUS-005",
        name: "Toyota Hilux Shock Absorber Set",
        description:
          "Heavy-duty shock absorber set for Toyota Hilux. Perfect for off-road and heavy load conditions.",
        category: "Suspension",
        subcategory: "Shock Absorbers",
        brand: "Toyota",
        manufacturer: "KYB",
        compatibility: {
          make: ["Toyota"],
          model: ["Hilux", "Hilux D4D"],
          year: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
          engine: ["2.4L", "2.8L"],
        },
        price: 320.0,
        costPrice: 180.0,
        currency: "USD",
        stock: 8,
        lowStockThreshold: 2,
        sku: "TOY-SUS-005-SET",
        location: "E-1-12",
        images: ["/images/hilux-shock-set.jpg"],
        specifications: {
          weight: 8.5,
          dimensions: { length: 50.0, width: 15.0, height: 15.0 },
          material: "Steel",
          warranty: "2 years or 50,000 km",
          condition: "new",
        },
        tags: ["Toyota", "Hilux", "shock absorber", "4x4", "off-road"],
        searchKeywords: ["hilux shock", "toyota shock", "4x4 suspension"],
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        reviewCount: 32,
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Ford Ranger Parts
      {
        _id: new ObjectId(),
        partNumber: "FOR-BRK-006",
        name: "Ford Ranger Brake Disc Set",
        description:
          "Ventilated brake disc set for Ford Ranger. Enhanced cooling for better braking performance.",
        category: "Brake",
        subcategory: "Brake Discs",
        brand: "Ford",
        manufacturer: "TRW",
        compatibility: {
          make: ["Ford"],
          model: ["Ranger", "Ranger XLT", "Ranger Wildtrak"],
          year: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
          engine: ["2.2L", "3.2L"],
        },
        price: 180.0,
        costPrice: 95.0,
        currency: "USD",
        stock: 15,
        lowStockThreshold: 5,
        sku: "FOR-BRK-006-DISC",
        location: "F-2-18",
        images: ["/images/ranger-brake-disc.jpg"],
        specifications: {
          weight: 12.0,
          dimensions: { length: 32.0, width: 32.0, height: 5.0 },
          material: "Cast Iron",
          warranty: "1 year or 30,000 km",
          condition: "new",
        },
        tags: ["Ford", "Ranger", "brake disc", "4x4"],
        searchKeywords: ["ranger brake disc", "ford brake", "brake rotor"],
        isActive: true,
        isFeatured: false,
        averageRating: 4.5,
        reviewCount: 12,
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Nissan Navara Parts
      {
        _id: new ObjectId(),
        partNumber: "NIS-ENG-007",
        name: "Nissan Navara Air Filter",
        description:
          "High-flow air filter for Nissan Navara. Improves engine performance and fuel efficiency.",
        category: "Engine",
        subcategory: "Filters",
        brand: "Nissan",
        manufacturer: "K&N",
        compatibility: {
          make: ["Nissan"],
          model: ["Navara", "NP300"],
          year: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
          engine: ["2.3L", "2.5L"],
        },
        price: 45.0,
        costPrice: 22.5,
        currency: "USD",
        stock: 20,
        lowStockThreshold: 8,
        sku: "NIS-ENG-007-AIR",
        location: "G-1-05",
        images: ["/images/navara-air-filter.jpg"],
        specifications: {
          weight: 0.8,
          dimensions: { length: 25.0, width: 20.0, height: 5.0 },
          material: "Cotton/Aluminum",
          warranty: "100,000 km",
          condition: "new",
        },
        tags: ["Nissan", "Navara", "air filter", "performance"],
        searchKeywords: ["navara air filter", "nissan filter", "air intake"],
        isActive: true,
        isFeatured: false,
        averageRating: 4.6,
        reviewCount: 19,
        createdAt: new Date("2023-04-01"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },

      // Low stock items
      {
        _id: new ObjectId(),
        partNumber: "BMW-EXH-008",
        name: "BMW Exhaust System",
        description:
          "Complete exhaust system for BMW 5 Series. Stainless steel construction for durability.",
        category: "Exhaust",
        brand: "BMW",
        manufacturer: "Akrapovic",
        compatibility: {
          make: ["BMW"],
          model: ["5 Series", "520i", "525i"],
          year: [2010, 2011, 2012, 2013, 2014, 2015],
          engine: ["2.0L", "2.5L"],
        },
        price: 850.0,
        costPrice: 450.0,
        currency: "USD",
        stock: 2, // Low stock
        lowStockThreshold: 3,
        sku: "BMW-EXH-008-FULL",
        location: "H-1-01",
        images: ["/images/bmw-exhaust.jpg"],
        specifications: {
          weight: 25.0,
          material: "Stainless Steel",
          warranty: "3 years",
          condition: "new",
        },
        tags: ["BMW", "exhaust", "5-series", "performance"],
        searchKeywords: [
          "bmw exhaust",
          "5 series exhaust",
          "performance exhaust",
        ],
        isActive: true,
        isFeatured: false,
        averageRating: 4.9,
        reviewCount: 5,
        createdAt: new Date("2023-01-10"),
        updatedAt: new Date(),
        createdBy: adminUser._id,
      },
    ];

    const insertedParts = await db.collection("parts").insertMany(parts);
    console.log(`Inserted ${insertedParts.insertedCount} parts`);

    // Seed Orders
    console.log("Seeding orders...");
    const orders = [];

    // Create some realistic orders
    for (let i = 0; i < 12; i++) {
      const user =
        regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const orderParts = parts.slice(
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3) + 3
      );

      const items = orderParts.map((part) => ({
        partId: part._id,
        partNumber: part.partNumber,
        name: part.name,
        price: part.salePrice || part.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        subtotal:
          (part.salePrice || part.price) * (Math.floor(Math.random() * 3) + 1),
        image: part.thumbnailImage,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const shipping = subtotal > 100 ? 0 : 15.0;
      const tax = subtotal * 0.15;
      const total = subtotal + shipping + tax;

      const statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const createdDate = randomDate(new Date(2023, 6, 1), new Date());

      orders.push({
        _id: new ObjectId(),
        orderNumber: generateOrderNumber(),
        userId: user._id,
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phoneNumber,
          address: user.address || {
            street: "123 Default Street",
            city: "Port Louis",
            state: "Port Louis",
            zipCode: "11101",
            country: "Mauritius",
          },
        },
        items: items,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        currency: "USD",
        paymentMethod: Math.random() > 0.5 ? "stripe" : "cash",
        paymentStatus: status === "delivered" ? "paid" : "pending",
        shippingMethod: shipping === 0 ? "standard" : "express",
        status: status,
        estimatedDelivery: new Date(
          createdDate.getTime() + 5 * 24 * 60 * 60 * 1000
        ),
        createdAt: createdDate,
        updatedAt: new Date(),
        ...(status === "shipped" && {
          shippedAt: new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        }),
        ...(status === "delivered" && {
          deliveredAt: new Date(
            createdDate.getTime() + 4 * 24 * 60 * 60 * 1000
          ),
          paidAt: new Date(createdDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        }),
      });
    }

    const insertedOrders = await db.collection("orders").insertMany(orders);
    console.log(`Inserted ${insertedOrders.insertedCount} orders`);

    // Seed Quotes
    console.log("Seeding quotes...");
    const quotes = [
      {
        _id: new ObjectId(),
        quoteNumber: generateQuoteNumber(),
        userId: regularUsers[0]._id,
        customer: {
          name: regularUsers[0].name,
          email: regularUsers[0].email,
          phone: regularUsers[0].phoneNumber,
          company: "Patel Auto Garage",
        },
        vehicle: {
          make: "BMW",
          model: "320i",
          year: 2015,
          vin: "WBAPK5C58EA123456",
          engine: "2.0L Turbo",
        },
        items: [
          {
            name: "Brake Pads Front",
            description: "Ceramic brake pads for front wheels",
            quantity: 1,
            notes: "Need urgently for customer",
          },
          {
            name: "Brake Discs Front",
            description: "Ventilated brake discs",
            quantity: 1,
          },
        ],
        message:
          "Customer waiting, need urgent quote for BMW brake system replacement",
        urgency: "urgent",
        quotedPrice: 280.0,
        quotedBy: adminUser._id,
        quotedAt: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quotationNotes:
          "Price includes installation. 2 year warranty on parts.",
        status: "quoted",
        preferredContact: "whatsapp",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(),
        respondedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        quoteNumber: generateQuoteNumber(),
        userId: regularUsers[1]._id,
        customer: {
          name: regularUsers[1].name,
          email: regularUsers[1].email,
          phone: regularUsers[1].phoneNumber,
        },
        vehicle: {
          make: "Toyota",
          model: "Hilux",
          year: 2018,
          engine: "2.4L Diesel",
        },
        items: [
          {
            name: "Shock Absorbers",
            description: "Heavy duty shock absorbers for off-road use",
            quantity: 4,
            notes: "For heavy load carrying",
          },
        ],
        message: "Need heavy duty shocks for commercial use",
        urgency: "medium",
        status: "pending",
        preferredContact: "email",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        quoteNumber: generateQuoteNumber(),
        customer: {
          name: "Marie Dubois",
          email: "marie.dubois@gmail.com",
          phone: "+230 5789-0123",
          company: "Personal",
        },
        vehicle: {
          make: "Mercedes-Benz",
          model: "C220",
          year: 2016,
          engine: "2.2L Diesel",
        },
        items: [
          {
            name: "Service Kit",
            description:
              "Full service kit including oil filter, air filter, fuel filter",
            quantity: 1,
            notes: "30,000km service",
          },
        ],
        message: "Need full service kit for 30,000km service",
        urgency: "low",
        status: "pending",
        preferredContact: "phone",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        quoteNumber: generateQuoteNumber(),
        userId: regularUsers[2]._id,
        customer: {
          name: regularUsers[2].name,
          email: regularUsers[2].email,
          phone: regularUsers[2].phoneNumber,
          company: "Hassan Motors",
        },
        vehicle: {
          make: "Ford",
          model: "Ranger",
          year: 2017,
          engine: "3.2L",
        },
        items: [
          {
            name: "Timing Belt Kit",
            description: "Complete timing belt kit with water pump",
            quantity: 1,
            notes: "Customer heard noise from engine",
          },
        ],
        message: "Engine making noise, suspect timing belt issue",
        urgency: "high",
        quotedPrice: 450.0,
        quotedBy: adminUser._id,
        quotedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        quotationNotes: "Urgent replacement needed. Price includes labour.",
        status: "accepted",
        preferredContact: "whatsapp",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(),
        respondedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];

    const insertedQuotes = await db.collection("quotes").insertMany(quotes);
    console.log(`Inserted ${insertedQuotes.insertedCount} quotes`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("===========================================");
    console.log(`✅ Users: ${insertedUsers.insertedCount}`);
    console.log(`✅ Parts: ${insertedParts.insertedCount}`);
    console.log(`✅ Orders: ${insertedOrders.insertedCount}`);
    console.log(`✅ Quotes: ${insertedQuotes.insertedCount}`);
    console.log("\n📧 Login Credentials:");
    console.log("Admin: admin@autoparts.com / password123");
    console.log("User: user@example.com / password123");
    console.log("\n🚀 Start your Next.js app: pnpm dev");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
