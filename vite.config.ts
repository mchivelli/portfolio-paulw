import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable aggressive minification
    minify: 'terser',
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries - most stable, cache longest
          'react-vendor': ['react', 'react-dom'],
          // Motion libraries - heavy but stable
          'motion': ['framer-motion', 'motion/react'],
          // UI libraries - medium stability
          'ui-vendor': ['lucide-react', '@radix-ui/react-hover-card'],
          // i18n libraries - stable
          'i18n': ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
          // Utility libraries - very stable
          'utils': ['tailwind-merge', 'clsx', 'qss'],
        },
      },
    },
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable source maps for debugging but exclude from production
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['framer-motion'], // Let it be bundled normally for tree shaking
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false,
  },
})
