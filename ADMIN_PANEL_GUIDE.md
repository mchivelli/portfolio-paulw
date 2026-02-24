# 🎛️ Admin Panel Complete Guide

## Overview

Your portfolio now has a **fully-featured admin panel** with complete control over:
- ✅ **Projects** - Add, edit, delete, and feature projects
- ✅ **Timeline** - Manage your work history
- ✅ **Settings** - ClickUp workspace selection & GitHub repo filtering

## 🚀 Access the Admin Panel

**URL:** `http://localhost:3000/admin`

**Default Login:**
- Username: `admin`
- Password: `admin123`

**Change credentials** by setting these environment variables:
```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
```

---

## 📋 Projects Management

### Featured Projects
- **Featured projects** appear on your homepage
- **Limit:** Maximum of 4 featured projects
- Click the **"Feature"** button to make a project featured
- Featured projects have a **green ★ FEATURED** badge

### Adding a New Project

1. Click **"+ Add Project"**
2. Fill in all required fields:
   - **Title** (EN & DE)
   - **Short Description** (EN & DE)
   - **Long Description** (EN & DE)
   - **Tech Stack** (comma-separated: `React, Node.js, MySQL`)
   - **Main Image** (upload or paste URL)
   - **GitHub URL** (required)
   - **Live URL** (optional)
   - **Features** (EN & DE) - one per line
   - **Medium** (e.g., "Web App", "Mobile App")
   - **Grid Span** (1x1, 2x1, 1x2, 2x2)

3. Click **"Save Project"**

### Project Details Page
Every project automatically gets a detail page at:
```
/work/{project-id}
```

**Example:** `/work/1`, `/work/2`, etc.

Projects are **clickable** from:
- Homepage featured section
- Projects grid
- Terminal commands

### Image Management
- **Upload:** Click "Upload" button to add new images
- **Browse:** Click "Browse" to select from existing images
- **Additional Images:** Add multiple gallery images
- Images are stored in `/public` folder

---

## 📅 Timeline Management

Manage your work history chronologically.

### Fields:
- Year
- Company
- Role (EN & DE)
- Description (EN & DE)
- Tech/Skills (comma-separated)

Timeline appears in your "About" section showing your professional journey.

---

## ⚙️ Settings Tab

### 🔵 ClickUp Workspace Selection

**Problem Solved:** Previously hardcoded to first workspace.

**Now You Can:**
1. Go to **Settings** tab
2. Click **"Load Workspaces"**
3. Select your desired workspace from the list
4. Click **"💾 Save Settings"**

**What Happens:**
- Your portfolio now pulls ClickUp data from the selected workspace
- Stats and tasks update automatically
- Changes persist across sessions

**API Endpoint Used:** `/api/clickup?list=true`

---

### 📦 GitHub Repo Selection

**Problem Solved:** Previously showed all/recent repos.

**Now You Can:**
1. Go to **Settings** tab
2. Click **"Load Repositories"**
3. Check/uncheck repos you want to display
4. Click **"💾 Save Settings"**

**What Happens:**
- Only selected repos appear in "Latest Projects"
- Leave empty to show all repos (default)
- Changes take effect immediately

**API Endpoint Used:** `/api/github?list=true`

---

## 🔧 Technical Details

### Data Storage
All data is stored in JSON files:
```
app/api/admin/data/
├── projects.json      # Your projects
├── timeline.json      # Work history
└── settings.json      # ClickUp & GitHub settings
```

### Settings Structure
```json
{
  "clickup": {
    "workspaceId": "12345678",
    "workspaceName": "My Workspace"
  },
  "github": {
    "selectedRepos": [
      "portfolio-website",
      "discord-bot",
      "excel-automation"
    ]
  }
}
```

### API Endpoints

**Projects:**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `PUT /api/projects` - Update project
- `DELETE /api/projects/:id` - Delete project

**Timeline:**
- `GET /api/timeline` - List timeline
- `POST /api/timeline` - Create entry
- `PUT /api/timeline` - Update entry
- `DELETE /api/timeline/:id` - Delete entry

