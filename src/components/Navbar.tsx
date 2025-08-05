import React from 'react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onTerminalFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange, onTerminalFocus }) => {
  const navItems = [
    { key: 'about', label: 'About', icon: '◆' },
    { key: 'projects', label: 'Projects', icon: '▲' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'contact', label: 'Contact', icon: '●' },
    { key: 'terminal', label: 'Terminal', icon: '❯' }
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-md border-b border-terminal-border/30"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-terminal-cyan to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">PM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-terminal-cyan glow-text">Paul M.</h1>
              <p className="text-xs text-terminal-cyan/60 font-mono">Full Stack Developer</p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                onClick={() => {
                  if (item.key === 'terminal') {
                    onTerminalFocus();
                  } else {
                    onSectionChange(item.key);
                  }
                }}
                className={`
                  px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center gap-2
                  ${activeSection === item.key || (item.key === 'terminal' && activeSection === 'terminal')
                    ? 'bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50 glow-text'
                    : 'text-terminal-cyan/70 hover:text-terminal-cyan hover:bg-terminal-cyan/10 border border-transparent hover:border-terminal-cyan/30'
                  }
                `}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Status Indicator */}
          <motion.div 
            className="flex items-center gap-3 text-xs text-terminal-cyan/60 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Online</span>
            </div>
            <div className="hidden md:block">
              {new Date().toLocaleTimeString()}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};