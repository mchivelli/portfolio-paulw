import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectsPage } from './ProjectsPage';
import { SkillsPage } from './SkillsPage';
import { ContactPage } from './ContactPage';
import { useTheme } from '../contexts/ThemeContext';

interface CommandCenterProps {
  previewData?: any;
  currentPath?: string[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  color: string;
  action: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ previewData }) => {
  const { isDark } = useTheme();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [lastCommand, setLastCommand] = useState<string>('');

  // Update active view based on terminal commands
  React.useEffect(() => {
    if (previewData?.type === 'command_output') {
      const command = previewData.command?.toLowerCase() || '';
      setLastCommand(command);
      
      if (command === 'projects') {
        setActiveView('projects');
      } else if (command === 'skills') {
        setActiveView('skills');
      } else if (command === 'contact') {
        setActiveView('contact');
      } else if (command === 'ls' || command === 'dir') {
        // Check current path to determine what to show
        const currentPath = previewData.currentPath || '';
        if (currentPath.includes('projects')) {
          setActiveView('projects');
        } else if (currentPath.includes('skills')) {
          setActiveView('skills');
        } else if (currentPath.includes('contact')) {
          setActiveView('contact');
        } else {
          setActiveView('dashboard');
        }
      } else if (command === 'clear') {
        setActiveView('dashboard');
      } else if (command === 'help' || command === 'pwd') {
        // Keep current view for informational commands
      } else {
        // For other commands, show dashboard
        setActiveView('dashboard');
      }
    } else if (previewData?.type === 'projects_visual') {
      setActiveView('projects');
    } else if (previewData?.type === 'skills_visual') {
      setActiveView('skills');
    } else if (previewData?.type === 'contact_visual') {
      setActiveView('contact');
    } else if (previewData?.type === 'clear') {
      setActiveView('dashboard');
    }
  }, [previewData]);

  const quickActions: QuickAction[] = [
    {
      id: 'projects',
      title: 'View Projects',
      description: 'Browse portfolio projects',
      color: 'from-primary-blue to-primary-blue-light',
      action: () => setActiveView('projects')
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      description: 'Explore technical expertise',
      color: 'from-primary-purple to-primary-purple-light',
      action: () => setActiveView('skills')
    },
    {
      id: 'contact',
      title: 'Get in Touch',
      description: 'Connect directly',
      color: 'from-primary-yellow to-primary-yellow-light',
      action: () => setActiveView('contact')
    },
    {
      id: 'resume',
      title: 'Download CV',
      description: 'Get latest resume',
      color: 'from-primary-blue to-primary-purple',
      action: () => window.open('/Paul_Mchivelli_CV.pdf', '_blank')
    }
  ];

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Terminal Status */}
      <div className={`rounded-lg p-4 border font-mono card-bg ${
        isDark 
          ? 'bg-black/60 border-terminal-border' 
          : 'bg-white/80 border-light-border'
      }`}>
        <div className={`text-sm mb-3 font-bold ${
          isDark ? 'text-primary-purple' : 'text-primary-blue'
        }`}>
          Interactive Dashboard
        </div>
        <div className={`text-xs mb-4 ${
          isDark ? 'text-primary-blue/80' : 'text-light-text-secondary'
        }`}>
          Visual extension of terminal commands. Use terminal on the left or click buttons below.
        </div>
        
        {/* Command History */}
        {lastCommand && (
          <div className={`rounded p-2 mb-4 border ${
            isDark 
              ? 'bg-black/40 border-terminal-border/50' 
              : 'bg-gray-50/80 border-light-border/50'
          }`}>
            <div className={`text-xs mb-1 ${
              isDark ? 'text-primary-purple/70' : 'text-light-text-muted'
            }`}>Last Command:</div>
            <div className={`text-sm ${
              isDark ? 'text-primary-blue' : 'text-primary-blue'
            }`}>$ {lastCommand}</div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={action.action}
              className={`bg-gradient-to-br ${action.color} p-3 rounded text-white text-xs font-semibold hover:shadow-lg transition-all duration-300 group`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="font-bold mb-1">{action.title}</div>
              <div className="opacity-90">{action.description}</div>
            </motion.button>
          ))}
        </div>

        {/* System Info */}
        <div className={`mt-4 pt-3 border-t ${
          isDark ? 'border-terminal-border/30' : 'border-light-border/30'
        }`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className={isDark ? 'text-primary-blue/70' : 'text-light-text-muted'}>Status:</span>
              <span className="text-primary-purple">Online</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-primary-blue/70' : 'text-light-text-muted'}>Mode:</span>
              <span className="text-primary-blue">Interactive</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'projects':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className={`mb-3 flex items-center justify-between rounded-lg p-3 border card-bg ${
              isDark 
                ? 'bg-black/60 border-terminal-border' 
                : 'bg-white/80 border-light-border'
            }`}>
              <div className="font-mono">
                <div className={`text-sm font-bold ${
                  isDark ? 'text-primary-purple' : 'text-primary-blue'
                }`}>Projects Gallery</div>
                <div className={`text-xs ${
                  isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
                }`}>Visual representation of terminal output</div>
              </div>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`text-sm font-mono transition-colors ${
                  isDark 
                    ? 'text-primary-blue/70 hover:text-primary-blue' 
                    : 'text-light-text-muted hover:text-primary-blue'
                }`}
              >
                ← Back
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              <ProjectsPage compact={true} />
            </div>
          </motion.div>
        );
      
      case 'skills':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="mb-3 flex items-center justify-between bg-black/60 rounded-lg p-3 border border-terminal-border">
              <div className="font-mono">
                <div className="text-primary-purple text-sm font-bold">Technical Skills</div>
                <div className="text-primary-blue/70 text-xs">Interactive skills visualization</div>
              </div>
              <button
                onClick={() => setActiveView('dashboard')}
                className="text-primary-blue/70 hover:text-primary-blue text-sm font-mono transition-colors"
              >
                ← Back
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              <SkillsPage compact={true} onNavigate={setActiveView} />
            </div>
          </motion.div>
        );
      
      case 'contact':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="mb-3 flex items-center justify-between bg-black/60 rounded-lg p-3 border border-terminal-border">
              <div className="font-mono">
                <div className="text-primary-purple text-sm font-bold">Contact Information</div>
                <div className="text-primary-blue/70 text-xs">Interactive contact interface</div>
              </div>
              <button
                onClick={() => setActiveView('dashboard')}
                className="text-primary-blue/70 hover:text-primary-blue text-sm font-mono transition-colors"
              >
                ← Back
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              <ContactPage compact={true} />
            </div>
          </motion.div>
        );
      
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-black/20 via-black/40 to-black/20' 
        : 'gradient-bg-secondary'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b ${
        isDark 
          ? 'bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border-terminal-border' 
          : 'bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 border-light-border'
      }`}>
        <h3 className={`text-lg font-bold glow-text font-mono ${
          isDark ? 'text-primary-blue' : 'text-primary-blue'
        }`}>
          Interactive Output
        </h3>
        <p className={`text-xs mt-1 font-mono ${
          isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
        }`}>
          Visual extension of terminal commands
        </p>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};
