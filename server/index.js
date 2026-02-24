require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const axios = require('axios');
const cheerio = require('cheerio');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Data directory paths
const DATA_DIR = path.join(__dirname, '..', 'app', 'api', 'admin', 'data');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Multer storage configuration
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

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3030', 'http://127.0.0.1:5173', 'http://localhost:4173', 'https://paulwallner.me', 'http://paulwallner.me', 'file://', 'null'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Mailgun configuration
const createMailgunClient = () => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    return null;
  }

  try {
    const mailgun = new Mailgun(formData);
    return mailgun.client({
      username: 'api',
      key: apiKey
    });
  } catch (error) {
    console.error('Mailgun client creation error:', error.message);
    return null;
  }
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log(`📧 Contact form submission from ${req.ip} at ${new Date().toISOString()}`);

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: 'All fields are required',
      required: ['name', 'email', 'subject', 'message']
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Create email content
    const emailContent = `
New contact form submission from Portfolio Website:

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Portfolio Contact Form
Timestamp: ${new Date().toISOString()}
IP: ${req.ip || 'unknown'}
User-Agent: ${req.get('User-Agent') || 'unknown'}
    `;

    // Try to send email via Mailgun if credentials are configured
    const mailgunClient = createMailgunClient();
    const mailgunDomain = process.env.MAILGUN_DOMAIN;

    if (mailgunClient && mailgunDomain) {
      // Determine sender email based on domain type
      const senderEmail = mailgunDomain.includes('sandbox')
        ? `noreply@${mailgunDomain}`
        : `contact@${mailgunDomain}`;

      const senderName = mailgunDomain.includes('sandbox')
        ? 'Portfolio Contact (Sandbox)'
        : 'Paul Wallner - Portfolio';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📬 New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Portfolio Website</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #667eea;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 80px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #e9ecef;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">💬 Message:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #444; font-size: 16px;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Quick Reply:</strong> Just hit reply to respond directly to ${name}
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              📧 Sent from Portfolio Contact Form | 🕒 ${new Date().toLocaleString()}
            </p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #999;">
              IP: ${req.ip || 'unknown'} | User-Agent: ${(req.get('User-Agent') || 'unknown').substring(0, 50)}...
            </p>
          </div>
        </div>
      `;

      const messageData = {
        from: `${senderName} <${senderEmail}>`,
        to: 'paulmallner@gmail.com',
        subject: `🚀 Portfolio Contact: ${subject}`,
        text: emailContent,
        html: htmlContent,
        'h:Reply-To': email,
        'h:X-Mailgun-Variables': JSON.stringify({
          sender_name: name,
          sender_email: email,
          form_type: 'portfolio_contact'
        })
      };

      // Send the main email to you
      const mainEmailResult = await mailgunClient.messages.create(mailgunDomain, messageData);

      // Send confirmation email to the sender
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Message Received!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Paul Wallner - Portfolio</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #28a745;">
              <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 20px;">Thank you for reaching out!</h2>
              <p style="margin: 0; color: #333; line-height: 1.6;">
                Hi <strong>${name}</strong>,<br><br>
                I've received your message and will get back to you as soon as possible, usually within 24 hours.
              </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <h3 style="margin: 0 0 10px 0; color: #007bff;">📋 Your Message Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #555; width: 80px;">Subject:</td>
                  <td style="padding: 5px 0; color: #333;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #555;">Sent:</td>
                  <td style="padding: 5px 0; color: #333;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
              <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 5px;">
                <p style="margin: 0; color: #444; font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
              </div>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>💡 What's next?</strong><br>
                I'll review your message and respond directly to this email address. 
                Feel free to check out my portfolio in the meantime!
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              🚀 Paul Wallner - Full Stack Developer | 📧 Automatic confirmation email
            </p>
          </div>
        </div>
      `;

      const confirmationData = {
        from: `${senderName} <${senderEmail}>`,
        to: email,
        subject: `✅ Message Received - I'll get back to you soon!`,
        text: `Hi ${name},\n\nThank you for reaching out! I've received your message about "${subject}" and will get back to you as soon as possible, usually within 24 hours.\n\nYour message: "${message}"\n\nBest regards,\nPaul Wallner\nFull Stack Developer`,
        html: confirmationHtml
      };

      // Send confirmation email (only if not using sandbox domain)
      let confirmationSent = false;
      if (mailgunDomain.includes('sandbox')) {
        console.log('ℹ️ Skipping confirmation email (sandbox domain - recipient not authorized)');
      } else {
        try {
          await mailgunClient.messages.create(mailgunDomain, confirmationData);
          confirmationSent = true;
          console.log('✅ Confirmation email sent to sender');
        } catch (confirmError) {
          console.error('Failed to send confirmation email:', confirmError.message);
          // Don't fail the main request if confirmation fails
        }
      }

      res.json({
        success: true,
        message: confirmationSent
          ? 'Message sent successfully! I will get back to you soon. Check your email for confirmation.'
          : 'Message sent successfully! I will get back to you soon.',
        method: 'mailgun',
        confirmationSent: confirmationSent
      });

    } else {
      // Fallback to mailto approach
      const mailtoLink = `mailto:paulmallner@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(emailContent)}`;

      res.json({
        success: true,
        message: 'Email client will open with your message pre-filled',
        mailtoLink: mailtoLink,
        method: 'mailto',
        note: 'To enable automatic email sending, configure EMAIL_USER and EMAIL_PASS environment variables'
      });
    }

    // Log the contact attempt
    console.log('✅ Contact form processed:', {
      name,
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      subject,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);

    // Fallback to mailto on any error
    const emailContent = `
New contact form submission from Portfolio:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Portfolio Contact Form
Timestamp: ${new Date().toISOString()}
    `;

    const mailtoLink = `mailto:paulmallner@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(emailContent)}`;

    res.json({
      success: true,
      message: 'Email client will open with your message pre-filled',
      mailtoLink: mailtoLink,
      method: 'mailto-fallback',
      error: 'SMTP failed, using fallback method'
    });
  }
});

// Preview endpoint
app.get('/api/preview', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Check cache first
  const cachedData = cache.get(url);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // Fetch the URL
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract metadata
    const preview = {
      url,
      title: $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        'No title',
      description: $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        'No description available',
      image: $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        null,
      siteName: $('meta[property="og:site_name"]').attr('content') ||
        new URL(url).hostname
    };

    // Cache the result
    cache.set(url, preview);

    res.json(preview);
  } catch (error) {
    console.error('Error fetching preview:', error);
    res.status(500).json({
      error: 'Failed to fetch preview',
      url,
      fallback: {
        title: new URL(url).hostname,
        description: 'Visit link for more information',
        image: null
      }
    });
  }
});

// ==================== ADMIN PANEL ROUTES ====================

// Helper functions for JSON file operations
function readJSON(filename) {
  try {
    const filepath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return filename === 'settings.json' ? { clickup: {}, github: { selectedRepos: [] } } : [];
  }
}

function writeJSON(filename, data) {
  try {
    const filepath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error.message);
    throw error;
  }
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
    const maxId = projects.reduce((max, p) => Math.max(max, p.id || 0), 0);
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

// Settings CRUD
app.get('/api/settings', requireAuth, (req, res) => {
  try {
    const settings = readJSON('settings.json');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.put('/api/settings', requireAuth, (req, res) => {
  try {
    const settings = req.body;
    writeJSON('settings.json', settings);
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
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

// ==================== END ADMIN PANEL ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Preview server running on port ${port}`);
}); 