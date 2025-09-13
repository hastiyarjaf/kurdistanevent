# Kurdistan Events - Full-Stack Deployment Guide

This guide will help you deploy the Kurdistan Events application to production.

## Quick Start with Docker

The easiest way to deploy the application is using Docker Compose:

1. **Clone and prepare the repository:**
   ```bash
   git clone <your-repository-url>
   cd kurdistanevent
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your actual values
   ```

3. **Deploy with Docker Compose:**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

The application will be available at `http://localhost` (frontend) and `http://localhost:3000` (backend API).

## Manual Deployment

### Backend Deployment

1. **Prepare the backend:**
   ```bash
   cd my-backend
   npm install --production
   ```

2. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-super-secure-jwt-secret
   export FRONTEND_URL=https://yourdomain.com
   export PORT=3000
   ```

3. **Start the backend:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the frontend:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to a static hosting service:**
   - **Netlify/Vercel:** Connect your repository and set build command to `npm run build`
   - **Nginx:** Copy the `dist/` folder to your web server
   - **Apache:** Copy the `dist/` folder and configure URL rewriting

## Environment Variables

### Backend (.env)
```
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
DB_PATH=./database.sqlite
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up domain names
- [ ] Configure Google Maps API key with domain restrictions
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up CORS for your domain
- [ ] Test all functionality in production environment

## Hosting Recommendations

### Backend
- **VPS:** DigitalOcean, Linode, AWS EC2
- **Platform-as-a-Service:** Heroku, Railway, Render
- **Serverless:** Vercel Functions, Netlify Functions

### Frontend
- **Static Hosting:** Netlify, Vercel, Cloudflare Pages
- **CDN:** AWS CloudFront, Cloudflare
- **VPS:** Nginx on any VPS provider

### Database
- **Development/Small Scale:** SQLite (included)
- **Production Scale:** PostgreSQL on managed services like AWS RDS, PlanetScale

## Security Notes

1. **JWT Secret:** Use a strong, random secret key
2. **HTTPS:** Always use HTTPS in production
3. **CORS:** Configure CORS to only allow your frontend domain
4. **API Rate Limiting:** Consider adding rate limiting to the API
5. **Environment Variables:** Never commit sensitive environment variables to version control

## Monitoring

Consider setting up:
- Application monitoring (e.g., Sentry)
- Server monitoring (e.g., Datadog, New Relic)
- Uptime monitoring (e.g., Uptime Robot)
- Log aggregation (e.g., LogRocket, Papertrail)

## Backup Strategy

1. **Database Backups:** Regular automated backups of SQLite database
2. **Environment Config:** Keep secure backups of environment variables
3. **Code Repository:** Ensure all code is committed to version control

## Scaling Considerations

As your application grows, consider:
- Migrating from SQLite to PostgreSQL
- Adding Redis for session storage and caching  
- Implementing WebSocket for real-time messaging
- Adding image upload functionality with cloud storage (AWS S3, Cloudinary)
- Setting up a CDN for static assets