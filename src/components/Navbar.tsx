import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Home, FolderOpen, Zap, Mail, Terminal } from 'lucide-react';
import logo from '../assets/logoPaulWallner.png';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onTerminalFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange, onTerminalFocus }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Navigation is now handled by StaggeredMenu

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-200 navbar-bg ${isDark
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
            className="flex items-center gap-2 sm:gap-3 cursor-pointer pl-10 sm:pl-14"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSectionChange('about')}
            title="Portfolio Paul Wallner"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={typeof logo === 'string' ? logo : (logo as any).src} alt="PW" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold glow-text ${isDark ? 'text-primary-blue' : 'text-primary-blue'
                }`}>{t('nav.brand.name')}</h1>
              <p className={`text-xs font-mono ${isDark ? 'text-primary-blue/60' : 'text-light-text-muted'
                }`}>{t('nav.brand.title')}</p>
            </div>
          </motion.button>

          {/* Navigation Items are now in StaggeredMenu */}
          <div className="flex items-center gap-1 hidden">
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