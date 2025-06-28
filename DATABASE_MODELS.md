# A.M.O Distribution - Database Models Documentation

## Overview

This document provides a comprehensive overview of all database models and collections used in the A.M.O Distribution auto parts e-commerce platform.

## MongoDB Collections

The application uses **4 main collections**:

1. **`users`** - User accounts and authentication
2. **`parts`** - Auto parts catalog and inventory
3. **`orders`** - Customer orders and transactions
4. **`quotes`** - Quote requests and responses

---

## 1. Users Collection (`users`)

**Purpose**: Stores user accounts, authentication data, and user profiles.

### Schema Properties:

| Field                    | Type     | Required | Default  | Description                  |
| ------------------------ | -------- | -------- | -------- | ---------------------------- |
| `_id`                    | ObjectId | Auto     | -        | MongoDB document ID          |
| `email`                  | String   | ✅       | -        | User email (unique)          |
| `password`               | String   | ✅       | -        | Hashed password (bcrypt)     |
| `name`                   | String   | ✅       | -        | User full name               |
| `role`                   | String   | ✅       | "user"   | User role: "admin" or "user" |
| `phoneNumber`            | String   | ❌       | -        | Contact phone number         |
| `address`                | Object   | ❌       | -        | User address object          |
| `address.street`         | String   | ❌       | -        | Street address               |
| `address.city`           | String   | ❌       | -        | City                         |
| `address.state`          | String   | ❌       | -        | State/Province               |
| `address.zipCode`        | String   | ❌       | -        | Postal code                  |
| `address.country`        | String   | ❌       | -        | Country                      |
| `isEmailVerified`        | Boolean  | ✅       | false    | Email verification status    |
| `emailVerificationToken` | String   | ❌       | -        | Token for email verification |
| `passwordResetToken`     | String   | ❌       | -        | Token for password reset     |
| `passwordResetExpires`   | Date     | ❌       | -        | Password reset expiry        |
| `refreshToken`           | String   | ❌       | -        | JWT refresh token            |
| `createdAt`              | Date     | ✅       | Date.now | Account creation date        |
| `updatedAt`              | Date     | ✅       | Date.now | Last update date             |
| `lastLogin`              | Date     | ❌       | -        | Last login timestamp         |
| `isActive`               | Boolean  | ✅       | true     | Account active status        |

### Indexes:

- `email` (unique)

---

## 2. Parts Collection (`parts`)

**Purpose**: Stores auto parts catalog, inventory, and product information.

### Schema Properties:

