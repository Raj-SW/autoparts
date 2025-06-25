# 🚀 Quick Start Guide

Get your Auto Parts E-commerce platform running in minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- MongoDB (local or Atlas)

## Step 1: Setup Environment

```bash
# Run the setup script
node setup.js
```

This creates a `.env.local` file with default values.

## Step 2: Configure MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### Option B: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env.local` to: `mongodb://localhost:27017/autoparts`

## Step 3: Generate Secure Secrets

```bash
# Generate JWT secrets (run these commands)
openssl rand -base64 32
openssl rand -base64 32
```

Update these in `.env.local`:

- `JWT_SECRET` (first generated value)
- `JWT_REFRESH_SECRET` (second generated value)

## Step 4: Start Development Server

```bash
# Install dependencies (if not done already)
pnpm install

# Start development server
pnpm dev
```

Your app will be available at: http://localhost:3000

## Step 5: Test the API

```bash
# Run API tests (in a new terminal)
node test-api.js
```

## Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## Quick API Tests

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User",
    "phoneNumber": "+1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Get Parts Catalog

```bash
curl -X GET http://localhost:3000/api/parts
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Ensure network access (for Atlas)

2. **Port 3000 Already in Use**

   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

3. **Environment Variables Not Loading**

   - Ensure `.env.local` exists in project root
   - Restart the development server

4. **JWT Errors**
   - Generate new JWT secrets
   - Update both `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
node test-api.js  # Run API tests
```

## Next Steps

1. **Frontend Development**: Build UI components
2. **Payment Integration**: Set up Stripe
3. **Email System**: Configure SMTP
4. **Deployment**: Deploy to Vercel/Heroku

## Support

- Check the main [README.md](README.md) for detailed documentation
- Review [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for feature status
- Test API endpoints using the provided test script
