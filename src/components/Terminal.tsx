import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface TerminalProps {
  onPreviewUpdate?: (data: any) => void;
  command?: string;
  isFullScreen?: boolean;
  onTerminalInteraction?: () => void;
  onClose?: () => void;
  onCommandExecute?: () => void;
  onNavigate?: (section: string) => void;
  activeSection?: string;
  isTerminalPage?: boolean;
  hideTerminal?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  onPreviewUpdate
}) => {
  const { t } = useTranslation();
  // Core state
  const [currentCommand, setCurrentCommand] = useState('');
  const [output, setOutput] = useState<Array<{ id: string; content: React.ReactNode; timestamp: Date }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simplified for now - remove unused complex functionality
  const availableCommands = ['help', 'clear', 'projects', 'skills', 'contact'];
  const quickCommands = [
    { cmd: 'help', icon: '❓', desc: 'Show available commands' },
    { cmd: 'projects', icon: '📁', desc: 'View projects' }
  ];

  // Removed duplicate function - using the one defined later

  // Update suggestions based on current input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCommand.trim().length > 0) {
        const filtered = availableCommands.filter(cmd => 
          cmd.toLowerCase().startsWith(currentCommand.toLowerCase().trim())
        );
        setSuggestions(filtered.slice(0, 5));
        // setTabCompletionIndex(0); // Removed unused function
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentCommand, availableCommands]);

  // Add to output function
  const addToOutput = (content: React.ReactNode) => {
    const newEntry = {
      id: `output-${Date.now()}-${Math.random()}`,
      content,
      timestamp: new Date()
    };
    setOutput(prev => [...prev, newEntry]);

    // Update preview UI with formatted output
    if (onPreviewUpdate) {
      onPreviewUpdate({
        type: 'command_output',
        content: content,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  // Execute command
  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to output first
    addToOutput(
      <div className="flex items-center gap-2 text-terminal-cyan/80 mb-2">
        <span className="text-terminal-green">~</span>
        <span className="text-terminal-cyan">$</span>
        <span>{cmd}</span>
      </div>
    );

    // Execute based on command
    switch (trimmedCmd) {
      case 'clear':
        setOutput([]);
        if (onPreviewUpdate) {
          onPreviewUpdate({ type: 'clear' });
        }
        break;

      case 'help':
        addToOutput(
          <div className="space-y-2 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">? Available Commands:</div>
            <div className="pl-4 space-y-1 text-sm">
              <div>• <span className="text-terminal-yellow">projects</span> - View all projects</div>
              <div>• <span className="text-terminal-yellow">projects view 1-3</span> - View specific project details</div>
              <div>• <span className="text-terminal-yellow">skills</span> - Technical skills overview</div>
              <div>• <span className="text-terminal-yellow">contact</span> - Contact information</div>
              <div>• <span className="text-terminal-yellow">help</span> - Show this help message</div>
              <div>• <span className="text-terminal-yellow">clear</span> - Clear terminal output</div>
            </div>
            <div className="text-terminal-green text-xs mt-2">
              ◆ Use Tab for auto-completion or click quick buttons below
            </div>
          </div>
        );
        break;

      case 'projects':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">▲ Portfolio Projects</div>
            <div className="pl-4 space-y-2 text-sm">
              <div>1. <span className="text-terminal-yellow">Admin Dashboard</span> - Modern analytics platform</div>
              <div>2. <span className="text-terminal-yellow">E-commerce Platform</span> - Full-stack solution</div>  
              <div>3. <span className="text-terminal-yellow">Task Manager</span> - Productivity application</div>
            </div>
            <div className="text-terminal-green text-xs mt-2">
              ◆ Try: "projects view 1", "projects view 2", "projects view 3"
            </div>
          </div>
        );
        break;

      case 'projects view 1':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">■ Admin Dashboard</div>
            <div className="text-terminal-green text-sm">
              Modern analytics platform with real-time data visualization
            </div>
            <div className="text-sm">
              <div className="text-terminal-yellow">Technologies:</div>
              <div className="pl-4">React, TypeScript, D3.js, Node.js, WebSocket</div>
            </div>
          </div>
        );
        break;

      case 'projects view 2':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">◈ E-commerce Platform</div>
            <div className="text-terminal-green text-sm">
              Full-stack e-commerce solution with payment integration
            </div>
            <div className="text-sm">
              <div className="text-terminal-yellow">Technologies:</div>
              <div className="pl-4">Next.js, Stripe, PostgreSQL, Tailwind CSS</div>
            </div>
          </div>
        );
        break;

      case 'projects view 3':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">✓ Task Manager</div>
            <div className="text-terminal-green text-sm">
              Productivity application with real-time collaboration
            </div>
            <div className="text-sm">
              <div className="text-terminal-yellow">Technologies:</div>
              <div className="pl-4">React, Firebase, Material-UI, WebSocket</div>
            </div>
          </div>
        );
        break;

      case 'skills':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">◆ Technical Skills</div>
            <div className="pl-4 space-y-2 text-sm">
              <div><span className="text-terminal-yellow">Frontend:</span> React, TypeScript, Next.js</div>
              <div><span className="text-terminal-yellow">Backend:</span> Node.js, Python, PostgreSQL</div>
              <div><span className="text-terminal-yellow">DevOps:</span> Docker, AWS, Kubernetes</div>
            </div>
          </div>
        );
        break;

      case 'contact':
        addToOutput(
          <div className="space-y-3 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">@ Contact Information</div>
            <div className="pl-4 space-y-2 text-sm">
              <div><span className="text-terminal-yellow">Email:</span> <span className="text-terminal-green">paul@example.com</span></div>
              <div><span className="text-terminal-yellow">LinkedIn:</span> <span className="text-terminal-green">linkedin.com/in/paulm</span></div>
              <div><span className="text-terminal-yellow">GitHub:</span> <span className="text-terminal-green">github.com/paulm</span></div>
              <div><span className="text-terminal-yellow">Location:</span> <span className="text-terminal-green">Available for remote work</span></div>
            </div>
          </div>
        );
        break;

      default:
        addToOutput(
          <div className="text-red-400">
            Command not found: {cmd}. Type 'help' for available commands.
          </div>
        );
    }
  };

  // Key handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
          setCurrentCommand('');
    }
  };

  // Quick command execution
  const executeQuickCommand = (cmd: string) => {
    setCurrentCommand(cmd);
    executeCommand(cmd);
    setCurrentCommand('');
  };

  // Return enhanced terminal component
    return (
    <div className="bg-black/90 border-2 border-terminal-cyan/50 rounded-lg font-mono text-sm overflow-hidden flex flex-col h-full">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 px-4 py-2 border-b border-terminal-cyan/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-terminal-cyan/80 text-xs font-bold ml-2">
            Portfolio Terminal
          </span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {output.length === 0 ? (
          <div className="text-terminal-cyan/70">
            <div className="text-terminal-cyan font-bold mb-2">{t('terminal.welcome')}</div>
            <div className="text-sm space-y-1">
              <div>Type <span className="text-terminal-yellow">help</span> to see available commands</div>
              <div>Try <span className="text-terminal-yellow">projects</span> to view my work</div>
              <div>Use quick buttons below for instant commands</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
          {output.map((entry) => (
              <div key={entry.id} className="animate-fadeIn">
                {entry.content}
              </div>
              ))}
            </div>
        )}
      </div>

      {/* Terminal Input */}
      <div className="px-4 py-2 bg-black/70 border-t border-terminal-cyan/30">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green font-bold">~</span>
          <span className="text-terminal-cyan">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => {
                setCurrentCommand(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-terminal-cyan outline-none placeholder-terminal-cyan/50"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <span className="text-terminal-cyan animate-pulse">▋</span>
        </div>
      </div>

      {/* Suggestions - Below Input */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-terminal-cyan/5 border-t border-terminal-cyan/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-terminal-cyan/60 text-xs">Suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setCurrentCommand(suggestion);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className="px-2 py-1 bg-terminal-green/10 hover:bg-terminal-green/20 border border-terminal-green/30 rounded text-xs text-terminal-green font-mono transition-all duration-200 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Command Buttons - Below Input */}
      <div className="p-4 bg-black/30 border-t border-terminal-cyan/20">
        <div className="text-terminal-cyan/60 text-xs mb-2">Quick Commands:</div>
        <div className="grid grid-cols-2 gap-2">
          {quickCommands.map((cmd) => (
            <button
              key={cmd.cmd}
              onClick={() => executeQuickCommand(cmd.cmd)}
              className="flex items-center gap-2 p-2 bg-terminal-cyan/10 hover:bg-terminal-cyan/20 border border-terminal-cyan/30 rounded text-xs text-terminal-cyan transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-sm">{cmd.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-bold">{cmd.cmd}</div>
                <div className="text-terminal-cyan/70">{cmd.desc}</div>
          </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};