# 🚀 Docker Remote Server Deployment Guide

## The Problem
When running Docker on a remote server, the admin panel can't connect to the backend because it's trying to use `http://localhost:3001`, which refers to the **user's local machine**, not the server.

## The Solution
Configure `NEXT_PUBLIC_API_URL` to point to your server's public IP or domain.

---

## 📋 Step-by-Step Deployment on Ubuntu Server

### 1. Update Your `.env` File on the Server

SSH into your server and edit the `.env` file:

```bash
cd /home/ubuntu/personal-portfolio/portfolio-paulw
nano .env
```

Add this line with **your server's IP or domain**:

```env
# GitHub Configuration
GITHUB_USERNAME=mchivelli

# ClickUp Configuration
CLICKUP_API_KEY=pk_95169995_V1XJS7CDH6OU3NAHL1IZPYOXMZFCO6ZS

# Mailgun Configuration
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com

# CRITICAL: API URL for Admin Panel
# Replace with your server's IP or domain
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:3001
```

**Examples:**
- If your server IP is `203.0.113.45`: `NEXT_PUBLIC_API_URL=http://203.0.113.45:3001`
- If you have a domain: `NEXT_PUBLIC_API_URL=http://yourdomain.com:3001`
- For HTTPS with domain: `NEXT_PUBLIC_API_URL=https://yourdomain.com:3001`

### 2. Rebuild and Restart Docker Containers

**Important:** You need to rebuild because `NEXT_PUBLIC_API_URL` is baked into the frontend during build time.

```bash
# Stop and remove existing containers
docker-compose down

# Rebuild with the new environment variable
docker-compose build --no-cache

# Start the containers
docker-compose up -d

# Verify they're running
docker-compose ps
```

### 3. Check Backend is Accessible

Test that the backend is reachable from outside the container:

```bash
# From the server
curl http://localhost:3001/api/auth/check

# Should return: {"authenticated":false}
```

### 4. Access the Admin Panel

Open your browser and go to:
```
http://YOUR_SERVER_IP:3030/admin
```

**Login credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🔒 Security Configuration for Production

### 1. Use a Domain Name with SSL

If you have a domain, set up SSL using Nginx or Caddy:

**With Nginx (recommended for production):**

```bash
# Install Certbot for Let's Encrypt SSL
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Your `.env` would then be:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Change Default Credentials

In your `.env` file on the server:
```env
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password-here
```

Then rebuild:
```bash
docker-compose down
docker-compose build backend
docker-compose up -d
```

### 3. Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 3001/tcp  # Backend API
sudo ufw allow 3030/tcp  # Frontend (or 80/443 if using Nginx)
sudo ufw allow 22/tcp    # SSH
sudo ufw enable
```

---

## 🐛 Troubleshooting

### "Login failed - make sure admin server is running"

**Cause:** Frontend can't reach backend API.

**Solutions:**

1. **Check NEXT_PUBLIC_API_URL in .env:**
   ```bash
   cat .env | grep NEXT_PUBLIC_API_URL
   ```
   - Should show your server's IP or domain, NOT `localhost`

2. **Verify backend is running:**
   ```bash
   docker-compose ps
   # backend should show "Up" and "healthy"
   ```

3. **Test backend connectivity:**
   ```bash
   curl http://YOUR_SERVER_IP:3001/api/auth/check
   ```
   - Should return JSON, not a connection error

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for CORS or network errors

5. **Rebuild if you changed NEXT_PUBLIC_API_URL:**
   ```bash
   docker-compose down
   docker-compose build --no-cache frontend
   docker-compose up -d
   ```

### "CORS Error" in Browser Console

**Cause:** Backend needs to allow requests from your frontend URL.

**Solution:** Update backend CORS configuration in `server/index.js`:

```javascript
app.use(cors({ 
  origin: [
    'http://YOUR_SERVER_IP:3030',
    'http://yourdomain.com'
  ],
  credentials: true 
}));
```

### Port 3001 or 3030 Already in Use

**Check what's using the ports:**
```bash
sudo lsof -i :3001
sudo lsof -i :3030
```

**Kill the process:**
```bash
sudo kill -9 <PID>
```

Or change the ports in `docker-compose.yml`:
```yaml
ports:
  - "3002:3001"  # Backend on 3002
  - "3031:3000"  # Frontend on 3031
```

Then update `NEXT_PUBLIC_API_URL` accordingly.

---

## 📝 Current Docker Setup

Your containers are mapped as follows:

| Service | Container Port | Host Port | Access URL |
|---------|---------------|-----------|------------|
| Frontend | 3000 | 3030 | `http://YOUR_IP:3030` |
| Backend | 3001 | 3001 | `http://YOUR_IP:3001` |

**Note:** Port 3030 (not 3000) because we changed it to avoid conflicts.

---

## 🔄 Quick Deployment Commands

```bash
# Full rebuild and restart
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# View logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# Check container status
docker-compose ps

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
```

---

## ✅ Deployment Checklist

- [ ] `.env` file created on server with all variables
- [ ] `NEXT_PUBLIC_API_URL` set to server IP/domain (NOT localhost)
- [ ] `GITHUB_USERNAME` set correctly
- [ ] `CLICKUP_API_KEY` set correctly
- [ ] `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` set (if using contact form)
- [ ] `ADMIN_USERNAME` and `ADMIN_PASSWORD` changed from defaults
- [ ] Containers built with `docker-compose build --no-cache`
- [ ] Containers running with `docker-compose up -d`
- [ ] Backend responding at `http://YOUR_IP:3001/api/auth/check`
- [ ] Frontend accessible at `http://YOUR_IP:3030`
- [ ] Admin panel login works at `http://YOUR_IP:3030/admin`
- [ ] Firewall configured to allow ports 3001 and 3030
- [ ] (Optional) SSL certificate set up with Nginx/Caddy

---

## 🎯 What You Need to Do Right Now

On your Ubuntu server, run:

```bash
cd /home/ubuntu/personal-portfolio/portfolio-paulw

# Edit .env file
nano .env

# Add this line (replace with your actual server IP):
# NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:3001

# Save (Ctrl+X, Y, Enter)

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Test backend
curl http://localhost:3001/api/auth/check

# If that works, test from your local machine:
# Open browser to http://YOUR_SERVER_IP:3030/admin
```

---

## 📚 Additional Resources

- Admin Panel Guide: `ADMIN_PANEL_GUIDE.md`
- Docker Compose Reference: `docker-compose.yml`
- Frontend Dockerfile: `Dockerfile`
- Backend Dockerfile: `server/Dockerfile`

**🎉 Once deployed, your portfolio will be fully functional with the admin panel accessible remotely!**