**Settings:**
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

**ClickUp:**
- `GET /api/clickup` - Get tasks from selected workspace
- `GET /api/clickup?list=true` - List all workspaces

**GitHub:**
- `GET /api/github` - Get selected repos
- `GET /api/github?list=true` - List all repos

---

## 🎨 How Projects Appear on Site

### Featured Projects (Homepage)
- Shows up to 4 featured projects
- Displayed in a grid layout
- Clickable cards linking to `/work/{id}`

### All Projects (Projects Section)
- All projects appear in projects grid
- Filterable and searchable
- Each card is clickable

### Project Detail Pages
Each project automatically gets a dedicated page:
- Full-screen layout
- Tech stack badges
- Description and features
- Image gallery
- GitHub & Live demo links
- Professional presentation

**URL Pattern:** `/work/1`, `/work/2`, `/work/3`, etc.

---

## 📸 Image Upload Best Practices

1. **Optimize images** before upload (recommended max: 2MB)
2. **Use descriptive names:** `project-screenshot-1.png`
3. **Supported formats:** JPG, PNG, GIF, WebP, SVG
4. **Browse existing images** to avoid duplicates
5. **Main image:** Should be landscape (16:9 or 4:3)
6. **Gallery images:** Can be any orientation

---

## 🔐 Security Notes

1. **Admin panel is protected** by authentication
2. **Cookies expire** after 24 hours
3. **All endpoints require authentication**
4. **File uploads are validated** (images only)
5. **No sensitive data** in frontend code

**Production Security Checklist:**
- [ ] Change default admin credentials
- [ ] Use HTTPS in production
- [ ] Enable CORS only for your domain
- [ ] Set strong admin password
- [ ] Regular backups of JSON files

---

## 🚀 Deployment Notes

### Environment Variables Required:
```env
# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# APIs
GITHUB_USERNAME=your-github-username
CLICKUP_API_KEY=your-clickup-api-key
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
```

### Docker Deployment:
1. Copy `.env` file to server
2. Run `docker-compose up -d`
3. Access admin at `https://yourdomain.com/admin`

### Data Backup:
```bash
# Backup all admin data
tar -czf admin-data-backup.tar.gz app/api/admin/data/

# Restore
tar -xzf admin-data-backup.tar.gz
```

---

## 🎯 Quick Start Workflow

### First Time Setup:
1. **Login** to admin panel
2. **Go to Settings** tab
3. Click **"Load Workspaces"** → Select your ClickUp workspace
4. Click **"Load Repositories"** → Select repos to display
5. Click **"💾 Save Settings"**
6. **Go to Projects** tab
7. Add/edit your projects
8. **Feature** your best 4 projects
9. **Go to Timeline** tab
10. Add your work history

### Regular Updates:
1. **Login** to admin panel
2. **Add new projects** as you complete them
3. **Update timeline** when changing jobs
4. **Feature/unfeature** projects as needed
5. **Upload new images** for project galleries

---

## 🆘 Troubleshooting

### "Not authenticated" error
- **Solution:** Login again at `/admin`
- Cookies may have expired

### Changes not appearing
- **Solution:** Hard refresh browser (Ctrl+Shift+R)
- Cache may need clearing

### Images not uploading
- **Solution:** Check file size (<10MB) and format
- Ensure file is an image type

### ClickUp/GitHub not loading
- **Solution:** Check API keys in `.env`
- Verify internet connection
- Check API rate limits

### Projects not clickable
- **Solution:** Ensure project has valid `id` field
- Check `/work/{id}` URL works
- Verify `projects.json` is valid JSON

---

## 📚 Additional Resources

- **Project Detail Template:** `/app/work/[id]/page.tsx`
- **Admin Panel Code:** `/app/admin/page.tsx`
- **Admin Server:** `/admin-server/server.js`
- **Docker Guide:** `DOCKER_DEPLOYMENT.md`

---

**🎉 Your admin panel is now fully functional and ready for production use!**
