const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Preview server running on port ${port}`);
}); 