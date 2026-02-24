# 🚀 DEPLOY TO PAULWALLNER.ME NOW

## What Was Fixed

The admin panel wasn't working because the backend container wasn't running the admin routes. I've merged everything into the main server (`server/index.js`).

---

## ⚡ Quick Deploy Steps

Run these commands on your Ubuntu server:

### 1. Update `.env` File

```bash
cd /home/ubuntu/personal-portfolio/portfolio-paulw
nano .env
```

**Add/Update these lines:**

```env
# GitHub Configuration
GITHUB_USERNAME=mchivelli

# ClickUp Configuration
CLICKUP_API_KEY=pk_95169995_V1XJS7CDH6OU3NAHL1IZPYOXMZFCO6ZS

# Mailgun Configuration
MAILGUN_API_KEY=your-mailgun-api-key-here
MAILGUN_DOMAIN=your-mailgun-domain.com

# Admin Credentials (change from defaults!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# CRITICAL: API URL for Admin Panel
# Use your domain name
NEXT_PUBLIC_API_URL=http://paulwallner.me:3001
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

---

### 2. Rebuild Docker Containers

```bash
# Stop everything
docker-compose down

# Rebuild from scratch (this will take a few minutes)
docker-compose build --no-cache

# Start containers
docker-compose up -d

# Check they're running
docker-compose ps
```

**Expected output:**
```
NAME                 STATUS
portfolio-backend    Up (healthy)
portfolio-frontend   Up
```

---

### 3. Test Backend is Working

```bash
curl http://localhost:3001/api/auth/check
```

**Should return:**
```json
{"authenticated":false}
```

✅ **This means admin routes are working!**

❌ **If you see "Cannot GET /api/auth/check"** - the rebuild didn't work, check logs:
```bash
docker-compose logs backend
```

---

### 4. Access Your Site

**Frontend:** `http://paulwallner.me:3030`

**Admin Panel:** `http://paulwallner.me:3030/admin`

Login: `admin` / `admin123`

---

## 🔒 For HTTPS (Recommended)

If you want to use `https://paulwallner.me`, you need to:

1. **Set up SSL certificate** (Let's Encrypt recommended)
2. **Use Nginx as reverse proxy**
3. **Update `.env`:**
   ```env
   NEXT_PUBLIC_API_URL=https://paulwallner.me/api
   ```

Then configure Nginx to proxy:
- `paulwallner.me` → `localhost:3030` (frontend)
- `paulwallner.me/api/*` → `localhost:3001/api/*` (backend)

---

## 🐛 Troubleshooting

### Still getting "Cannot GET /api/auth/check"?

Check if backend installed dependencies:

```bash
docker-compose exec backend ls -la node_modules | grep cookie-parser
docker-compose exec backend ls -la node_modules | grep multer
```

If missing, rebuild:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

### "ERR_CONNECTION_REFUSED" in browser?

1. **Check ports are open:**
   ```bash
   sudo ufw status
   sudo ufw allow 3001/tcp
   sudo ufw allow 3030/tcp
   ```

2. **Check containers are running:**
   ```bash
   docker-compose ps
   docker-compose logs
   ```

3. **Test from your local machine:**
   - Open `http://paulwallner.me:3001/api/auth/check` in browser
   - Should show JSON response

### Admin login still failing?

1. **Check browser console** (F12 → Console tab)
2. **Verify NEXT_PUBLIC_API_URL** is correct in `.env`
3. **Clear browser cache** and try again
4. **Check CORS** - make sure your domain is in the CORS list (it already is in the updated code)

---

## 📊 Port Mapping

| Service | Container Port | Server Port | Public Access |
|---------|---------------|-------------|---------------|
| Frontend | 3000 | 3030 | `paulwallner.me:3030` |
| Backend | 3001 | 3001 | `paulwallner.me:3001` |

---

## ✅ Success Checklist

- [ ] `.env` file has `NEXT_PUBLIC_API_URL=http://paulwallner.me:3001`
- [ ] `docker-compose build --no-cache` completed successfully
- [ ] `docker-compose ps` shows both containers running
- [ ] `curl http://localhost:3001/api/auth/check` returns JSON
- [ ] Browser can access `http://paulwallner.me:3030`
- [ ] Admin login works at `http://paulwallner.me:3030/admin`

---

## 🎉 You're Done!

Once these steps complete:
- Your portfolio will be live at `http://paulwallner.me:3030`
- Admin panel accessible at `http://paulwallner.me:3030/admin`
- All admin features (Projects, Timeline, Settings) will work
- ClickUp workspace selection enabled
- GitHub repo filtering enabled

**Need help?** Check the full guide: `DOCKER_REMOTE_DEPLOYMENT.md`
