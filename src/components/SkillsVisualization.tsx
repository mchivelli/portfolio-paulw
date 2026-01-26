import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { skillsData, type Skill, type SkillCategory } from '../data/skills';

interface SkillsVisualizationProps {
  onSkillClick?: (skill: Skill) => void;
}

const SkillCard: React.FC<{ skill: Skill; index: number; isSelected: boolean; onClick: () => void }> = ({ 
  skill, 
  index, 
  isSelected, 
  onClick 
}) => {
  const { t } = useTranslation();
  
  const getLevelColor = (level: number): string => {
    if (level >= 90) return 'from-emerald-500 to-green-500';
    if (level >= 80) return 'from-blue-500 to-cyan-500';
    if (level >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  const getLevelText = (level: number): string => {
    if (level >= 90) return t('skillsVisualization.levels.expert');
    if (level >= 80) return t('skillsVisualization.levels.advanced');
    if (level >= 70) return t('skillsVisualization.levels.intermediate');
    return t('skillsVisualization.levels.learning');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-terminal-cyan/20 to-blue-500/20 border-terminal-cyan/50 shadow-lg shadow-terminal-cyan/25' 
          : 'bg-black/40 border-gray-700/50 hover:border-terminal-cyan/30 hover:bg-black/60'
        }
      `}
    >
      {/* Skill Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{skill.icon}</div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">{skill.name}</h4>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getLevelColor(skill.level)} text-white font-medium`}>
              {getLevelText(skill.level)}
            </span>
            <span className="text-gray-400">{skill.yearsOfExperience} {t('skillsVisualization.experience')}</span>
          </div>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="relative w-16 h-16 mx-auto mb-3">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(skill.level / 100) * 175.93} 175.93`}
            initial={{ strokeDasharray: "0 175.93" }}
            animate={{ strokeDasharray: `${(skill.level / 100) * 175.93} 175.93` }}
            transition={{ duration: 1.5, delay: index * 0.1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-terminal-cyan font-bold text-sm">{skill.level}%</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-xs text-center leading-relaxed">
        {skill.description}
      </p>

      {/* Projects Badge */}
      {skill.projects && skill.projects.length > 0 && (
        <div className="mt-3 flex justify-center">
          <span className="px-2 py-1 bg-terminal-green/20 text-terminal-green text-xs rounded-full border border-terminal-green/30">
            {skill.projects.length} {t('skillsVisualization.projects')}
          </span>
        </div>
      )}

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-terminal-cyan/10 to-blue-500/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const CategorySection: React.FC<{ 
  category: SkillCategory; 
  index: number;
  selectedSkill: Skill | null;
  onSkillClick: (skill: Skill) => void;
}> = ({ category, index, selectedSkill, onSkillClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="mb-8"
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">{category.icon}</div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.name}
          </h3>
          <p className="text-gray-400 text-sm">{category.description}</p>
        </div>
        <div className="text-terminal-cyan/60 text-sm font-mono">
          {category.skills.length} skills
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.skills.map((skill, skillIndex) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            index={skillIndex}
            isSelected={selectedSkill?.name === skill.name}
            onClick={() => onSkillClick(skill)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const SkillDetailPanel: React.FC<{ skill: Skill; onClose: () => void }> = ({ skill, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 top-4 bottom-4 w-80 bg-black/90 border border-terminal-cyan/50 rounded-xl p-6 backdrop-blur-xl z-50"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{skill.icon}</span>
            <h3 className="text-white font-bold text-lg">{skill.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Level and Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Level</span>
            <span className="text-terminal-cyan font-bold">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-terminal-cyan to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-300">{t('skillsVisualization.experience')}</span>
            <span className="text-terminal-green font-semibold">{skill.yearsOfExperience} {t('skillsVisualization.experience')}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-2">{t('skillsVisualization.about')}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{skill.description}</p>
        </div>

        {/* Projects */}
        {skill.projects && skill.projects.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">{t('skillsVisualization.usedIn')}</h4>
            <div className="space-y-2">
              {skill.projects.map((project, index) => (
                <motion.div
                  key={project}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-2 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green text-sm"
                >
                  {project}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({ onSkillClick }) => {
  const { t } = useTranslation();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(selectedSkill?.name === skill.name ? null : skill);
    onSkillClick?.(skill);
  };

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('skillsVisualization.title')}
          <span className="ml-2 text-terminal-cyan">⚡</span>
        </h2>
        <p className="text-gray-400">
          {t('skillsVisualization.subtitle')}
        </p>
      </motion.div>

      {/* Skills Categories */}
      <div className="space-y-8">
        {skillsData.map((category, index) => (
          <CategorySection
            key={category.name}
            category={category}
            index={index}
            selectedSkill={selectedSkill}
            onSkillClick={handleSkillClick}
          />
        ))}
      </div>

      {/* Skill Detail Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailPanel
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-terminal-cyan/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};
