import React from 'react';
import { motion } from 'motion/react';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
}

const skills: Skill[] = [
  { name: 'React', level: 95, icon: '⚛️', color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', level: 90, icon: '🔷', color: 'from-blue-500 to-blue-700' },
  { name: 'Node.js', level: 88, icon: '🟢', color: 'from-green-400 to-green-600' },
  { name: 'Python', level: 85, icon: '🐍', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Docker', level: 82, icon: '🐳', color: 'from-blue-300 to-blue-500' },
  { name: 'AWS', level: 78, icon: '☁️', color: 'from-orange-400 to-orange-600' },
  { name: 'PostgreSQL', level: 80, icon: '🐘', color: 'from-blue-600 to-blue-800' },
  { name: 'Git', level: 92, icon: '📚', color: 'from-red-400 to-red-600' }
];

export const SkillsShowcase: React.FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="md:col-span-2 text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-terminal-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Technical Skills
        </h2>
        <p className="text-terminal-cyan/80">
          Proficiency levels based on years of experience and project complexity
        </p>
      </div>

      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-terminal-border/50 rounded-lg p-6 hover:border-terminal-cyan/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{skill.icon}</span>
              <h3 className="text-lg font-semibold text-terminal-cyan">{skill.name}</h3>
            </div>
            <span className="text-terminal-cyan/80 font-mono">{skill.level}%</span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="mt-3 text-xs text-terminal-cyan/60">
            {skill.level >= 90 ? 'Expert' : 
             skill.level >= 80 ? 'Advanced' : 
             skill.level >= 70 ? 'Intermediate' : 'Beginner'}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};