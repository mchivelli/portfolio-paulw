import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  getNodeAtPath, 
  getPathString, 
  resolvePath, 
  getAvailableCommands,
  getSuggestedCommands
} from '../utils/terminalFileSystem';

interface EnhancedTerminalProps {
  onPreviewUpdate?: (data: any) => void;
}

export const EnhancedTerminal: React.FC<EnhancedTerminalProps> = ({ 
  onPreviewUpdate
}) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<React.ReactElement[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tabCompletionIndex, setTabCompletionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Get dynamic commands and suggestions based on current path
  const availableCommands = getAvailableCommands(currentPath);
  const quickCommands = getSuggestedCommands(currentPath);
  const currentLocation = getPathString(currentPath);
  const commandHistory = history;

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
        const filtered = availableCommands.filter(cmd => 
          cmd.toLowerCase().startsWith(currentCommand.toLowerCase().trim())
        );
        setSuggestions(filtered.slice(0, 5));
        setTabCompletionIndex(0);
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentCommand, availableCommands]);

  // Add to output function
  const addToOutput = (content: React.ReactElement) => {
    setOutput(prev => [...prev, content]);

    // Update preview UI with formatted output
    if (onPreviewUpdate) {
      onPreviewUpdate({
        type: 'command_output',
        content: content,
        timestamp: new Date().toLocaleTimeString(),
        currentPath: currentLocation
      });
    }
  };

  // Navigate function placeholder
  const onNavigate = useCallback((newPath: string[]) => {
    setCurrentPath(newPath);
  }, []);

  // Execute command
  const executeCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;

    const trimmedCmd = cmd.trim();
    const parts = trimmedCmd.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    // Add command to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    // Add command to output with current location
    addToOutput(
      <div className="flex items-center gap-2 text-terminal-cyan/80 mb-2">
        <span className="text-terminal-green">{currentLocation}</span>
        <span className="text-terminal-cyan">$</span>
        <span>{cmd}</span>
      </div>
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
          <div className="text-terminal-cyan">{currentLocation}</div>
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
            </div>
          );
        } else {
          addToOutput(
            <div className="text-terminal-cyan/60">Current location is not a directory</div>
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
            if (newPath.length === 1 && onPreviewUpdate) {
              const section = newPath[0];
              if (['projects', 'skills', 'contact'].includes(section)) {
                setTimeout(() => onPreviewUpdate({ type: 'navigate', section }), 500); // Small delay for smooth transition
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
          </div>
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
                  <span>💼</span> {t('projectsVisualization.title')}
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
                  💡 Use 'ls' to list files or 'cat [project-name]' for details
                </div>
                <div className="text-terminal-green text-xs mt-3">
                  ◆ {t('terminal.hints.projects')}
                </div>
              </div>
            );
          }
          
          // Update preview with visual projects display
          if (onPreviewUpdate) {
            onPreviewUpdate({
              type: 'projects_visual',
              content: t('projectsVisualization.title'),
              timestamp: new Date().toLocaleTimeString()
            });
          }
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
                  <span>⚡</span> {t('skillsVisualization.title')}
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
                <div className="text-terminal-green text-xs mt-3">
                  ◆ {t('terminal.hints.skills')}
                </div>
              </div>
            );
          }
          
          // Update preview with visual skills display
          if (onPreviewUpdate) {
            onPreviewUpdate({
              type: 'skills_visual',
              content: t('skillsVisualization.title'),
              timestamp: new Date().toLocaleTimeString()
            });
          }
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
                  <span>📞</span> {t('contactVisualization.title')}
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
                <div className="text-terminal-green text-xs mt-3">
                  ◆ {t('terminal.hints.contact')}
                </div>
              </div>
            );
          }
          
          // Update preview with visual contact display
          if (onPreviewUpdate) {
            onPreviewUpdate({
              type: 'contact_visual',
              content: t('contactVisualization.title'),
              timestamp: new Date().toLocaleTimeString()
            });
          }
        } else {
          addToOutput(
            <div className="text-red-400">
              Command not found: {cmd}. Type 'help' for available commands.
            </div>
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
    <div className="relative bg-black/90 border-2 border-terminal-cyan/50 rounded-lg font-mono text-xs sm:text-sm overflow-hidden flex flex-col h-full">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 px-3 sm:px-4 py-2 border-b border-terminal-cyan/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-terminal-cyan/80 text-xs font-bold ml-2">
            Portfolio Terminal
          </span>
        </div>
        <span className="text-terminal-cyan/60 text-xs hidden sm:block">
          {currentLocation}
        </span>
      </div>

      {/* Terminal Output Area */}
      <div ref={outputRef} className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-[200px]">
        {output.length === 0 ? (
          <div className="text-terminal-cyan/70">
            <div className="text-terminal-cyan font-bold mb-2">{t('terminal.welcome')}</div>
            <div className="text-xs sm:text-sm space-y-1">
              <div>Type <span className="text-terminal-yellow">help</span> to see available commands</div>
              <div>Navigate with <span className="text-terminal-yellow">cd</span> command</div>
              <div>Use <span className="text-terminal-yellow">ls</span> to explore directories</div>
              <div className="text-terminal-green/70 mt-2">Quick tip: Press Tab for auto-completion!</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {output.map((entry, index) => (
              <div key={index} className="animate-fadeIn">
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Input with Current Location */}
      <div className="px-3 sm:px-4 py-2 bg-black/70 border-t border-terminal-cyan/30">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green font-bold text-xs sm:text-sm bg-terminal-green/10 px-2 py-1 rounded border border-terminal-green/30">{currentLocation}</span>
          <span className="text-terminal-cyan font-bold">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-terminal-cyan outline-none placeholder-terminal-cyan/50 text-xs sm:text-sm font-mono"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <span className="text-terminal-cyan animate-pulse text-lg">▋</span>
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
