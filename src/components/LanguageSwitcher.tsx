import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  const languages = [
    { 
      code: 'en', 
      name: 'EN', 
      flag: (
        <svg className="w-4 h-3" viewBox="0 0 640 480">
          <defs>
            <clipPath id="us">
              <path d="M0 0h640v480H0z"/>
            </clipPath>
          </defs>
          <g clipPath="url(#us)">
            <path fill="#bd3d44" d="M0 0h640v37h-640zm0 73h640v37h-640zm0 73h640v37h-640zm0 73h640v37h-640zm0 73h640v37h-640zm0 73h640v37h-640zm0 73h640v37h-640z"/>
            <path fill="#fff" d="M0 37h640v36h-640zm0 73h640v36h-640zm0 73h640v36h-640zm0 73h640v36h-640zm0 73h640v36h-640zm0 73h640v36h-640z"/>
            <path fill="#192f5d" d="M0 0h364v258H0z"/>
          </g>
        </svg>
      )
    },
    { 
      code: 'de', 
      name: 'DE', 
      flag: (
        <svg className="w-4 h-3" viewBox="0 0 640 480">
          <path fill="#ffce00" d="M0 320h640v160H0z"/>
          <path fill="#000" d="M0 0h640v160H0z"/>
          <path fill="#d00" d="M0 160h640v160H0z"/>
        </svg>
      )
    }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className={`flex items-center gap-1 rounded-lg p-1 border ${
      isDark 
        ? 'bg-black/30 border-terminal-border/30' 
        : 'bg-white/30 border-light-border/30'
    }`}>
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`
            px-3 py-1 rounded-md text-sm font-mono transition-all duration-300 flex items-center gap-2
            ${i18n.language === lang.code
              ? isDark 
                ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/50'
                : 'bg-primary-blue/10 text-primary-blue border border-primary-blue/40'
              : isDark
                ? 'text-primary-blue/70 hover:text-primary-blue hover:bg-primary-blue/10'
                : 'text-light-text-secondary hover:text-primary-blue hover:bg-primary-blue/5'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lang.flag}
          <span>{lang.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
