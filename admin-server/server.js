const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();
const PORT = 3001;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DATA_DIR = path.join(__dirname, '..', 'app', 'api', 'admin', 'data');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueName = `${name}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

app.use(cors({ origin: /http:\/\/localhost:\d+/, credentials: true }));
app.use(express.json());
app.use(cookieParser());

function readJSON(filename) {
  const filepath = path.join(DATA_DIR, filename);
  const data = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data);
}

function writeJSON(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ success: true, message: 'Login successful' });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/auth/check', (req, res) => {
  const token = req.cookies.admin_token;
  if (token) {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out' });
});

// Projects CRUD
app.get('/api/projects', requireAuth, (req, res) => {
  try {
    const projects = readJSON('projects.json');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

app.post('/api/projects', requireAuth, (req, res) => {
  try {
    const newProject = req.body;
    const projects = readJSON('projects.json');
    const maxId = projects.reduce((max, p) => Math.max(max, p.id), 0);
    newProject.id = maxId + 1;
    projects.push(newProject);
    writeJSON('projects.json', projects);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects', requireAuth, (req, res) => {
  try {
    const updatedProject = req.body;
    const projects = readJSON('projects.json');
    const index = projects.findIndex(p => p.id === updatedProject.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projects[index] = updatedProject;
    writeJSON('projects.json', projects);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projects = readJSON('projects.json');
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projects.splice(index, 1);
    writeJSON('projects.json', projects);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Timeline CRUD
app.get('/api/timeline', requireAuth, (req, res) => {
  try {
    const timeline = readJSON('timeline.json');
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read timeline' });
  }
});

app.post('/api/timeline', requireAuth, (req, res) => {
  try {
    const newItem = req.body;
    const timeline = readJSON('timeline.json');
    const maxId = timeline.reduce((max, t) => Math.max(max, t.id || 0), 0);
    newItem.id = maxId + 1;
    timeline.push(newItem);
    writeJSON('timeline.json', timeline);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create timeline item' });
  }
});

app.put('/api/timeline', requireAuth, (req, res) => {
  try {
    const updatedItem = req.body;
    const timeline = readJSON('timeline.json');
    const index = timeline.findIndex(t => t.id === updatedItem.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }
    timeline[index] = updatedItem;
    writeJSON('timeline.json', timeline);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update timeline item' });
  }
});

app.delete('/api/timeline/:id', requireAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const timeline = readJSON('timeline.json');
    const index = timeline.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }
    timeline.splice(index, 1);
    writeJSON('timeline.json', timeline);
    res.json({ message: 'Timeline item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete timeline item' });
  }
});

// Image upload
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const publicPath = `/${req.file.filename}`;
  res.json({ success: true, path: publicPath, filename: req.file.filename });
});

// List uploaded images
app.get('/api/images', requireAuth, (req, res) => {
  try {
    const files = fs.readdirSync(PUBLIC_DIR)
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(f))
      .map(f => ({
        name: f,
        path: `/${f}`,
        size: fs.statSync(path.join(PUBLIC_DIR, f)).size
      }));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Delete uploaded image
app.delete('/api/images/:filename', requireAuth, (req, res) => {
  try {
    const filepath = path.join(PUBLIC_DIR, req.params.filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    fs.unlinkSync(filepath);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

app.listen(PORT, () => {
  console.log(`Admin server running at http://localhost:${PORT}`);
  console.log(`Login with username: ${ADMIN_USERNAME}`);
});
