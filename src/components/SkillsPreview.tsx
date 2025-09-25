import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface Skill {
  name: string;
  level: number;
  color: string;
  logo: string;
  category: string;
}

const skills: Skill[] = [
  // Programming Languages - Blue/Purple/Yellow theme
  { name: 'JavaScript', level: 70, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/javascript.png', category: 'Programming' },
  { name: 'TypeScript', level: 60, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/typescript.png', category: 'Programming' },
  { name: 'Python', level: 75, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/Python.png', category: 'Programming' },
  { name: 'Java', level: 75, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/Java.png', category: 'Programming' },
  { name: 'C++', level: 75, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/C++ (CPlusPlus).png', category: 'Programming' },
  { name: 'C#', level: 40, color: 'from-primary-blue to-primary-blue-dark', logo: '/ICONS/C# (CSharp).png', category: 'Programming' },
  
  // Frontend
  { name: 'React', level: 65, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/React.png', category: 'Frontend' },
  { name: 'HTML/CSS', level: 75, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/HTML5.png', category: 'Frontend' },
  { name: 'Tailwind CSS', level: 60, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/Tailwind CSS.png', category: 'Frontend' },
  
  // Backend & Database
  { name: 'Node.js', level: 55, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/Node.js.png', category: 'Backend' },
  { name: 'Express.js', level: 50, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/Express.png', category: 'Backend' },
  { name: 'PostgreSQL', level: 65, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/PostgresSQL.png', category: 'Backend' },
  
  // Cloud & DevOps
  { name: 'Azure', level: 40, color: 'from-primary-blue to-primary-blue-dark', logo: 'AZ', category: 'Cloud' },
  { name: 'Docker', level: 35, color: 'from-primary-blue to-primary-blue-dark', logo: '/ICONS/Docker.png', category: 'Cloud' },
  { name: 'Git', level: 70, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/Git.png', category: 'Tools' },
  
  // Networking
  { name: 'Network Fundamentals', level: 65, color: 'from-primary-purple to-primary-purple-dark', logo: 'NET', category: 'Networking' },
  { name: 'Server & Cloud Networking', level: 50, color: 'from-primary-purple to-primary-purple-dark', logo: 'SCN', category: 'Networking' },
  
  // Creative Suite
  { name: 'Photoshop', level: 50, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/Adobe Photoshop.png', category: 'Creative' },
  { name: 'Illustrator', level: 80, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/Adobe Illustrator.png', category: 'Creative' },
  { name: 'After Effects', level: 70, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/After Effects.png', category: 'Creative' },
  { name: 'GIMP', level: 75, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/GIMP.png', category: 'Creative' },
  
  // Office & Productivity
  { name: 'MS Office', level: 98, color: 'from-primary-yellow to-primary-yellow-dark', logo: '/ICONS/icons8-microsoft-office-48.png', category: 'Productivity' },
  { name: 'Microsoft VBA', level: 70, color: 'from-primary-yellow to-primary-yellow-dark', logo: 'VBA', category: 'Productivity' },
  
  // IoT
  { name: 'Raspberry Pi', level: 50, color: 'from-primary-purple to-primary-purple-dark', logo: '/ICONS/Raspberry Pi.png', category: 'IoT' },
];

const categories = ['Programming', 'Frontend', 'Backend', 'Cloud', 'Networking', 'Creative', 'Tools', 'Productivity', 'IoT'];

interface SkillsPreviewProps {
  compact?: boolean;
}

export const SkillsPreview: React.FC<SkillsPreviewProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Function to get the appropriate gradient class based on skill level
  const getSkillGradientClass = (level: number): string => {
    if (level < 50) {
      return 'skill-progress-beginner';
    } else if (level < 70) {
      return 'skill-progress-learning';
    } else {
      return 'skill-progress-comfortable';
    }
  };
  if (compact) {
    return (
      <div className="space-y-3 font-mono">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className={`rounded border p-3 card-bg ${
              isDark 
                ? 'bg-black/60 border-terminal-border/50' 
                : 'bg-white/80 border-light-border/50'
            }`}
          >
            <h3 className={`text-sm font-bold mb-3 border-b pb-1 ${
              isDark 
                ? 'text-primary-purple border-terminal-border/30' 
                : 'text-primary-blue border-light-border/30'
            }`}>
              {category.toUpperCase()}
            </h3>
            
            <div className="space-y-2">
              {skills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.03) }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-6 flex items-center justify-center rounded ${
                        isDark ? 'bg-primary-blue/20' : 'bg-primary-blue/10'
                      }`}>
                        {skill.logo.startsWith('/ICONS/') ? (
                          <img 
                            src={skill.logo} 
                            alt={skill.name} 
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <span className="text-primary-blue text-xs text-center">
                            {skill.logo}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${
                        isDark ? 'text-primary-blue' : 'text-light-text'
                      }`}>{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-16 rounded-full h-1.5 overflow-hidden ${
                        isDark ? 'bg-black/40' : 'bg-gray-200'
                      }`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ 
                            delay: (categoryIndex * 0.1) + (index * 0.03) + 0.2,
                            duration: 1,
                            ease: "easeOut"
                          }}
                          className={`h-full ${getSkillGradientClass(skill.level)}`}
                        />
                      </div>
                      <span className={`text-xs w-8 text-right ${
                        isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
                      }`}>{skill.level}%</span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
        
        {/* Terminal-style footer */}
        <div className={`rounded border p-2 ${
          isDark 
            ? 'bg-black/40 border-terminal-border/30' 
            : 'bg-gray-50/80 border-light-border/30'
        }`}>
          <div className={`text-xs ${
            isDark ? 'text-primary-purple' : 'text-primary-blue'
          }`}>
            $ grep -c "skill" /dev/portfolio --level=junior
          </div>
          <div className={`text-xs mt-1 ${
            isDark ? 'text-primary-blue' : 'text-light-text'
          }`}>
            {skills.length} skills found across {categories.length} categories
          </div>
          <div className="text-primary-yellow text-xs mt-1">
            ↗ {t('skills.continuousLearning')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary-purple glow-text mb-2">{t('skills.technicalSkills')}</h2>
          <p className="text-primary-blue/70">{t('skills.proficiencyLevels')}</p>
          <div className="mt-3 flex justify-center">
            <div className="inline-flex items-center gap-4 text-xs text-primary-blue/60">
              <span className="text-primary-blue">■ {t('skills.levels.beginner')}</span>
              <span className="text-primary-purple">■ {t('skills.levels.learning')}</span>
              <span className="text-primary-yellow">■ {t('skills.levels.comfortable')}</span>
            </div>
          </div>
        </div>

        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-primary-blue glow-text border-b border-primary-blue/30 pb-2">
              {category}
            </h3>
            
            <div className="space-y-3">
              {skills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary-blue/20 rounded">
                          {skill.logo.startsWith('/ICONS/') ? (
                            <img 
                              src={skill.logo} 
                              alt={skill.name} 
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-primary-blue text-sm text-center">
                              {skill.logo}
                            </span>
                          )}
                        </div>
                        <span className={`font-mono font-medium ${
                          isDark ? 'text-white' : 'text-light-text'
                        }`}>{skill.name}</span>
                        <span className={`text-xs ${skill.level >= 70 ? 'text-primary-yellow' : skill.level >= 50 ? 'text-primary-purple' : 'text-primary-blue'}`}>
                          ■
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-blue font-mono text-sm">{skill.level}%</span>
                        {skill.level < 70 && (
                          <span className="text-xs text-primary-yellow">↗</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ 
                          delay: (categoryIndex * 0.1) + (index * 0.05) + 0.2,
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                        className={`h-full ${getSkillGradientClass(skill.level)} shadow-lg transition-all duration-300 group-hover:shadow-glow`}
                      />
                      {/* Milestone markers */}
                      <div className="absolute inset-0 flex items-center">
                        <div className="absolute left-[50%] w-0.5 h-full bg-white/30"></div>
                        <div className="absolute left-[70%] w-0.5 h-full bg-primary-purple/50"></div>
                      </div>
                    </div>
                    {skill.level < 70 && (
                      <div className="text-xs text-primary-blue/60 mt-1 font-mono">
                        {skill.level < 50 ? t('skills.status.learningFundamentals') : t('skills.status.developingExperience')}
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-black/30 border border-primary-blue/20 rounded-lg"
        >
          <div className="text-center space-y-2">
            <p className="text-primary-blue/70 text-sm font-mono">
              {t('skills.juniorDeveloper')}
            </p>
            <p className="text-primary-purple/60 text-xs font-mono italic">
              {t('skills.quote')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};