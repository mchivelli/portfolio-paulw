import React from 'react';
import { motion } from 'motion/react';

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
        {/* Live Terminal Output Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/60 rounded-lg border border-terminal-border p-4 font-mono text-sm min-h-[400px]"
        >
          <div className="text-terminal-green mb-3 flex items-center gap-2">
            <span>🖥️</span>
            Terminal Output
          </div>
          
          {previewData?.type === 'command_output' ? (
            <div className="text-terminal-cyan whitespace-pre-wrap">
              <div className="text-terminal-green/70 text-xs mb-2">
                ⏱ {new Date().toLocaleTimeString()}
              </div>
              <div className="text-terminal-cyan">
                {previewData.content}
              </div>
            </div>
          ) : previewData?.type === 'clear' ? (
            <div className="text-terminal-cyan/50 italic flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-2xl mb-2">🧹</div>
                <div>Terminal cleared</div>
              </div>
            </div>
          ) : (
            <div className="text-terminal-cyan/50 italic flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-2xl mb-2">⏳</div>
                <div>Waiting for command output...</div>
                <div className="text-xs mt-2 text-terminal-green/50">Try typing: projects, skills, contact, ls, help</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
