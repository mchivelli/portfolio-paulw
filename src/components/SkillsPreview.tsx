import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
  color: string;
  logo: string;
  category: string;
}

const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, color: 'from-blue-500 to-cyan-500', logo: '⚛️', category: 'Frontend' },
  { name: 'Next.js', level: 90, color: 'from-gray-700 to-gray-900', logo: '▲', category: 'Frontend' },
  { name: 'TypeScript', level: 90, color: 'from-blue-600 to-blue-800', logo: 'TS', category: 'Frontend' },
  { name: 'Tailwind CSS', level: 85, color: 'from-teal-400 to-blue-500', logo: '🎨', category: 'Frontend' },
  { name: 'Vue.js', level: 80, color: 'from-green-400 to-green-600', logo: 'V', category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', level: 95, color: 'from-green-500 to-green-700', logo: '🟢', category: 'Backend' },
  { name: 'Express.js', level: 90, color: 'from-gray-600 to-gray-800', logo: 'E', category: 'Backend' },
  { name: 'Python', level: 85, color: 'from-yellow-400 to-blue-500', logo: '🐍', category: 'Backend' },
  { name: 'MongoDB', level: 85, color: 'from-green-600 to-green-800', logo: '🍃', category: 'Backend' },
  { name: 'PostgreSQL', level: 90, color: 'from-blue-700 to-blue-900', logo: '🐘', category: 'Backend' },
  
  // DevOps & Cloud
  { name: 'Docker', level: 80, color: 'from-blue-500 to-blue-700', logo: '🐳', category: 'DevOps' },
  { name: 'Kubernetes', level: 75, color: 'from-blue-600 to-purple-600', logo: '⚙️', category: 'DevOps' },
  { name: 'AWS', level: 75, color: 'from-orange-400 to-orange-600', logo: '☁️', category: 'DevOps' },
  { name: 'GitHub Actions', level: 85, color: 'from-gray-700 to-black', logo: '🔄', category: 'DevOps' },
  
  // Blockchain
  { name: 'Solidity', level: 70, color: 'from-gray-600 to-gray-800', logo: '⧫', category: 'Blockchain' },
  { name: 'Web3.js', level: 75, color: 'from-purple-500 to-purple-700', logo: '🌐', category: 'Blockchain' },
];

const categories = ['Frontend', 'Backend', 'DevOps', 'Blockchain'];

export const SkillsPreview: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-terminal-green glow-text mb-2">Technical Skills</h2>
          <p className="text-terminal-cyan/70">Proficiency levels across different technologies</p>
        </div>

        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-terminal-cyan glow-text border-b border-terminal-cyan/30 pb-2">
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
                        <span className="text-2xl">{skill.logo}</span>
                        <span className="font-mono font-medium text-white">{skill.name}</span>
                      </div>
                      <span className="text-terminal-cyan font-mono text-sm">{skill.level}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ 
                          delay: (categoryIndex * 0.1) + (index * 0.05) + 0.2,
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                        className={`h-full bg-gradient-to-r ${skill.color} shadow-lg transition-all duration-300 group-hover:shadow-glow`}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-black/30 border border-terminal-cyan/20 rounded-lg"
        >
          <p className="text-terminal-cyan/70 text-sm text-center">
            🚀 Always learning and exploring new technologies
          </p>
        </motion.div>
      </div>
    </div>
  );
};