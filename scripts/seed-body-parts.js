// Script to seed car body parts into MongoDB
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autoparts';

const carBodyPartsData = [
  // Toyota Vitz/Yaris (2008-2019)
  {
    vehicleMake: 'Toyota',
    vehicleModel: 'Vitz/Yaris',
    years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    parts: [
      {
        type: 'Headlamp',
        positions: [
          { position: 'Left', quantity: 5 },
          { position: 'Right', quantity: 5 },
        ],
        priceRange: { min: 3500, max: 5500 },
      },
      {
        type: 'Taillamp',
        positions: [
          { position: 'Left', quantity: 4 },
          { position: 'Right', quantity: 4 },
        ],
        priceRange: { min: 2500, max: 4000 },
      },
      {
        type: 'Side Mirror',
        positions: [
          { position: 'Left', quantity: 4 },
          { position: 'Right', quantity: 4 },
        ],
        priceRange: { min: 1500, max: 2500 },
      },
      {
        type: 'Bumper',
        positions: [
          { position: 'Front', quantity: 2 },
          { position: 'Rear', quantity: 1 },
        ],
        priceRange: { min: 4000, max: 7000 },
      },
      {
        type: 'Fender',
        positions: [
          { position: 'Left', quantity: 1 },
          { position: 'Right', quantity: 2 },
        ],
        priceRange: { min: 3000, max: 5000 },
      },
      {
        type: 'Door',
        positions: [{ position: 'Left', quantity: 1, note: 'Skinned, A/B grade only' }],
        priceRange: { min: 5000, max: 8000 },
      },
      {
        type: 'Grille',
        positions: [{ position: 'Front', quantity: 3 }],
        priceRange: { min: 1500, max: 3000 },
      },
    ],
  },
  // Suzuki Swift (2011-2020)
  {
    vehicleMake: 'Suzuki',
    vehicleModel: 'Swift',
    years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    parts: [
      {
        type: 'Headlamp',
        positions: [
          { position: 'Left', quantity: 5 },
          { position: 'Right', quantity: 5 },
        ],
        priceRange: { min: 3000, max: 5000 },
      },
      {
        type: 'Taillamp',
        positions: [
          { position: 'Left', quantity: 4 },
          { position: 'Right', quantity: 4 },
        ],
        priceRange: { min: 2000, max: 3500 },
      },
      {
        type: 'Side Mirror',
        positions: [
          { position: 'Left', quantity: 4 },
          { position: 'Right', quantity: 4 },
        ],
        priceRange: { min: 1200, max: 2200 },
      },
      {
        type: 'Bumper',
        positions: [
          { position: 'Front', quantity: 2 },
          { position: 'Rear', quantity: 1 },
        ],
        priceRange: { min: 3500, max: 6000 },
      },
      {
        type: 'Fender',
        positions: [
          { position: 'Left', quantity: 1 },
          { position: 'Right', quantity: 2 },
        ],
        priceRange: { min: 2500, max: 4500 },
      },
      {
        type: 'Grille',
        positions: [{ position: 'Front', quantity: 3 }],
        priceRange: { min: 1200, max: 2500 },
      },
    ],
  },
  // Toyota Aqua (2012-2019)
  {
    vehicleMake: 'Toyota',
    vehicleModel: 'Aqua',
    years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    parts: [
      {
        type: 'Headlamp',
        positions: [
          { position: 'Left', quantity: 4 },
          { position: 'Right', quantity: 4 },
        ],
        priceRange: { min: 4000, max: 6500 },
      },
      {
        type: 'Taillamp',
        positions: [
          { position: 'Left', quantity: 3 },
          { position: 'Right', quantity: 3 },
        ],
        priceRange: { min: 3000, max: 4500 },
      },
      {
        type: 'Side Mirror',
        positions: [
          { position: 'Left', quantity: 3 },
          { position: 'Right', quantity: 3 },
        ],
        priceRange: { min: 1800, max: 2800 },
      },
      {
        type: 'Bumper',
        positions: [
          { position: 'Front', quantity: 2 },
          { position: 'Rear', quantity: 1 },
        ],
        priceRange: { min: 4500, max: 7500 },
      },
      {
        type: 'Fender',
        positions: [
          { position: 'Left', quantity: 1 },
          { position: 'Right', quantity: 1 },
        ],
        priceRange: { min: 3500, max: 5500 },
      },
      {
        type: 'Grille',
        positions: [{ position: 'Front', quantity: 2 }],
        priceRange: { min: 1800, max: 3200 },
      },
    ],
  },
  // Nissan Note E12 (2013-2020)
  {
    vehicleMake: 'Nissan',
    vehicleModel: 'Note E12',
    years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    parts: [
      {
        type: 'Headlamp',
        positions: [
          { position: 'Left', quantity: 3 },
          { position: 'Right', quantity: 3 },
        ],
        priceRange: { min: 3500, max: 5500 },
      },
      {
        type: 'Taillamp',
        positions: [
          { position: 'Left', quantity: 2 },
          { position: 'Right', quantity: 2 },
        ],
        priceRange: { min: 2500, max: 4000 },
      },
      {
        type: 'Side Mirror',
        positions: [
          { position: 'Left', quantity: 3 },
          { position: 'Right', quantity: 3 },
        ],
        priceRange: { min: 1500, max: 2500 },
      },
      {
        type: 'Bumper',
        positions: [
          { position: 'Front', quantity: 1 },
          { position: 'Rear', quantity: 1 },
        ],
        priceRange: { min: 3800, max: 6500 },
      },
      {
        type: 'Fender',
        positions: [
          { position: 'Left', quantity: 1 },
          { position: 'Right', quantity: 1 },
        ],
        priceRange: { min: 2800, max: 4800 },
      },
      {
        type: 'Grille',
        positions: [{ position: 'Front', quantity: 1 }],
        priceRange: { min: 1500, max: 2800 },
      },
    ],
  },
  // Honda Fit GK (2014-2020)
  {
    vehicleMake: 'Honda',
    vehicleModel: 'Fit GK',
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020],
    parts: [
      {
        type: 'Headlamp',
        positions: [
          { position: 'Left', quantity: 3 },
          { position: 'Right', quantity: 3 },
        ],
        priceRange: { min: 3800, max: 6000 },
      },
      {
        type: 'Taillamp',
        positions: [
          { position: 'Left', quantity: 2 },
          { position: 'Right', quantity: 2 },
        ],
        priceRange: { min: 2800, max: 4200 },
      },
      {
        type: 'Side Mirror',
        positions: [
          { position: 'Left', quantity: 2 },
          { position: 'Right', quantity: 2 },
        ],
        priceRange: { min: 1600, max: 2600 },
      },
      {
        type: 'Bumper',
        positions: [{ position: 'Front', quantity: 1 }],
        priceRange: { min: 4000, max: 7000 },
      },
      {
        type: 'Fender',
        positions: [{ position: 'Left', quantity: 1 }],
        priceRange: { min: 3000, max: 5200 },
      },
      {
        type: 'Grille',
        positions: [{ position: 'Front', quantity: 1 }],
        priceRange: { min: 1600, max: 2900 },
      },
    ],
  },
];

