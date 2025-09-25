import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  getNodeAtPath, 
  getPathString, 
  resolvePath, 
  getAvailableCommands,
  getSuggestedCommands
} from '../utils/terminalFileSystem';
import { useTheme } from '../contexts/ThemeContext';

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

export const EnhancedTerminal: React.FC<TerminalProps> = ({
  onPreviewUpdate,
  onNavigate
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  // Core state
  const [currentCommand, setCurrentCommand] = useState('');
  const [output, setOutput] = useState<Array<{ id: string; content: React.ReactNode; timestamp: Date }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabCompletionIndex, setTabCompletionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Get dynamic commands and suggestions based on current path
  const availableCommands = getAvailableCommands(currentPath);
  const quickCommands = getSuggestedCommands(currentPath);
  const currentLocation = getPathString(currentPath);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Update suggestions based on current input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCommand.trim().length > 0) {
        const trimmedInput = currentCommand.toLowerCase().trim();
        let filtered: string[] = [];
        
        // Handle cd command with directory suggestions
        if (trimmedInput.startsWith('cd ')) {
          const cdArg = trimmedInput.substring(3);
          const currentNode = getNodeAtPath(currentPath);
          
          if (currentNode && currentNode.children) {
            // Get directories in current path
            const directories = Object.keys(currentNode.children)
              .filter(name => currentNode.children![name].type === 'directory')
              .filter(name => name.toLowerCase().startsWith(cdArg))
              .map(name => `cd ${name}`);
            
            // Add special cd commands
            const specialCdCommands = ['cd ..', 'cd ~'].filter(cmd => 
              cmd.toLowerCase().startsWith(trimmedInput)
            );
            
            filtered = [...directories, ...specialCdCommands];
          } else {
            // If not in a directory, just show special cd commands
            filtered = ['cd ..', 'cd ~'].filter(cmd => 
              cmd.toLowerCase().startsWith(trimmedInput)
            );
          }
        } 
        // Handle cat/open commands with file suggestions
        else if (trimmedInput.startsWith('cat ') || trimmedInput.startsWith('open ')) {
          const cmdType = trimmedInput.startsWith('cat ') ? 'cat' : 'open';
          const fileArg = trimmedInput.substring(cmdType.length + 1);
          const currentNode = getNodeAtPath(currentPath);
          
          if (currentNode && currentNode.children) {
            const files = Object.keys(currentNode.children)
              .filter(name => currentNode.children![name].type === 'file')
              .filter(name => name.toLowerCase().startsWith(fileArg))
              .map(name => `${cmdType} ${name}`);
            
            filtered = files;
          }
        }
        // Default command matching
        else {
          filtered = availableCommands.filter(cmd => 
            cmd.toLowerCase().startsWith(trimmedInput)
          );
        }
        
        setSuggestions(filtered.slice(0, 8));
        setTabCompletionIndex(0);
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentCommand, availableCommands, currentPath]);

  // Add to output function
  const addToOutput = useCallback((content: React.ReactNode, command?: string) => {
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
        command: command,
        timestamp: new Date().toLocaleTimeString(),
        currentPath: currentLocation
      });
    }
  }, [onPreviewUpdate, currentLocation]);

  // Execute command
  const executeCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;

    const trimmedCmd = cmd.trim();
    const parts = trimmedCmd.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    // Add command to output with current location
    addToOutput(
      <div className="flex items-center gap-2 text-terminal-cyan/80 mb-2">
        <span className="text-terminal-green">{currentLocation}</span>
        <span className="text-terminal-cyan">$</span>
        <span>{cmd}</span>
      </div>,
      baseCmd
    );

    // Execute based on command
    switch (baseCmd) {
      case 'clear':
        setOutput([]);
        if (onPreviewUpdate) {
          onPreviewUpdate({ type: 'clear' });
        }
        break;

      case 'pwd':
        addToOutput(
          <div className="text-terminal-cyan">{currentLocation}</div>,
          baseCmd
        );
        break;

      case 'ls':
      case 'dir':
        const currentNode = getNodeAtPath(currentPath);
        if (currentNode && currentNode.children) {
          const items = Object.entries(currentNode.children).map(([name, node]) => ({
            name,
            type: node.type,
            description: node.description || node.preview || ''
          }));
          
          addToOutput(
            <div className="space-y-1 text-terminal-cyan">
              {items.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className={item.type === 'directory' ? 'text-blue-400' : 'text-terminal-green'}>
                    {item.type === 'directory' ? '📁' : '📄'}
                  </span>
                  <span className={item.type === 'directory' ? 'text-blue-400 font-semibold' : 'text-terminal-green'}>
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="text-terminal-cyan/60 text-xs">- {item.description}</span>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-terminal-cyan/60">Directory is empty</div>
              )}
            </div>,
            baseCmd
          );
        } else {
          addToOutput(
            <div className="text-terminal-cyan/60">Current location is not a directory</div>,
            baseCmd
          );
        }
        break;

      case 'cd':
        if (!args) {
          setCurrentPath([]);
          addToOutput(
            <div className="text-terminal-green">Changed directory to: ~</div>
          );
        } else {
          const newPath = resolvePath(currentPath, args);
          const targetNode = getNodeAtPath(newPath);
          
          if (targetNode && (newPath.length === 0 || targetNode.type === 'directory')) {
            setCurrentPath(newPath);
            addToOutput(
              <div className="text-terminal-green">
                Changed directory to: {getPathString(newPath)}
              </div>
            );
            
            // Navigate to the corresponding page if it's a main section
            if (newPath.length === 1 && onNavigate) {
              const section = newPath[0];
              if (['projects', 'skills', 'contact'].includes(section)) {
                setTimeout(() => onNavigate(section), 500); // Small delay for smooth transition
              }
            }
          } else {
            addToOutput(
              <div className="text-red-400">
                cd: {args}: No such directory
              </div>
            );
          }
        }
        break;

      case 'cat':
      case 'open':
        if (!args) {
          addToOutput(
            <div className="text-red-400">{baseCmd}: missing file argument</div>
          );
        } else {
          const filePath = resolvePath(currentPath, args);
          const fileNode = getNodeAtPath(filePath);
          
          if (fileNode && fileNode.type === 'file') {
            if (baseCmd === 'open' && fileNode.link) {
              window.open(fileNode.link, '_blank');
              addToOutput(
                <div className="text-terminal-green">
                  Opening {fileNode.name} in new tab...
                </div>
              );
            } else if (fileNode.content) {
              addToOutput(
                <div className="space-y-2">
                  <div className="text-terminal-cyan font-bold">
                    📄 {fileNode.name}
                  </div>
                  <div className="text-terminal-green/90 whitespace-pre-wrap pl-4">
                    {fileNode.content}
                  </div>
                </div>
              );
            }
          } else {
            addToOutput(
              <div className="text-red-400">
                {baseCmd}: {args}: No such file
              </div>
            );
          }
        }
        break;

      case 'help':
        addToOutput(
          <div className="space-y-2 text-terminal-cyan">
            <div className="text-terminal-cyan font-bold">❓ Available Commands:</div>
            <div className="pl-4 space-y-1 text-sm">
              <div>• <span className="text-terminal-yellow">cd [path]</span> - Change directory</div>
              <div>• <span className="text-terminal-yellow">ls / dir</span> - List directory contents</div>
              <div>• <span className="text-terminal-yellow">pwd</span> - Print working directory</div>
              <div>• <span className="text-terminal-yellow">cat [file]</span> - Display file contents</div>
              <div>• <span className="text-terminal-yellow">open [file]</span> - Open link in new tab</div>
              <div>• <span className="text-terminal-yellow">clear</span> - Clear terminal output</div>
              <div>• <span className="text-terminal-yellow">help</span> - Show this help message</div>
            </div>
            <div className="text-terminal-green text-xs mt-2">
              💡 Tips:
              <div className="pl-4">
                • Use Tab for auto-completion
                • Use ↑/↓ arrows for command history
                • Type 'cd ..' to go back
                • Type 'cd ~' to go home
              </div>
            </div>
          </div>,
          baseCmd
        );
        break;

      default:
        // Handle bare section commands (projects, skills, contact)
        const legacyCmd = trimmedCmd.toLowerCase();
        if (legacyCmd === 'projects') {
          // Change to projects directory and show content
          setCurrentPath(['projects']);
          const projectsNode = getNodeAtPath(['projects']);
          if (projectsNode && projectsNode.children) {
            const items = Object.entries(projectsNode.children);
            addToOutput(
              <div className="space-y-3">
                <div className="text-terminal-green">Changed directory to: ~/projects</div>
                <div className="text-terminal-cyan font-bold text-lg flex items-center gap-2 mt-3">
                  <span>🚀</span> Projects Portfolio
                </div>
                <div className="space-y-2">
                  {items.map(([name, node]: [string, any]) => (
                    <div key={name} className="bg-terminal-green/10 rounded p-3 border border-terminal-green/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-terminal-green font-bold">{name}</span>
                        {node.link && <span className="text-xs text-terminal-cyan">(🔗 Live Demo)</span>}
                      </div>
                      {node.preview && (
                        <div className="text-terminal-cyan/80 text-sm mb-2">{node.preview}</div>
                      )}
                      {node.description && (
                        <div className="text-terminal-cyan/60 text-xs">{node.description}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-terminal-green/70 text-xs mt-2">
                  💡 Use 'ls' to list files or 'open [project-name]' to view demos
                </div>
              </div>,
              'projects'
            );
          }
          // No redirect - only display in terminal
        } else if (legacyCmd === 'skills') {
          // Change to skills directory and show content
          setCurrentPath(['skills']);
          const skillsNode = getNodeAtPath(['skills']);
          if (skillsNode && skillsNode.children) {
            const items = Object.entries(skillsNode.children);
            addToOutput(
              <div className="space-y-3">
                <div className="text-terminal-green">Changed directory to: ~/skills</div>
                <div className="text-terminal-cyan font-bold text-lg flex items-center gap-2 mt-3">
                  <span>⚡</span> Technical Skills
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(([name, node]: [string, any]) => (
                    <div key={name} className="bg-blue-500/10 rounded p-2 border border-blue-500/30">
                      <div className="text-blue-400 font-bold text-sm">{name}</div>
                      {node.preview && (
                        <div className="text-terminal-cyan/70 text-xs">{node.preview}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-terminal-green/70 text-xs mt-2">
                  💡 Use 'ls' to list files or 'cat [skill-category]' for details
                </div>
              </div>,
              'skills'
            );
          }
          // No redirect - only display in terminal
        } else if (legacyCmd === 'contact') {
          // Change to contact directory and show content
          setCurrentPath(['contact']);
          const contactNode = getNodeAtPath(['contact']);
          if (contactNode && contactNode.children) {
            const items = Object.entries(contactNode.children);
            addToOutput(
              <div className="space-y-3">
                <div className="text-terminal-green">Changed directory to: ~/contact</div>
                <div className="text-terminal-cyan font-bold text-lg flex items-center gap-2 mt-3">
                  <span>📧</span> Contact Information
                </div>
                <div className="space-y-2">
                  {items.map(([name, node]: [string, any]) => (
                    <div key={name} className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold text-sm">{name}</span>
                        {node.link && <span className="text-xs text-terminal-green">(🔗 Link)</span>}
                      </div>
                      {node.preview && (
                        <div className="text-terminal-cyan/70 text-xs">{node.preview}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-terminal-green/70 text-xs mt-2">
                  💡 Use 'ls' to list files or 'open [contact-method]' to connect
                </div>
              </div>,
              'contact'
            );
          }
          // No redirect - only display in terminal
        } else {
          addToOutput(
            <div className="text-red-400">
              Command not found: {cmd}. Type 'help' for available commands.
            </div>,
            baseCmd
          );
        }
    }
  }, [currentPath, currentLocation, addToOutput, onNavigate, onPreviewUpdate]);

  // Key handler with tab completion and history
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const suggestion = suggestions[tabCompletionIndex % suggestions.length];
        setCurrentCommand(suggestion);
        setTabCompletionIndex(prev => (prev + 1) % suggestions.length);
        
        // Clear suggestions after completion to avoid confusion
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  }, [currentCommand, suggestions, tabCompletionIndex, commandHistory, historyIndex, executeCommand]);

  // Quick command execution
  const executeQuickCommand = useCallback((cmd: string) => {
    executeCommand(cmd);
    setCurrentCommand('');
  }, [executeCommand]);

  // Return enhanced terminal component
  return (
    <div className={`relative border-2 rounded-lg font-mono text-xs sm:text-sm overflow-hidden flex flex-col h-full terminal-bg ${
      isDark 
        ? 'bg-black/90 border-terminal-cyan/50' 
        : 'bg-white/95 border-primary-blue/30'
    }`}>
      {/* Terminal Header */}
      <div className={`px-3 sm:px-4 py-2 border-b flex items-center justify-between terminal-header ${
        isDark 
          ? 'bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 border-terminal-cyan/30' 
          : 'bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 border-primary-blue/20'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className={`text-xs font-bold ml-2 ${
            isDark ? 'text-terminal-cyan/80' : 'text-light-text'
          }`}>
            Portfolio Terminal
          </span>
        </div>
        <span className={`text-xs hidden sm:block ${
          isDark ? 'text-terminal-cyan/60' : 'text-light-text-muted'
        }`}>
          {currentLocation}
        </span>
      </div>

      {/* Terminal Output Area */}
      <div ref={outputRef} className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-[200px]">
        {output.length === 0 ? (
          <div className={isDark ? 'text-terminal-cyan/70' : 'text-light-text-secondary'}>
            <div className={`font-bold mb-2 ${
              isDark ? 'text-terminal-cyan' : 'text-light-text'
            }`}>{t('terminal.welcome')}</div>
            <div className="text-xs sm:text-sm space-y-1">
              <div>Type <span className={isDark ? 'text-terminal-yellow' : 'text-primary-blue font-semibold'}>help</span> to see available commands</div>
              <div>Navigate with <span className={isDark ? 'text-terminal-yellow' : 'text-primary-blue font-semibold'}>cd</span> command</div>
              <div>Use <span className={isDark ? 'text-terminal-yellow' : 'text-primary-blue font-semibold'}>ls</span> to explore directories</div>
              <div className={`mt-2 ${
                isDark ? 'text-terminal-green/70' : 'text-primary-purple'
              }`}>Quick tip: Press Tab for auto-completion!</div>
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

      {/* Terminal Input with Current Location */}
      <div className={`px-3 sm:px-4 py-2 border-t ${
        isDark 
          ? 'bg-black/70 border-terminal-cyan/30' 
          : 'bg-gray-50/70 border-primary-blue/20'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-xs sm:text-sm px-2 py-1 rounded border ${
            isDark 
              ? 'text-terminal-green bg-terminal-green/10 border-terminal-green/30' 
              : 'text-primary-blue bg-primary-blue/10 border-primary-blue/30'
          }`}>{currentLocation}</span>
          <span className={`font-bold ${
            isDark ? 'text-terminal-cyan' : 'text-primary-blue'
          }`}>$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent outline-none text-xs sm:text-sm font-mono ${
                isDark 
                  ? 'text-terminal-cyan placeholder-terminal-cyan/50' 
                  : 'text-light-text placeholder-light-text-muted'
              }`}
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <span className={`animate-pulse text-lg ${
            isDark ? 'text-terminal-cyan' : 'text-primary-blue'
          }`}>▋</span>
        </div>
      </div>

      {/* Auto-suggestions - Below Input */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 sm:px-4 py-2 bg-terminal-cyan/5 border-t border-terminal-cyan/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-terminal-cyan/60 text-xs">Tab to complete:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setCurrentCommand(suggestion);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  className={`px-2 py-1 border rounded text-xs font-mono transition-all duration-200 hover:scale-105 ${
                    index === tabCompletionIndex % suggestions.length
                      ? 'bg-terminal-green/30 border-terminal-green/50 text-terminal-green'
                      : 'bg-terminal-green/10 hover:bg-terminal-green/20 border-terminal-green/30 text-terminal-green'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context-Aware Quick Command Buttons */}
      <div className="p-3 sm:p-4 bg-black/30 border-t border-terminal-cyan/20">
        <div className="text-terminal-cyan/60 text-xs mb-2">Quick Commands:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {quickCommands.map((cmd) => (
            <button
              key={cmd.cmd}
              onClick={() => executeQuickCommand(cmd.cmd)}
              className="flex items-center gap-1.5 p-1.5 sm:p-2 bg-terminal-cyan/10 hover:bg-terminal-cyan/20 border border-terminal-cyan/30 rounded text-xs text-terminal-cyan transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-sm">{cmd.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-bold truncate">{cmd.cmd}</div>
                <div className="text-terminal-cyan/70 text-[10px] sm:text-xs truncate">{cmd.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
