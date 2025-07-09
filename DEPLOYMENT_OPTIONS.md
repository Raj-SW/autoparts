# Deployment Options for Autoparts Application

Your autoparts application now supports multiple deployment methods. Choose the one that best fits your needs.

## 🎯 Deployment Methods Available

### 1. EasyPanel with Docker (Recommended)

**Best for**: Production deployment with Docker containers

**Files**:

- `Dockerfile` - Production-optimized container
- `DOCKER_DEPLOYMENT.md` - Complete Docker guide
- `EASYPANEL_DEPLOYMENT.md` - EasyPanel-specific instructions

**Quick Setup**:

```bash
# 1. Generate environment variables
npm run generate-env

# 2. Push to GitHub
git add . && git commit -m "Add Docker support" && git push

# 3. Create Docker service in EasyPanel
# 4. Connect to GitHub repository
# 5. Add environment variables from step 1
```

### 2. EasyPanel with Node.js (Alternative)

**Best for**: Direct Node.js deployment without containers

**Files**:

- `EASYPANEL_QUICK_START.md` - Step-by-step checklist
- `scripts/generate-env.js` - Environment variable generator

**Quick Setup**:

```bash
# 1. Generate environment variables
npm run generate-env

# 2. Create Node.js service in EasyPanel
# 3. Set build: pnpm install && pnpm build
# 4. Set start: pnpm start
# 5. Add environment variables
```

### 3. Local Development with Docker

**Best for**: Local testing and development

**Quick Setup**:

```bash
# Start everything locally
npm run docker:dev

# View logs
npm run docker:dev:logs

# Access at http://localhost:3000
```

## 🔧 Available Scripts

### Environment Setup

```bash
npm run generate-env          # Generate secure environment variables
```

### Docker Development

```bash
npm run docker:dev           # Start local development
npm run docker:dev:build     # Rebuild and start
npm run docker:dev:logs      # View application logs
npm run docker:dev:stop      # Stop all services
npm run docker:dev:reset     # Reset everything (including data)
```

### Docker Production

```bash
npm run docker:build         # Build production image
npm run docker:prod:build    # Build with production args
```

## 📚 Documentation Files

| File                       | Purpose                        | When to Use                      |
| -------------------------- | ------------------------------ | -------------------------------- |
| `EASYPANEL_DEPLOYMENT.md`  | Comprehensive EasyPanel guide  | Detailed deployment instructions |
| `EASYPANEL_QUICK_START.md` | Quick checklist format         | Fast deployment reference        |
| `DOCKER_DEPLOYMENT.md`     | Complete Docker guide          | Docker-specific deployment       |
| `scripts/generate-env.js`  | Environment variable generator | Secure configuration setup       |

## 🚀 Recommended Deployment Path

### For Production (EasyPanel + Docker):

1. **Generate Environment Variables**:

```bash
npm run generate-env
```

2. **Test Locally** (optional but recommended):

```bash
npm run docker:dev
# Test at http://localhost:3000
npm run docker:dev:stop
```

3. **Deploy to EasyPanel**:
   - Create MongoDB service
   - Create Docker service from GitHub
   - Add environment variables
   - Configure domain and SSL

### For Local Development:

1. **Start Development Environment**:

```bash
npm run docker:dev
```

2. **Access Services**:

   - App: http://localhost:3000
   - MongoDB Admin: http://localhost:8081
   - Health Check: http://localhost:3000/api/health

3. **Development Workflow**:

```bash
# Make code changes
npm run docker:dev:build  # Rebuild with changes
npm run docker:dev:logs   # View logs
```

## 🔒 Security & Environment Variables

### Required Variables:

- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication tokens
- `JWT_REFRESH_SECRET` - Refresh tokens
- `NEXT_PUBLIC_API_URL` - Your domain URL
- Email configuration for notifications

### Optional Variables:

- Stripe (for payments)
- Cloudinary (for image uploads)
- Additional analytics/monitoring

**💡 Tip**: Use `npm run generate-env` to automatically generate secure values.

## 🆘 Getting Help

### Common Issues:

1. **Docker build fails**: Check `DOCKER_DEPLOYMENT.md` troubleshooting section
2. **Environment variables**: Use the generator script
3. **Database connection**: Verify MongoDB service is running
4. **EasyPanel deployment**: Follow `EASYPANEL_QUICK_START.md` checklist

### Support Files:

- Detailed guides in each `.md` file
- Health check endpoint at `/api/health`
- Docker logs via `npm run docker:dev:logs`

## ✅ Quick Verification

After deployment, verify these work:

- [ ] Application loads at your domain
- [ ] Health check returns 200: `your-domain.com/api/health`
- [ ] User registration works
- [ ] Admin login works
- [ ] Parts catalog displays
- [ ] Quote system functions

Your autoparts application is now ready for deployment! Choose your preferred method and follow the corresponding guide.