async function generateBodyPartRecords() {
  const parts = [];
  const adminId = new ObjectId(); // Admin user ID

  for (const vehicle of carBodyPartsData) {
    for (const partType of vehicle.parts) {
      for (const position of partType.positions) {
        // Generate part number
        const make = vehicle.vehicleMake.toUpperCase().substring(0, 3);
        const model = vehicle.vehicleModel.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
        const type = partType.type.replace(/\s/g, '').toUpperCase().substring(0, 4);
        const pos = position.position.substring(0, 1).toUpperCase();
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const partNumber = `${make}-${model}-${type}-${pos}-${random}`;

        // Generate SKU
        const sku = `BP-${partNumber}`;

        // Calculate price (random within range, in MUR)
        const price = Math.floor(
          Math.random() * (partType.priceRange.max - partType.priceRange.min) +
            partType.priceRange.min
        );
        const costPrice = Math.floor(price * 0.65); // 35% markup

        // Determine grade based on position note
        const grade = position.note?.includes('A/B grade') ? (Math.random() > 0.5 ? 'A' : 'B') : 'A';

        const part = {
          partNumber,
          name: `${vehicle.vehicleMake} ${vehicle.vehicleModel} ${partType.type} (${position.position})`,
          description: `${grade} Grade ${partType.type} for ${vehicle.vehicleMake} ${vehicle.vehicleModel} (${vehicle.years[0]}-${vehicle.years[vehicle.years.length - 1]}). ${position.note || 'OEM quality replacement part.'}`,
          category: 'Body Parts',
          subcategory: partType.type,
          brand: vehicle.vehicleMake,
          manufacturer: vehicle.vehicleMake === 'Toyota' ? 'Toyota Motor Corporation' : 
                       vehicle.vehicleMake === 'Suzuki' ? 'Suzuki Motor Corporation' :
                       vehicle.vehicleMake === 'Nissan' ? 'Nissan Motor Company' :
                       'Honda Motor Company',
          compatibility: {
            make: [vehicle.vehicleMake],
            model: [vehicle.vehicleModel],
            year: vehicle.years,
          },
          price,
          costPrice,
          currency: 'MUR',
          stock: position.quantity,
          lowStockThreshold: 2,
          sku,
          location: 'Warehouse A',
          images: [
            {
              url: `/placeholder.jpg`,
              publicId: `body-parts/${partNumber}`,
              width: 800,
              height: 600,
            },
          ],
          specifications: {
            condition: 'OEM',
            position: position.position,
            partType: partType.type,
            grade,
            isSkinned: partType.type === 'Door',
            warranty: '3 months',
            oem: true,
          },
          tags: [
            vehicle.vehicleMake.toLowerCase(),
            vehicle.vehicleModel.toLowerCase().replace(/\s/g, '-'),
            partType.type.toLowerCase().replace(/\s/g, '-'),
            position.position.toLowerCase(),
            'body-part',
            'genuine',
            grade.toLowerCase() + '-grade',
          ],
          searchKeywords: [
            vehicle.vehicleMake,
            vehicle.vehicleModel,
            partType.type,
            position.position,
            'body part',
            'exterior',
            grade + ' grade',
            ...vehicle.years.map(y => y.toString()),
          ],
          isActive: true,
          isFeatured: position.quantity <= 2, // Feature low stock items
          averageRating: 0,
          reviewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: adminId,
          lastModifiedBy: adminId,
        };

        parts.push(part);
      }
    }
  }

  return parts;
}

async function seedBodyParts() {
  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    console.log('Generating body parts data...');
    const bodyParts = await generateBodyPartRecords();

    console.log(`Generated ${bodyParts.length} body part records`);

    // Insert body parts
    console.log('Inserting body parts into database...');
    const result = await db.collection('parts').insertMany(bodyParts);

    console.log(`✅ Successfully inserted ${result.insertedCount} body parts`);
    console.log('\nBody Parts Summary:');
    console.log('- Toyota Vitz/Yaris: Various parts (2008-2019)');
    console.log('- Suzuki Swift: Various parts (2011-2020)');
    console.log('- Toyota Aqua: Various parts (2012-2019)');
    console.log('- Nissan Note E12: Various parts (2013-2020)');
    console.log('- Honda Fit GK: Various parts (2014-2020)');
    console.log('\nPart Types: Headlamp, Taillamp, Side Mirror, Bumper, Fender, Door, Grille');
  } catch (error) {
    console.error('Error seeding body parts:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the seed script
if (require.main === module) {
  seedBodyParts();
}

module.exports = { seedBodyParts, generateBodyPartRecords };

