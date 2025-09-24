import React from 'react';
import { motion } from 'motion/react';
import { SkillsVisualization } from './SkillsVisualization';
import { ProjectsVisualization } from './ProjectsVisualization';
import { ContactVisualization } from './ContactVisualization';

interface CommandCenterProps {
  previewData?: any;
  currentPath?: string[];
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ previewData }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black/20 via-black/40 to-black/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 p-3 border-b border-terminal-border">
        <h3 className="text-lg font-bold text-terminal-cyan glow-text flex items-center gap-2">
          <span className="text-xl">🖥️</span>
          Live Output
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Visual GUI Components Based on Command */}
        {previewData?.type === 'skills_visual' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <SkillsVisualization />
          </motion.div>
        ) : previewData?.type === 'projects_visual' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ProjectsVisualization />
          </motion.div>
        ) : previewData?.type === 'contact_visual' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ContactVisualization />
          </motion.div>
        ) : previewData?.type === 'clear' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black/60 rounded-lg border border-terminal-border p-4 flex items-center justify-center min-h-[400px]"
          >
            <div className="text-terminal-cyan/50 italic text-center">
              <div className="text-4xl mb-4">🧹</div>
              <div className="text-xl mb-2">Visual Output Cleared</div>
              <div className="text-sm">Ready for new commands</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-black/60 to-gray-900/40 rounded-2xl border border-terminal-cyan/20 p-8 flex items-center justify-center min-h-[400px]"
          >
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse">🖥️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Visual Output</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Execute commands in the terminal to see beautiful interactive visualizations here
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="px-4 py-2 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-lg text-terminal-cyan">
                  <span className="font-mono">skills</span> → Interactive Skills
                </div>
                <div className="px-4 py-2 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green">
                  <span className="font-mono">projects</span> → Project Gallery
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                  <span className="font-mono">contact</span> → Contact Hub
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
