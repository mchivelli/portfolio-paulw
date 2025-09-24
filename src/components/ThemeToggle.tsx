import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-12 h-6 rounded-full p-1 transition-all duration-300 border-2
        ${isDark 
          ? 'bg-gray-800 border-primary-blue/30 hover:border-primary-blue/50' 
          : 'bg-blue-100 border-blue-300 hover:border-blue-400'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className={`
          w-4 h-4 rounded-full flex items-center justify-center text-xs
          ${isDark 
            ? 'bg-primary-blue text-white' 
            : 'bg-blue-600 text-white'
          }
        `}
        animate={{
          x: isDark ? 0 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  );
};