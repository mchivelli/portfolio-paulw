/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Blue-Purple-Yellow color scheme
        primary: {
          blue: '#3B82F6',      // Blue 500
          purple: '#8B5CF6',    // Violet 500  
          yellow: '#EAB308',    // Yellow 500
          'blue-light': '#60A5FA',   // Blue 400
          'blue-dark': '#1E40AF',    // Blue 800
          'purple-light': '#A78BFA', // Violet 400
          'purple-dark': '#5B21B6',  // Violet 800
          'yellow-light': '#FDE047', // Yellow 300
          'yellow-dark': '#A16207',  // Yellow 700
        },
        terminal: {
          cyan: '#3B82F6',      // Changed to blue
          green: '#8B5CF6',     // Changed to purple
          bg: '#0f0f0f',
          border: '#1a1a1a',
          yellow: '#EAB308',    // Updated yellow
        },
        // Light mode colors
        light: {
          bg: '#FAFAFA',        // Very light gray
          'bg-secondary': '#F5F5F5', // Light gray
          'bg-card': '#FFFFFF',  // Pure white
          text: '#1F2937',       // Dark gray
          'text-secondary': '#4B5563', // Medium gray
          'text-muted': '#6B7280', // Light gray
          border: '#E5E7EB',     // Very light gray
          'border-hover': '#D1D5DB', // Light gray
          accent: '#3B82F6',     // Blue (same as primary)
          'accent-light': '#DBEAFE', // Very light blue
          'accent-hover': '#2563EB', // Darker blue
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'subtle-glow': 'subtleGlow 2s ease-in-out infinite alternate',
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        subtleGlow: {
          'from': { textShadow: '0 0 5px rgba(59, 130, 246, 0.3)' },
          'to': { textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }
        }
      }
    },
  },
  plugins: [],
}