| Field                              | Type          | Required | Default  | Description                             |
| ---------------------------------- | ------------- | -------- | -------- | --------------------------------------- |
| `_id`                              | ObjectId      | Auto     | -        | MongoDB document ID                     |
| `partNumber`                       | String        | ✅       | -        | Unique part identifier                  |
| `name`                             | String        | ✅       | -        | Part name/title                         |
| `description`                      | String        | ✅       | -        | Detailed description                    |
| `category`                         | String        | ✅       | -        | Main category (Brake, Engine, etc.)     |
| `subcategory`                      | String        | ❌       | -        | Sub-category                            |
| `brand`                            | String        | ✅       | -        | Part brand (BMW, Mercedes, etc.)        |
| `manufacturer`                     | String        | ❌       | -        | Manufacturer name                       |
| `compatibility`                    | Object        | ✅       | -        | Vehicle compatibility                   |
| `compatibility.make`               | Array[String] | ✅       | -        | Compatible vehicle makes                |
| `compatibility.model`              | Array[String] | ✅       | -        | Compatible vehicle models               |
| `compatibility.year`               | Array[Number] | ✅       | -        | Compatible years                        |
| `compatibility.engine`             | Array[String] | ❌       | -        | Compatible engines                      |
| `price`                            | Number        | ✅       | -        | Regular price                           |
| `salePrice`                        | Number        | ❌       | -        | Sale/discounted price                   |
| `costPrice`                        | Number        | ✅       | -        | Cost price (for profit calc)            |
| `currency`                         | String        | ✅       | "USD"    | Currency code                           |
| `stock`                            | Number        | ✅       | 0        | Current stock quantity                  |
| `lowStockThreshold`                | Number        | ✅       | 10       | Low stock alert threshold               |
| `sku`                              | String        | ✅       | -        | Stock Keeping Unit (unique)             |
| `location`                         | String        | ❌       | -        | Warehouse location                      |
| `images`                           | Array[String] | ✅       | []       | Product image URLs                      |
| `thumbnailImage`                   | String        | ❌       | -        | Thumbnail image URL                     |
| `technicalDiagram`                 | String        | ❌       | -        | Technical diagram URL                   |
| `specifications`                   | Object        | ✅       | -        | Technical specifications                |
| `specifications.weight`            | Number        | ❌       | -        | Weight in kg                            |
| `specifications.dimensions`        | Object        | ❌       | -        | Dimensions object                       |
| `specifications.dimensions.length` | Number        | ❌       | -        | Length in cm                            |
| `specifications.dimensions.width`  | Number        | ❌       | -        | Width in cm                             |
| `specifications.dimensions.height` | Number        | ❌       | -        | Height in cm                            |
| `specifications.material`          | String        | ❌       | -        | Material type                           |
| `specifications.color`             | String        | ❌       | -        | Color                                   |
| `specifications.warranty`          | String        | ❌       | -        | Warranty period                         |
| `specifications.condition`         | String        | ✅       | "new"    | Condition: "new", "used", "refurbished" |
| `tags`                             | Array[String] | ✅       | []       | Search tags                             |
| `searchKeywords`                   | Array[String] | ✅       | []       | SEO keywords                            |
| `isActive`                         | Boolean       | ✅       | true     | Active in catalog                       |
| `isFeatured`                       | Boolean       | ✅       | false    | Featured product                        |
| `averageRating`                    | Number        | ❌       | -        | Average customer rating                 |
| `reviewCount`                      | Number        | ✅       | 0        | Number of reviews                       |
| `createdAt`                        | Date          | ✅       | Date.now | Creation date                           |
| `updatedAt`                        | Date          | ✅       | Date.now | Last update                             |
| `createdBy`                        | ObjectId      | ❌       | -        | User who created                        |
| `lastModifiedBy`                   | ObjectId      | ❌       | -        | User who last modified                  |

### Indexes:

- `partNumber` (unique)
- `sku` (unique)
- `compatibility.make`
- `category`
- `brand`

---

## 3. Orders Collection (`orders`)

**Purpose**: Stores customer orders, order items, and order status tracking.

### Order Item Schema (`IOrderItem`):

| Field        | Type     | Required | Description                   |
| ------------ | -------- | -------- | ----------------------------- |
| `partId`     | ObjectId | ✅       | Reference to parts collection |
| `partNumber` | String   | ✅       | Part number                   |
| `name`       | String   | ✅       | Part name                     |
| `price`      | Number   | ✅       | Unit price at time of order   |
| `quantity`   | Number   | ✅       | Quantity ordered              |
| `subtotal`   | Number   | ✅       | Line total (price × quantity) |
| `discount`   | Number   | ❌       | Line discount amount          |
| `image`      | String   | ❌       | Product image URL             |

### Main Order Schema (`IOrder`):

