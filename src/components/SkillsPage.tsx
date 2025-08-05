import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from './Terminal';
import { SkillsPreview } from './SkillsPreview';

export const SkillsPage: React.FC = () => {
  const [previewData, setPreviewData] = useState<any>(null);

  const handlePreviewUpdate = (data: any) => {
    setPreviewData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-terminal-green glow-text mb-4">
            Technical Skills
          </h1>
          <p className="text-terminal-cyan/70 text-lg">
            Explore my technical expertise through an interactive experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 h-[80vh]">
          {/* Skills Preview Panel - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-terminal-border rounded-lg overflow-hidden"
          >
            <div className="h-full">
              <div className="p-4 border-b border-terminal-border bg-black/20">
                <h2 className="text-xl font-bold text-terminal-cyan glow-text flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Skills Overview
                </h2>
              </div>
              <div className="h-full overflow-y-auto">
                <SkillsPreview />
              </div>
            </div>
          </motion.div>

          {/* Terminal Panel - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-md border border-terminal-border rounded-lg overflow-hidden"
          >
            <div className="h-full">
              <div className="p-4 border-b border-terminal-border bg-black/20">
                <h2 className="text-xl font-bold text-terminal-green glow-text flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Interactive Terminal
                </h2>
              </div>
              <div className="h-full">
                <Terminal 
                  onPreviewUpdate={handlePreviewUpdate}
                  command=""
                  isFullScreen={false}
                  isTerminalPage={false}
                  hideTerminal={false}
                  onNavigate={(section) => {
                    // Navigate using window location for skills page
                    window.location.href = `${window.location.origin}#${section}`;
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-terminal-cyan/60 text-sm">
            💡 Try typing commands like <code className="bg-black/50 px-2 py-1 rounded text-terminal-cyan">skills</code>, <code className="bg-black/50 px-2 py-1 rounded text-terminal-cyan">about</code>, or <code className="bg-black/50 px-2 py-1 rounded text-terminal-cyan">projects</code> in the terminal
          </p>
        </motion.div>
      </div>
    </div>
  );
};