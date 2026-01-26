import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Home, FolderOpen, Zap, Mail, Terminal } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onTerminalFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange, onTerminalFocus }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const navItems = [
    { key: 'about', label: t('nav.about'), icon: Home },
    { key: 'projects', label: t('nav.projects'), icon: FolderOpen },
    { key: 'skills', label: t('nav.skills'), icon: Zap },
    { key: 'contact', label: t('nav.contact'), icon: Mail },
    { key: 'terminal', label: t('nav.terminal'), icon: Terminal }
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 navbar-bg ${
        isDark 
          ? 'bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 border-terminal-border/30' 
          : 'bg-white/95 border-light-border/50'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand - Clickable Home Button */}
          <motion.button 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSectionChange('about')}
            title="Portfolio Paul Wallner"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-blue to-primary-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">PW</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold glow-text ${
                isDark ? 'text-primary-blue' : 'text-primary-blue'
              }`}>{t('nav.brand.name')}</h1>
              <p className={`text-xs font-mono ${
                isDark ? 'text-primary-blue/60' : 'text-light-text-muted'
              }`}>{t('nav.brand.title')}</p>
            </div>
          </motion.button>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
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
                    px-2 sm:px-4 py-2 rounded-lg font-mono text-xs sm:text-sm transition-all duration-300 border flex items-center gap-1 sm:gap-2
                    ${activeSection === item.key || (item.key === 'terminal' && activeSection === 'terminal')
                      ? isDark 
                        ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50 glow-text'
                        : 'bg-primary-blue/10 text-primary-blue border-primary-blue/40 glow-text'
                      : isDark
                        ? 'text-primary-blue/70 hover:text-primary-blue hover:bg-primary-blue/10 border-transparent hover:border-primary-blue/30'
                        : 'text-light-text-secondary hover:text-primary-blue hover:bg-primary-blue/5 border-transparent hover:border-primary-blue/20'
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {IconComponent && <IconComponent size={16} className="sm:w-4 sm:h-4" />}
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Theme and Language Controls */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};