| Field                      | Type              | Required | Default   | Description                                           |
| -------------------------- | ----------------- | -------- | --------- | ----------------------------------------------------- |
| `_id`                      | ObjectId          | Auto     | -         | MongoDB document ID                                   |
| `orderNumber`              | String            | ✅       | -         | Unique order number                                   |
| `userId`                   | ObjectId          | ✅       | -         | Reference to user                                     |
| `customer`                 | Object            | ✅       | -         | Customer information                                  |
| `customer.name`            | String            | ✅       | -         | Customer name                                         |
| `customer.email`           | String            | ✅       | -         | Customer email                                        |
| `customer.phone`           | String            | ✅       | -         | Customer phone                                        |
| `customer.address`         | Object            | ✅       | -         | Shipping address                                      |
| `customer.address.street`  | String            | ✅       | -         | Street address                                        |
| `customer.address.city`    | String            | ✅       | -         | City                                                  |
| `customer.address.state`   | String            | ✅       | -         | State                                                 |
| `customer.address.zipCode` | String            | ✅       | -         | ZIP code                                              |
| `customer.address.country` | String            | ✅       | -         | Country                                               |
| `items`                    | Array[IOrderItem] | ✅       | -         | Order items                                           |
| `subtotal`                 | Number            | ✅       | -         | Items subtotal                                        |
| `tax`                      | Number            | ✅       | -         | Tax amount                                            |
| `shipping`                 | Number            | ✅       | -         | Shipping cost                                         |
| `discount`                 | Number            | ❌       | -         | Order discount                                        |
| `total`                    | Number            | ✅       | -         | Final total                                           |
| `currency`                 | String            | ✅       | "USD"     | Currency                                              |
| `paymentMethod`            | String            | ✅       | -         | "stripe", "paypal", "cash", "bank_transfer"           |
| `paymentStatus`            | String            | ✅       | "pending" | "pending", "processing", "paid", "failed", "refunded" |
| `paymentIntentId`          | String            | ❌       | -         | Payment processor ID                                  |
| `paidAt`                   | Date              | ❌       | -         | Payment date                                          |
| `shippingMethod`           | String            | ✅       | -         | Shipping method                                       |
| `trackingNumber`           | String            | ❌       | -         | Shipping tracking number                              |
| `estimatedDelivery`        | Date              | ❌       | -         | Estimated delivery date                               |
| `actualDelivery`           | Date              | ❌       | -         | Actual delivery date                                  |
| `status`                   | String            | ✅       | "pending" | Order status                                          |
| `customerNotes`            | String            | ❌       | -         | Customer notes                                        |
| `adminNotes`               | String            | ❌       | -         | Admin notes                                           |
| `createdAt`                | Date              | ✅       | Date.now  | Order creation                                        |
| `updatedAt`                | Date              | ✅       | Date.now  | Last update                                           |
| `confirmedAt`              | Date              | ❌       | -         | Confirmation date                                     |
| `shippedAt`                | Date              | ❌       | -         | Shipping date                                         |
| `deliveredAt`              | Date              | ❌       | -         | Delivery date                                         |
| `cancelledAt`              | Date              | ❌       | -         | Cancellation date                                     |
| `refundedAt`               | Date              | ❌       | -         | Refund date                                           |

### Order Status Values:

- `"pending"` - Order placed, awaiting confirmation
- `"confirmed"` - Order confirmed by admin
- `"processing"` - Order being prepared
- `"shipped"` - Order shipped
- `"delivered"` - Order delivered
- `"cancelled"` - Order cancelled
- `"refunded"` - Order refunded

### Indexes:

- `orderNumber` (unique)
- `userId`

---

## 4. Quotes Collection (`quotes`)

**Purpose**: Stores quote requests from customers and responses from admins.

### Quote Item Schema (`IQuoteItem`):

| Field         | Type     | Required | Description                    |
| ------------- | -------- | -------- | ------------------------------ |
| `partId`      | ObjectId | ❌       | Reference to parts (if exists) |
| `partNumber`  | String   | ❌       | Part number (if known)         |
| `name`        | String   | ✅       | Part/service name              |
| `description` | String   | ❌       | Part description               |
| `quantity`    | Number   | ✅       | Quantity needed                |
| `notes`       | String   | ❌       | Additional notes               |

### Main Quote Schema (`IQuote`):

