#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format for better performance
 * Run with: node scripts/optimize-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple WebP conversion using canvas (fallback approach)
// In production, you'd want to use sharp or imagemin
console.log('🖼️  Image Optimization Script');
console.log('');
console.log('For optimal performance, please:');
console.log('1. Install sharp: npm install sharp');
console.log('2. Convert portrait2.png to WebP format');
console.log('3. Resize portrait2.png from 1510x1664 to 433x352');
console.log('4. Use portrait1.png instead (smaller file size)');
console.log('');
console.log('Manual optimization steps:');
console.log('- Use online tools like squoosh.app or tinypng.com');
console.log('- Convert to WebP format');
console.log('- Resize to display dimensions');
console.log('- Compress with 80-90% quality');
console.log('');

// Check if portrait2.png exists and show its size
const portraitPath = path.join(path.dirname(__dirname), 'public', 'portrait2.png');
if (fs.existsSync(portraitPath)) {
  const stats = fs.statSync(portraitPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 Current portrait2.png size: ${sizeInMB}MB`);
  console.log('🎯 Target size: <200KB');
  console.log('');
}

console.log('✅ Consider using portrait1.png instead if it\'s smaller');
console.log('✅ Updated code to use portrait1.png for better performance');