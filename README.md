# Auto Parts E-commerce Platform

A comprehensive auto parts e-commerce platform built with Next.js, MongoDB, and JWT authentication. Features include user management, parts catalog, quote requests, admin dashboard, and secure payment processing.

## 🚀 Features

- **Authentication & User Management**

  - JWT-based authentication with refresh tokens
  - User registration and login
  - Role-based access control (admin/user)
  - Profile management

- **Parts Catalog**

  - Advanced search and filtering
  - Real-time inventory tracking
  - Vehicle compatibility matching
  - Image management

- **Admin Dashboard**

  - Sales analytics and reporting
  - Inventory management
  - Order processing
  - User management

- **Quote System**

  - Quote request submission
  - Vehicle-specific quotes
  - Admin quote management

- **Security**
  - Password hashing with bcrypt
  - Input validation with Zod
  - Protected API routes
  - CSRF protection

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MongoDB (local or Atlas)
- Stripe account (for payments)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd autoparts
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   node setup.js
   ```

   This will create a `.env.local` file. Update it with your actual values.

4. **Configure MongoDB**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (recommended for production)
   - Update `MONGODB_URI` in `.env.local`

## 🔧 Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/autoparts

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Optional: WhatsApp API
WHATSAPP_API_URL=https://api.whatsapp.com/
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: AI Features
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_VISION_API_KEY=your-google-vision-api-key

# Admin Default Credentials
ADMIN_EMAIL=admin@autoparts.com
ADMIN_PASSWORD=changeThisPassword123!
```

### Generate Secure Secrets

You can generate secure JWT secrets using:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

## 🚀 Running the Application

### Development Mode

```bash
# Start development server
pnpm dev

# The application will be available at http://localhost:3000
```

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Other Commands

```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests (when implemented)
pnpm test
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Parts Management

- `GET /api/parts` - Get parts catalog (with search/filters)
- `POST /api/parts` - Create new part (admin only)
- `GET /api/parts/[id]` - Get specific part
- `PUT /api/parts/[id]` - Update part (admin only)
- `DELETE /api/parts/[id]` - Delete part (admin only)

### Admin Endpoints

- `GET /api/admin/dashboard` - Admin dashboard statistics

### Quote Management

- `GET /api/quotes` - Get quotes (role-based access)
- `POST /api/quotes` - Submit quote request

## 🧪 Testing the API

You can test the API endpoints using tools like Postman, Insomnia, or curl:

### Example: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "phoneNumber": "+1234567890"
  }'
```

### Example: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Example: Get Parts (with authentication)

```bash
curl -X GET http://localhost:3000/api/parts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. Create database: `autoparts`
4. Update `MONGODB_URI` in `.env.local`

## 🔒 Security Considerations

- Change default admin credentials
- Use strong JWT secrets
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting
- Use environment variables for sensitive data

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker Deployment

```bash
# Build Docker image
docker build -t autoparts .

# Run container
docker run -p 3000:3000 --env-file .env.local autoparts
```

### Manual Deployment

1. Build the application: `pnpm build`
2. Set up production environment variables
3. Start the server: `pnpm start`

## 📁 Project Structure

```
autoparts/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin endpoints
│   │   ├── parts/         # Parts management
│   │   └── quotes/        # Quote management
│   ├── components/        # React components
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication utilities
│   └── db/                # Database utilities
├── models/                # Data models
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
└── public/                # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Roadmap

- [ ] Frontend UI components
- [ ] Payment integration
- [ ] Email notifications
- [ ] Real-time inventory updates
- [ ] AI-powered features
- [ ] Mobile app
- [ ] Multi-language support
