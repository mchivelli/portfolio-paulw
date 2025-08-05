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
        terminal: {
          cyan: '#00f7ff',
          green: '#00ff00',
          bg: '#0f0f0f',
          border: '#1a1a1a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          'from': { textShadow: '0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff' },
          'to': { textShadow: '0 0 20px #00f7ff, 0 0 30px #00f7ff, 0 0 40px #00f7ff' }
        }
      }
    },
  },
  plugins: [],
} 