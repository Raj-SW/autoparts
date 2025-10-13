// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the autoparts database
db = db.getSiblingDB('autoparts');

// Create a user for the application
db.createUser({
  user: 'autoparts_user',
  pwd: 'autoparts_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'autoparts'
    }
  ]
});

// Create initial collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        name: {
          bsonType: "string",
          minLength: 1
        },
        role: {
          enum: ["admin", "customer"]
        }
      }
    }
  }
});

db.createCollection('parts');
db.createCollection('orders');
db.createCollection('quotes');
db.createCollection('partners');

print('Database initialization completed successfully');