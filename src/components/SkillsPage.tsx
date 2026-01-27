import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// Removed old Terminal import to prevent conflicts
import { SkillsPreview } from './SkillsPreview';
import { useTheme } from '../contexts/ThemeContext';
import { techStackData } from '../data/techStack';

interface SkillsPageProps {
  compact?: boolean;
  onNavigate?: (view: string) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ compact = false, onNavigate }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  if (compact) {
    return (
      <div className="space-y-4">
        <SkillsPreview compact={true} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-y-auto transition-all duration-300 ${isDark
      ? 'bg-gradient-to-br from-black via-gray-900 to-black'
      : 'gradient-bg'
      }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-header mb-4">
            {t('skills.title')}
          </h1>
          <p className="text-primary-blue/70 text-lg mb-4">
            {t('skills.description')}
          </p>

        </motion.div>

        {/* Single Column Layout with Terminal-style Skills Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`backdrop-blur-md border rounded-lg overflow-hidden shadow-2xl ${isDark
            ? 'bg-black/40 border-terminal-border shadow-terminal-cyan/10'
            : 'bg-white/90 border-light-border shadow-primary-blue/10'
            }`}
        >
          <div className={`p-4 border-b ${isDark
            ? 'bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border-terminal-border'
            : 'bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 border-light-border'
            }`}>
            <h2 className={`text-xl font-bold glow-text ${isDark ? 'text-primary-purple' : 'text-primary-blue'
              }`}>
              {t('skills.overview.title')}
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
              }`}>{t('skills.overview.description')}</p>
          </div>

          <div className="p-6">
            <SkillsPreview compact={false} />
          </div>
        </motion.div>

        {/* Terminal Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`mt-8 backdrop-blur-md border rounded-lg shadow-2xl ${isDark
            ? 'bg-gradient-to-br from-black/40 via-black/60 to-black/40 border-terminal-border shadow-terminal-cyan/10'
            : 'bg-gradient-to-br from-white/90 via-gray-50/90 to-white/90 border-light-border shadow-primary-blue/10'
            }`}
        >
          <div className={`p-4 border-b ${isDark
            ? 'bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border-terminal-border'
            : 'bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 border-light-border'
            }`}>
            <h3 className={`text-lg font-bold glow-text ${isDark ? 'text-primary-purple' : 'text-primary-blue'
              }`}>
              {t('skills.summary.title')}
            </h3>
          </div>
          <div className="p-6">
            <div className={`font-mono ${isDark ? 'text-primary-blue' : 'text-light-text'
              }`}>
              <div className="mb-4">
                <div className={isDark ? 'text-primary-purple' : 'text-primary-blue'}>$ skills --list --all</div>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  {techStackData.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className={isDark ? 'text-primary-blue/80' : 'text-light-text'}>
                        <span className={`font-semibold ${isDark ? 'text-primary-purple' : 'text-primary-blue'
                          }`}>{section.category}:</span>
                      </div>
                      <div className={`text-xs ml-2 space-y-1 ${isDark ? 'text-primary-blue/60' : 'text-light-text-secondary'
                        }`}>
                        {section.skills.map((skill, sIdx) => (
                          <div key={sIdx}>• {skill}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-primary-blue/60 text-sm">
            {t('skills.navigation.explore')}: {' '}
            <button
              onClick={() => onNavigate?.('about')}
              className="bg-black/50 px-2 py-1 rounded text-primary-blue hover:text-primary-purple hover:bg-black/70 transition-colors cursor-pointer"
            >
              {t('navigation.about')}
            </button>, {' '}
            <button
              onClick={() => onNavigate?.('projects')}
              className="bg-black/50 px-2 py-1 rounded text-primary-blue hover:text-primary-purple hover:bg-black/70 transition-colors cursor-pointer"
            >
              {t('navigation.projects')}
            </button>, {' '}
            <button
              onClick={() => onNavigate?.('contact')}
              className="bg-black/50 px-2 py-1 rounded text-primary-blue hover:text-primary-purple hover:bg-black/70 transition-colors cursor-pointer"
            >
              {t('navigation.contact')}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};