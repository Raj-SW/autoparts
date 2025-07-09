# EasyPanel Quick Start Checklist

Follow this checklist to deploy your autoparts application to EasyPanel step by step.

## Pre-Deployment Checklist

- [ ] EasyPanel account created and server provisioned
- [ ] GitHub repository with your code pushed
- [ ] Domain name ready (optional but recommended)
- [ ] External service accounts prepared:
  - [ ] Gmail account for SMTP (with app password)
  - [ ] Stripe account (if using payments)
  - [ ] Cloudinary account (if using image uploads)

## EasyPanel Deployment Steps

### 1. MongoDB Setup

- [ ] Create new MongoDB service in EasyPanel
- [ ] Configure service name: `autoparts-mongodb`
- [ ] Set database name: `autoparts`
- [ ] Create username: `autoparts_user`
- [ ] Generate strong password and save it
- [ ] Deploy MongoDB service
- [ ] Copy connection string for later use

### 2. Environment Variables Preparation

Generate these values and save them:

- [ ] **JWT_SECRET**: Random 32+ character string
- [ ] **JWT_REFRESH_SECRET**: Different random 32+ character string
- [ ] **MONGODB_URI**: `mongodb://autoparts_user:YOUR_PASSWORD@autoparts-mongodb:27017/autoparts`
- [ ] **Email credentials**: Gmail address and app password
- [ ] **Domain URLs**: Your actual domain or EasyPanel subdomain

### 3. Next.js Application Deployment

- [ ] Create new Node.js service in EasyPanel
- [ ] Configure service name: `autoparts-app`
- [ ] Connect to your GitHub repository
- [ ] Set build command: `pnpm install && pnpm build`
- [ ] Set start command: `pnpm start`
- [ ] Set port: `3000`
- [ ] Set Node version: `18` or higher

### 4. Environment Variables Configuration

Add these environment variables in EasyPanel:

```
MONGODB_URI=mongodb://autoparts_user:YOUR_PASSWORD@autoparts-mongodb:27017/autoparts
JWT_SECRET=your-32-character-secret
JWT_REFRESH_SECRET=your-other-32-character-secret
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
NODE_ENV=production
```

Optional (add if using):

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 5. Deploy and Configure

- [ ] Click "Deploy" button in EasyPanel
- [ ] Monitor build logs for errors
- [ ] Wait for deployment to complete
- [ ] Configure domain and SSL in EasyPanel
- [ ] Update environment variables with actual domain URLs
- [ ] Redeploy application with updated URLs

### 6. Post-Deployment Setup

- [ ] Test application accessibility at your domain
- [ ] Create admin user via API or registration
- [ ] Test core functionality:
  - [ ] User registration
  - [ ] User login
  - [ ] Admin access
  - [ ] Parts catalog
  - [ ] Quote system
- [ ] Configure backups for MongoDB
- [ ] Set up monitoring and alerts

## Commands for Testing

### Create Admin User

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

### Test Login

```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "AdminPassword123!"
  }'
```

## Troubleshooting Quick Fixes

### Application won't start:

- Check build logs for errors
- Verify all required environment variables are set
- Ensure MongoDB service is running

### Database connection errors:

- Verify MongoDB connection string format
- Check MongoDB service status
- Ensure network connectivity between services

### Build failures:

- Check Node.js version (should be 18+)
- Verify package.json scripts
- Check for dependency conflicts

## Success Criteria

Your deployment is successful when:

- [ ] Application loads at your domain
- [ ] Users can register and login
- [ ] Admin panel is accessible
- [ ] Parts catalog displays correctly
- [ ] Quote system works
- [ ] Email notifications are sent
- [ ] Payment processing works (if configured)

## Maintenance Tasks

Set up recurring tasks:

- [ ] Weekly: Check application logs
- [ ] Weekly: Monitor resource usage
- [ ] Monthly: Update dependencies
- [ ] Monthly: Test backup restore process
- [ ] Quarterly: Security review and updates

Your autoparts application should now be live and ready for users!