| Field                   | Type              | Required | Default   | Description                       |
| ----------------------- | ----------------- | -------- | --------- | --------------------------------- |
| `_id`                   | ObjectId          | Auto     | -         | MongoDB document ID               |
| `quoteNumber`           | String            | ✅       | -         | Unique quote number               |
| `userId`                | ObjectId          | ❌       | -         | User ID (if registered)           |
| `customer`              | Object            | ✅       | -         | Customer information              |
| `customer.name`         | String            | ✅       | -         | Customer name                     |
| `customer.email`        | String            | ✅       | -         | Customer email                    |
| `customer.phone`        | String            | ✅       | -         | Customer phone                    |
| `customer.company`      | String            | ❌       | -         | Company name                      |
| `customer.address`      | Object            | ❌       | -         | Customer address                  |
| `vehicle`               | Object            | ✅       | -         | Vehicle information               |
| `vehicle.make`          | String            | ✅       | -         | Vehicle make                      |
| `vehicle.model`         | String            | ✅       | -         | Vehicle model                     |
| `vehicle.year`          | Number            | ✅       | -         | Vehicle year                      |
| `vehicle.vin`           | String            | ❌       | -         | VIN number                        |
| `vehicle.engine`        | String            | ❌       | -         | Engine type                       |
| `vehicle.trim`          | String            | ❌       | -         | Trim level                        |
| `items`                 | Array[IQuoteItem] | ✅       | -         | Requested items                   |
| `message`               | String            | ❌       | -         | Customer message                  |
| `urgency`               | String            | ✅       | "medium"  | "low", "medium", "high", "urgent" |
| `preferredDeliveryDate` | Date              | ❌       | -         | Preferred delivery                |
| `quotedPrice`           | Number            | ❌       | -         | Admin quoted price                |
| `quotedBy`              | ObjectId          | ❌       | -         | Admin who quoted                  |
| `quotedAt`              | Date              | ❌       | -         | Quote date                        |
| `validUntil`            | Date              | ❌       | -         | Quote validity                    |
| `quotationNotes`        | String            | ❌       | -         | Admin notes                       |
| `status`                | String            | ✅       | "pending" | Quote status                      |
| `preferredContact`      | String            | ✅       | "email"   | "email", "phone", "whatsapp"      |
| `createdAt`             | Date              | ✅       | Date.now  | Request date                      |
| `updatedAt`             | Date              | ✅       | Date.now  | Last update                       |
| `respondedAt`           | Date              | ❌       | -         | Response date                     |

### Quote Status Values:

- `"pending"` - Quote requested, awaiting response
- `"quoted"` - Quote provided by admin
- `"accepted"` - Quote accepted by customer
- `"rejected"` - Quote rejected by customer
- `"expired"` - Quote expired

### Indexes:

- `quoteNumber` (unique)
- `userId`

---

## Database Relationships

### User → Orders (1:Many)

- `orders.userId` references `users._id`

### User → Quotes (1:Many)

- `quotes.userId` references `users._id`

### Parts → Order Items (1:Many)

- `orders.items[].partId` references `parts._id`

### Parts → Quote Items (1:Many)

- `quotes.items[].partId` references `parts._id`

### User → Parts (Creator) (1:Many)

- `parts.createdBy` references `users._id`
- `parts.lastModifiedBy` references `users._id`

### User → Quotes (Quoter) (1:Many)

- `quotes.quotedBy` references `users._id`

---

## Additional Data Structures

### Frontend-Only Types

These are used in the frontend but not stored in MongoDB:

#### CartItem (localStorage)

```typescript
interface CartItem {
  id: string;
  partId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand: string;
  partNumber: string;
}
```

#### SearchFilters (component state)

```typescript
interface SearchFilters {
  search: string;
  category: string;
  make: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}
```

#### DashboardStats (computed data)

```typescript
interface DashboardStats {
  statistics: {
    users: { total: number; newToday: number; activeUsers: number };
    parts: { total: number; lowStock: number };
    orders: {
      total: number;
      pending: number;
      today: number;
      thisMonth: number;
      growth: string;
    };
    revenue: { total: number; today: number; thisMonth: number };
    quotes: { pending: number };
  };
  recentOrders: Array<{}>;
  topSellingParts: Array<{}>;
}
```

---

## Usage Instructions

### 1. Install Dependencies

```bash
npm install mongodb bcryptjs
```

### 2. Set Environment Variables

```bash
MONGODB_URI=mongodb://localhost:27017/autoparts
```

### 3. Run Seed Script

```bash
node seed-mongodb.js
```

### 4. Start Application

```bash
pnpm dev
```

### Login Credentials

- **Admin**: admin@autoparts.com / password123
- **User**: user@example.com / password123

---

## Database Size Estimates

Based on the seed data:

- **Users**: ~5 documents
- **Parts**: ~8 documents
- **Orders**: ~12 documents
- **Quotes**: ~4 documents

**Total**: ~29 documents for development testing.

For production, expect:

- **Users**: 1,000+ customers
- **Parts**: 10,000+ parts catalog
- **Orders**: 100+ orders/month
- **Quotes**: 50+ quotes/month
