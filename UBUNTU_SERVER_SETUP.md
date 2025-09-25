# 🐧 Ubuntu Server Setup Guide

Complete guide to deploy your portfolio with contact form functionality on Ubuntu server.

## 📋 Prerequisites

- Ubuntu 20.04+ server with sudo access
- Domain name (optional, can use IP address)
- Mailgun account configured

## 🚀 Step 1: Initial Server Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (Latest LTS)
```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Nginx (Web Server)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install Git
```bash
sudo apt install git -y
```

## 📁 Step 2: Deploy Your Application

### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/your-portfolio-repo.git portfolio
sudo chown -R $USER:$USER /var/www/portfolio
cd /var/www/portfolio
```

### Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### Build Frontend
```bash
npm run build
```

## ⚙️ Step 3: Configure Environment

### Create Backend Environment File
```bash
cd /var/www/portfolio/server
cp .env.example .env
nano .env
```

Add your Mailgun credentials:
```env
MAILGUN_API_KEY=key-your-actual-mailgun-api-key
MAILGUN_DOMAIN=your-domain.com
NODE_ENV=production
PORT=3001
```

### Test Backend Configuration
```bash
# Test Mailgun setup
npm run test-email

# Check if server starts
npm start
# Press Ctrl+C to stop
```

## 🔧 Step 4: Configure Nginx

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or server IP
    
    # Frontend (Static Files)
    location / {
        root /var/www/portfolio/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## 🔄 Step 5: Setup Process Management

### Create PM2 Ecosystem File
```bash
cd /var/www/portfolio
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'portfolio-backend',
    cwd: '/var/www/portfolio/server',
    script: 'index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/portfolio-error.log',
    out_file: '/var/log/pm2/portfolio-out.log',
    log_file: '/var/log/pm2/portfolio-combined.log',
    time: true
  }]
};
```

### Start Application with PM2
```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

## 🔒 Step 6: Setup SSL (Optional but Recommended)

### Install Certbot
```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔥 Step 7: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📊 Step 8: Monitoring and Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status
pm2 logs portfolio-backend

# Nginx status
sudo systemctl status nginx

# Check if ports are listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3001
```

### Useful PM2 Commands
```bash
pm2 restart portfolio-backend  # Restart app
pm2 stop portfolio-backend     # Stop app
pm2 delete portfolio-backend   # Delete app
pm2 logs portfolio-backend     # View logs
pm2 monit                      # Monitor resources
```

### Update Application
```bash
cd /var/www/portfolio

# Pull latest changes
git pull origin main

# Update dependencies if needed
npm install
cd server && npm install && cd ..

# Rebuild frontend
npm run build

# Restart backend
pm2 restart portfolio-backend
```

## 🧪 Step 9: Test Everything

### Test Frontend
```bash
curl -I http://your-domain.com
# Should return 200 OK
```

### Test Backend API
```bash
curl http://your-domain.com/api/health
# Should return JSON with status: "ok"
```

### Test Contact Form
1. Visit your website
2. Fill out the contact form
3. Check if you receive the email
4. Verify sender receives confirmation

## 🆘 Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs portfolio-backend

# Check if port is in use
sudo lsof -i :3001

# Restart manually
cd /var/www/portfolio/server
npm start
```

### Nginx Issues
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Email Not Working
```bash
# Test Mailgun configuration
cd /var/www/portfolio/server
npm run test-email

# Check environment variables
cat .env
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/portfolio

# Fix permissions
chmod -R 755 /var/www/portfolio
```

## 📈 Performance Optimization

### Enable Gzip Compression
Add to nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/portfolio
```

Add:
```
/var/log/pm2/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🎉 Success!

Your portfolio is now running on Ubuntu server with:
- ✅ Automatic email functionality via Mailgun
- ✅ Professional SSL certificate
- ✅ Process management with PM2
- ✅ Reverse proxy with Nginx
- ✅ Automatic restarts and monitoring

**Access your portfolio at:** `https://your-domain.com`

## 📞 Quick Commands Reference

```bash
# Check everything is running
pm2 status && sudo systemctl status nginx

# View logs
pm2 logs portfolio-backend
sudo tail -f /var/log/nginx/access.log

# Restart everything
pm2 restart portfolio-backend
sudo systemctl reload nginx

# Update application
cd /var/www/portfolio && git pull && npm run build && pm2 restart portfolio-backend
```