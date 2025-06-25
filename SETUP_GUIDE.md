# Auto Parts E-commerce Setup Guide

This guide will help you set up and run the auto parts e-commerce application with authentication, inventory management, and order processing.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **pnpm** package manager
4. **Git**

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/autoparts

# JWT Secrets (generate strong secrets in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production-minimum-32-chars

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Stripe Payment Integration (optional for now)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# WhatsApp Business API (optional)
WHATSAPP_API_URL=https://api.whatsapp.com/
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# AI Features (optional)
OPENAI_API_KEY=your-openai-api-key
GOOGLE_VISION_API_KEY=your-google-vision-api-key

# Admin Default Credentials
ADMIN_EMAIL=admin@autoparts.com
ADMIN_PASSWORD=changeThisPassword123!
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. Create a database named `autoparts`

#### Option B: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get the connection string and update `MONGODB_URI` in `.env.local`

### 4. Initialize the Database (Optional)

You can manually create an admin user and some sample data:

```bash
# Start the development server first
pnpm dev

# Then use the API to create an admin user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@autoparts.com",
    "password": "Admin123!@#",
    "role": "admin"
  }'
```

### 5. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Testing the Application

### 1. Authentication Flow

1. **Register a new user**: Visit `/register`

   - Fill out the registration form
   - Password strength indicator will guide you
   - You'll be redirected to the dashboard after registration

2. **Login**: Visit `/login`

   - Use the credentials you just created
   - Or use demo accounts (see login page)

3. **Admin Access**:
   - Create an admin user (role: 'admin') through the API
   - Login and visit `/admin` for admin dashboard

### 2. API Testing with curl

#### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phoneNumber": "+230 5123 4567"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get User Profile (requires token)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Create a Part (Admin only)

```bash
curl -X POST http://localhost:3000/api/parts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "partNumber": "BW001",
    "name": "BMW Brake Pad Set",
    "description": "High-quality brake pads for BMW 3 Series",
    "category": "Brakes",
    "brand": "BMW",
    "compatibility": {
      "make": ["BMW"],
      "model": ["3 Series"],
      "year": [2015, 2016, 2017, 2018, 2019, 2020]
    },
    "price": 89.99,
    "costPrice": 65.00,
    "stock": 25,
    "sku": "BMW-BP-001",
    "specifications": {
      "condition": "new",
      "warranty": "1 year"
    }
  }'
```

#### Submit a Quote Request

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+230 5987 6543"
    },
    "vehicle": {
      "make": "BMW",
      "model": "3 Series",
      "year": 2018
    },
    "items": [
      {
        "name": "Brake Pads",
        "quantity": 1,
        "description": "Front brake pads"
      }
    ],
    "urgency": "medium",
    "preferredContact": "email"
  }'
```

### 3. Frontend Testing

1. **User Dashboard** (`/dashboard`):

   - View profile information
   - Access quick actions
   - See account statistics

2. **Admin Dashboard** (`/admin`):
   - View business statistics
   - Monitor orders and inventory
   - Access management tools

## Features Implemented

### ✅ Backend APIs

- **Authentication**: Register, Login, Profile management, JWT tokens
- **Admin Dashboard**: Statistics and overview
- **Parts Management**: CRUD operations with search and filters
- **Quote System**: Submit and manage quote requests
- **Role-based Access**: Admin and user permissions

### ✅ Frontend

- **Authentication Pages**: Login and Register with validation
- **User Dashboard**: Profile and quick actions
- **Admin Dashboard**: Business overview and statistics
- **Responsive Design**: Mobile-friendly interface
- **Toast Notifications**: User feedback system

### ✅ Security

- **Password Hashing**: bcrypt encryption
- **JWT Tokens**: Access and refresh tokens
- **Input Validation**: Zod schema validation
- **CORS Protection**: Secure API endpoints
- **Role-based Access Control**: Protected routes

## Next Steps

1. **Set up Stripe** for payment processing
2. **Configure email notifications** for orders and quotes
3. **Add inventory management UI** for admin
4. **Implement shopping cart** functionality
5. **Set up automated testing**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:

   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Ensure network access for MongoDB Atlas

2. **JWT Token Issues**:

   - Verify JWT secrets are set in environment variables
   - Check token expiration times
   - Clear localStorage and login again

3. **API Errors**:

   - Check browser console for errors
   - Verify API endpoints are correctly formatted
   - Ensure proper authentication headers

4. **Environment Variables Not Loading**:
   - Restart the development server after adding `.env.local`
   - Check file name is exactly `.env.local`
   - Verify variables don't have quotes around values

### Development Tips

1. **API Testing**: Use tools like Postman or curl for API testing
2. **Database Inspection**: Use MongoDB Compass for database management
3. **Logging**: Check console logs for debugging information
4. **Browser DevTools**: Use Network tab to inspect API calls

## Production Deployment

1. **Environment Setup**:

   - Use strong, unique secrets for JWT tokens
   - Set up production MongoDB database
   - Configure SSL certificates

2. **Security Hardening**:

   - Enable CORS for specific domains
   - Set up rate limiting
   - Configure security headers

3. **Performance Optimization**:
   - Enable Next.js optimizations
   - Set up CDN for static assets
   - Configure database indexing

## Support

For questions or issues, check:

1. Implementation status in `IMPLEMENTATION_STATUS.md`
2. API documentation in the code comments
3. Error logs in browser console and server logs
