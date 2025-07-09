# Docker Deployment Guide for Autoparts Application

This guide covers Docker deployment for both local development and EasyPanel production deployment.

## 🐳 Docker Files Overview

- **`Dockerfile`** - Production-optimized multi-stage build
- **`docker-compose.yml`** - Local development with MongoDB
- **`.dockerignore`** - Optimizes build context
- **`healthcheck.js`** - Container health monitoring
- **`init-mongo.js`** - MongoDB initialization script
- **`app/api/health/route.ts`** - Health check API endpoint

## 🏠 Local Development with Docker Compose

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone and navigate to your project**:

```bash
git clone <your-repo>
cd autoparts
```

2. **Start all services**:

```bash
docker-compose up -d
```

3. **View logs**:

```bash
docker-compose logs -f app
```

4. **Access services**:

- Application: http://localhost:3000
- MongoDB Admin: http://localhost:8081
- Health Check: http://localhost:3000/api/health

### Docker Compose Services

#### Application (`app`)

- **Port**: 3000
- **Health Check**: Every 30s
- **Auto-restart**: Unless stopped
- **Depends on**: MongoDB

#### MongoDB (`mongodb`)

- **Port**: 27017
- **Database**: `autoparts`
- **User**: `autoparts_user`
- **Password**: `autoparts_pass`
- **Persistent data**: Docker volume

#### MongoDB Admin (`mongo-express`)

- **Port**: 8081
- **Username**: N/A (no auth)
- **Database management UI**

### Useful Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Reset everything (including data)
docker-compose down -v
docker-compose up --build -d

# Execute commands in containers
docker-compose exec app sh
docker-compose exec mongodb mongosh

# Check service status
docker-compose ps

# View resource usage
docker-compose top
```

## 🚀 EasyPanel Production Deployment

### Option 1: Pre-built Docker Image

1. **Build and push image**:

```bash
# Build the image
docker build -t autoparts-app \
  --build-arg NEXT_PUBLIC_API_URL=https://your-domain.com \
  --build-arg NEXT_PUBLIC_APP_URL=https://your-domain.com \
  .

# Tag for your registry
docker tag autoparts-app your-registry/autoparts-app:latest

# Push to registry
docker push your-registry/autoparts-app:latest
```

2. **Deploy in EasyPanel**:

- Service type: "Docker"
- Image: `your-registry/autoparts-app:latest`
- Port: `3000`
- Add environment variables (see Environment Variables section)

### Option 2: GitHub + Dockerfile

1. **Push Dockerfile to GitHub**
2. **Create Docker service in EasyPanel**:

- Service type: "Docker"
- Source: GitHub repository
- Dockerfile path: `./Dockerfile`
- Build args:
  ```
  NEXT_PUBLIC_API_URL=https://your-domain.com
  NEXT_PUBLIC_APP_URL=https://your-domain.com
  ```

### Environment Variables for EasyPanel

Set these in EasyPanel environment configuration:

```env
# Database (MongoDB service in EasyPanel)
MONGODB_URI=mongodb://autoparts_user:YOUR_PASSWORD@autoparts-mongodb:27017/autoparts

# JWT Secrets (generate secure random values)
JWT_SECRET=your-secure-32-character-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret

# Application URLs
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com

# Production settings
NODE_ENV=production

# Optional: Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional: Cloudinary (if using image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🔧 Docker Optimization Features

### Multi-stage Build

- **Dependencies stage**: Installs npm packages
- **Builder stage**: Builds the application
- **Runner stage**: Minimal production image

### Security Features

- Non-root user (`nextjs`)
- Minimal Alpine Linux base
- Only production dependencies
- Secure file permissions

### Performance Optimizations

- Standalone Next.js output
- Output file tracing
- Optimized layer caching
- Health checks for reliability

### Image Size Optimization

- Uses Alpine Linux (small base image)
- Multi-stage build removes build dependencies
- `.dockerignore` excludes unnecessary files
- Standalone mode reduces bundle size

## 📊 Monitoring and Health Checks

### Health Check Endpoint

- **URL**: `/api/health`
- **Method**: GET
- **Response**:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "database": "connected"
}
```

### Docker Health Checks

- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start period**: 40 seconds

### Logging

```bash
# View application logs
docker logs -f autoparts-app

# View MongoDB logs
docker logs -f autoparts-mongodb

# Follow logs in real-time
docker-compose logs -f app
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build -t autoparts-app \
            --build-arg NEXT_PUBLIC_API_URL=${{ secrets.APP_URL }} \
            --build-arg NEXT_PUBLIC_APP_URL=${{ secrets.APP_URL }} \
            .

      - name: Deploy to registry
        run: |
          docker tag autoparts-app ${{ secrets.REGISTRY }}/autoparts-app:latest
          docker push ${{ secrets.REGISTRY }}/autoparts-app:latest
```

## 🛠️ Troubleshooting

### Common Issues

1. **Container won't start**:

```bash
# Check logs
docker-compose logs app

# Common causes:
# - Missing environment variables
# - MongoDB connection issues
# - Port conflicts
```

2. **Database connection errors**:

```bash
# Check MongoDB status
docker-compose ps mongodb

# Test connection
docker-compose exec mongodb mongosh -u autoparts_user -p autoparts_pass autoparts
```

3. **Build failures**:

```bash
# Clean build
docker system prune -a
docker-compose build --no-cache

# Check build logs
docker-compose up --build
```

4. **Health check failures**:

```bash
# Test health endpoint manually
curl http://localhost:3000/api/health

# Check container health
docker inspect autoparts-app | grep Health
```

### Performance Tuning

1. **Memory optimization**:

```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

2. **CPU optimization**:

```yaml
# Limit CPU usage
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "1.0"
```

## 📝 Development Workflow

1. **Make changes** to your code
2. **Rebuild and restart**:

```bash
docker-compose up --build -d
```

3. **Test changes** at http://localhost:3000
4. **View logs** for debugging:

```bash
docker-compose logs -f app
```

5. **Commit and push** for production deployment

## 🔐 Security Best Practices

1. **Use specific image tags** instead of `latest`
2. **Set resource limits** to prevent DoS
3. **Use secrets management** for sensitive data
4. **Regular security updates**:

```bash
# Update base images
docker-compose pull
docker-compose up --build -d
```

5. **Scan images for vulnerabilities**:

```bash
docker scout quickview autoparts-app
```

Your autoparts application is now fully containerized and ready for deployment!
