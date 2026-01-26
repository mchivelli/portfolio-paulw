# 🚀 Production Deployment Guide

This guide covers deploying your portfolio website with the contact form functionality.

## 📋 Prerequisites

- ✅ Mailgun account with verified domain
- ✅ Web hosting service (Netlify, Vercel, etc.)
- ✅ Server hosting for backend (Railway, Render, Heroku, etc.)

## 🌐 Frontend Deployment

### Option 1: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - No frontend env vars needed (API calls use relative URLs)

### Option 2: Vercel
1. Connect your GitHub repository to Vercel
2. Build settings are auto-detected
3. No additional configuration needed

### Option 3: Static Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your web server to serve the files

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Set the root directory to `server`
3. Environment variables:
   ```
   MAILGUN_API_KEY=your-api-key
   MAILGUN_DOMAIN=your-domain.com
   PORT=3001
   NODE_ENV=production
   ```

### Option 2: Render
1. Create a new Web Service
2. Connect your repository
3. Settings:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables

### Option 3: Heroku
1. Create a new Heroku app
2. Set buildpack to Node.js
3. Configure environment variables
4. Deploy from GitHub or CLI

## ⚙️ Configuration

### 1. Update API URLs for Production
The frontend automatically detects the environment and uses appropriate API URLs:
- Development: `http://localhost:3001/api/contact`
- Production: `/api/contact` (same domain) or your backend URL

### 2. Configure CORS
Update `server/index.js` CORS settings for your production domains:
```javascript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com',
    'http://localhost:5173' // Keep for local development
  ],
  credentials: true
}));
```

### 3. Environment Variables
Set these in your backend hosting service:
```
MAILGUN_API_KEY=key-your-actual-api-key
MAILGUN_DOMAIN=your-verified-domain.com
NODE_ENV=production
PORT=3001
```

## 🔒 Security Checklist

- ✅ Use HTTPS for both frontend and backend
- ✅ Keep Mailgun API key secure (never in frontend code)
- ✅ Configure CORS for your specific domains
- ✅ Enable rate limiting (already configured)
- ✅ Use environment variables for all secrets
- ✅ Monitor email delivery and errors

## 🧪 Testing Production Setup

1. **Test contact form**: Fill out and submit
2. **Check email delivery**: Verify you receive the email
3. **Test confirmation**: Sender should receive confirmation
4. **Monitor logs**: Check for any errors
5. **Test rate limiting**: Ensure protection works

## 📊 Monitoring

### Email Delivery
- Monitor Mailgun dashboard for delivery stats
- Set up alerts for failed deliveries
- Check spam rates and reputation

### Server Health
- Use `/api/health` endpoint for monitoring
- Set up uptime monitoring (UptimeRobot, etc.)
- Monitor server logs for errors

## 🔄 Updates and Maintenance

### Frontend Updates
1. Make changes to your code
2. Push to GitHub
3. Hosting service auto-deploys (if configured)

### Backend Updates
1. Update server code
2. Push to GitHub
3. Backend service auto-deploys
4. Monitor for any issues

## 🆘 Troubleshooting

### Contact Form Not Working
1. Check browser console for errors
2. Verify backend is running (`/api/health`)
3. Check CORS configuration
4. Verify Mailgun credentials

### Emails Not Sending
1. Check Mailgun dashboard
2. Verify domain is verified
3. Check API key permissions
4. Review server logs

### CORS Errors
1. Add your domain to CORS origins
2. Ensure HTTPS is used in production
3. Check for typos in domain names

---

**🎉 Your portfolio is now production-ready with automatic email functionality!**