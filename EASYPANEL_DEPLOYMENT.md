# EasyPanel Deployment Guide for Autoparts Application

This guide will walk you through deploying your Next.js autoparts application to EasyPanel with MongoDB.

## Prerequisites

1. EasyPanel account and server access
2. Domain name (optional but recommended)
3. GitHub repository with your code

## Step 1: Set Up MongoDB on EasyPanel

### Create MongoDB Service

1. **Login to EasyPanel** and navigate to your project
2. **Create a new service** and select "MongoDB"
3. **Configure MongoDB**:

   - Service name: `autoparts-mongodb`
   - Database name: `autoparts`
   - Username: `autoparts_user`
   - Password: Generate a strong password
   - Port: `27017` (default)
   - Memory: `512MB` (adjust based on your plan)

4. **Deploy the MongoDB service**

5. **Note the connection details**:
   - Internal URL: `mongodb://autoparts_user:your_password@autoparts-mongodb:27017/autoparts`

## Step 2: Prepare Your Application

### Environment Variables for Production

Create these environment variables in EasyPanel:

```env
# Database
MONGODB_URI=mongodb://autoparts_user:your_password@autoparts-mongodb:27017/autoparts

# JWT Secrets (Generate strong random values)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters-long

# Application URLs (Replace with your actual domain)
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yourdomain.com

# Stripe Payment (Optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Node Environment
NODE_ENV=production
```

### Update package.json for Production

Ensure your build script is configured correctly:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Step 3: Deploy Next.js Application

### Create Node.js Service

1. **Create a new service** in EasyPanel
2. **Select "Node.js"** as the service type
3. **Configure the service**:
   - Service name: `autoparts-app`
   - Build command: `pnpm install && pnpm build`
   - Start command: `pnpm start`
   - Port: `3000`
   - Node version: `18` or higher

### Connect to GitHub Repository

1. **Connect your GitHub repository**
2. **Set the branch** to `main` (or your production branch)
3. **Configure auto-deployment** (optional but recommended)

### Configure Environment Variables

Add all the environment variables from Step 2 in the EasyPanel environment configuration.

### Deploy the Application

1. **Click "Deploy"**
2. **Monitor the build logs** for any errors
3. **Wait for deployment to complete**

## Step 4: Configure Domain and SSL

### Domain Setup

1. **Go to Domains section** in EasyPanel
2. **Add your domain** (e.g., autoparts.yourdomain.com)
3. **Point to your Node.js service**
4. **Enable SSL** (Let's Encrypt)

### Update Environment Variables

Once your domain is configured, update:

```env
NEXT_PUBLIC_API_URL=https://autoparts.yourdomain.com
NEXT_PUBLIC_APP_URL=https://autoparts.yourdomain.com
```

## Step 5: Initialize Database (Optional)

### Seed Initial Data

You can run the seed script to populate initial data:

1. **Connect to your MongoDB** service via EasyPanel terminal
2. **Upload and run** your seed scripts:

```bash
# If you have seed data
node seed-mongodb.js
```

### Create Admin User

Create an admin user via API call:

```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourdomain.com",
    "password": "AdminPassword123!",
    "role": "admin"
  }'
```

## Step 6: Configure External Services

### Stripe Setup (Optional)

1. **Get your live Stripe keys** from Stripe Dashboard
2. **Update environment variables** with live keys
3. **Configure webhook endpoint**: `https://your-domain.com/api/payment/webhook`

### Email Configuration

1. **Set up SMTP credentials** (Gmail App Password recommended)
2. **Test email functionality** by registering a user

### Cloudinary Setup (Optional)

1. **Create Cloudinary account**
2. **Get API credentials**
3. **Add to environment variables**

## Step 7: Monitoring and Maintenance

### Health Checks

EasyPanel automatically monitors your services. You can also set up custom health checks:

```javascript
// Add to your app if needed
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
```

### Backup Strategy

1. **Configure MongoDB backups** in EasyPanel
2. **Set backup frequency** (daily recommended)
3. **Test restore process** periodically

### Scaling

- **Monitor resource usage** in EasyPanel dashboard
- **Scale vertically** by increasing memory/CPU
- **Scale horizontally** if needed (multiple instances)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**:

   - Check MongoDB service is running
   - Verify connection string format
   - Ensure network connectivity between services

2. **Build Failures**:

   - Check Node.js version compatibility
   - Verify package.json scripts
   - Review build logs for specific errors

3. **Environment Variable Issues**:
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correctly formatted

### Logs and Debugging

- **Access application logs** via EasyPanel dashboard
- **Monitor MongoDB logs** for database issues
- **Use EasyPanel terminal** for direct service access

## Security Considerations

1. **Strong passwords** for MongoDB and admin accounts
2. **Secure JWT secrets** (minimum 32 characters)
3. **HTTPS only** for production
4. **Regular security updates**
5. **Backup strategy** in place

## Cost Optimization

1. **Right-size your services** based on actual usage
2. **Monitor resource consumption**
3. **Use shared MongoDB** if multiple apps need database access
4. **Implement caching** to reduce database load

Your autoparts application should now be successfully deployed on EasyPanel with MongoDB!
