import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RichTerminalContent } from './RichTerminalContent';
import { TerminalTypewriter } from './TerminalTypewriter';
import { TerminalLinkPreview } from './TerminalLinkPreview';
import { projects } from '../data/projects';

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
  onPreviewUpdate,
  command: externalCommand = '',
  isFullScreen = false,
  onTerminalInteraction,
  onClose,
  onCommandExecute,
  onNavigate,
  activeSection = 'about',
  isTerminalPage = false,
  hideTerminal = false
}) => {
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandCount, setCommandCount] = useState(0);
  const [currentCommand, setCurrentCommand] = useState('');
  const [output, setOutput] = useState<Array<{ id: string; content: string | React.ReactNode; timestamp: Date }>>([
    {
      id: 'welcome',
      content: `{cyan}Welcome to Paul M.'s Interactive Portfolio Terminal{/cyan}

{green}System Status:{/green} Online
{green}Version:{/green} 2.1.0 - Enhanced Edition
{green}Location:{/green} Portfolio Root Directory

{yellow}New Features Available:{/yellow}
- Quick command buttons below this terminal
- Smart autocomplete with Tab key
- Real-time command suggestions
- Enhanced navigation with cd commands

{cyan}Quick Start:{/cyan}
Type {yellow}help{/yellow} to see all available commands.
Try {yellow}cd projects{/yellow} to navigate to projects page.
Use the quick command buttons for instant execution!

{cyan}Ready for enhanced interaction...{/cyan}`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Available commands for autocomplete
  const availableCommands = [
    'help', 'about', 'projects', 'skills', 'contact', 'clear', 'pwd', 'ls', 
    'cd', 'whoami', 'history', 'tree', 'resume', 'social'
  ];

  // Quick command suggestions
  const quickCommands = [
    { cmd: 'about', desc: 'Learn about me', icon: '>' },
    { cmd: 'projects', desc: 'View my work', icon: '>' },
    { cmd: 'skills', desc: 'Technical skills', icon: '>' },
    { cmd: 'contact', desc: 'Get in touch', icon: '>' },
    { cmd: 'help', desc: 'Show all commands', icon: '?' }
  ];

  // Auto-focus input when component mounts or becomes visible
  useEffect(() => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [isTyping, isFullScreen, isOverlayMode]);

  // Handle external command
  useEffect(() => {
    if (externalCommand && externalCommand !== currentCommand) {
      setCurrentCommand(externalCommand);
      handleCommand(externalCommand);
    }
  }, [externalCommand]);

  // Scroll to bottom when output changes or overlay mode changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isOverlayMode]);

  // Update suggestions based on current input
  useEffect(() => {
    if (currentCommand.trim()) {
      const filtered = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(currentCommand.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && currentCommand.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentCommand]);

  // Handle outside clicks to close overlay
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOverlayMode && terminalRef.current && !terminalRef.current.contains(event.target as Node)) {
        setIsOverlayMode(false);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    if (isOverlayMode) {
      // Use both capture and normal phases to ensure we catch the event
      document.addEventListener('mousedown', handleOutsideClick, true);
      document.addEventListener('click', handleOutsideClick, true);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick, true);
        document.removeEventListener('click', handleOutsideClick, true);
      };
    }
  }, [isOverlayMode]);

  const addToOutput = (content: string | React.ReactNode, withDelay = false) => {
    const newEntry = {
      id: `output-${Date.now()}-${Math.random()}`,
      content,
      timestamp: new Date()
    };

    if (withDelay) {
      setIsTyping(true);
      setTimeout(() => {
        setOutput(prev => [...prev, newEntry]);
        setIsTyping(false);
      }, 500);
    } else {
      setOutput(prev => [...prev, newEntry]);
    }
  };

  const handleCommand = (cmd: string, immediate = false) => {
    if (!cmd.trim()) return;

    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ').slice(1);
    const baseCommand = trimmedCmd.split(' ')[0];
    
    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    // Increment command count and clear history after second command (only when not on terminal page)
    setCommandCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 2 && !isTerminalPage) {
        // Clear output after second command (except on terminal page)
        setTimeout(() => {
          setOutput([]);
          setCommandCount(0);
        }, 3000); // Give time to read the output
      }
      return newCount;
    });

    // Add command to output with typewriter effect
    addToOutput(
      <div className="flex items-center gap-2 text-terminal-cyan/80">
        <span className="text-terminal-green">{currentDirectory}</span>
        <span>$</span>
        <span>{cmd}</span>
      </div>
    );

    // Execute command immediately for overlay, or with delay for normal UX
    if (immediate) {
      // For immediate execution (overlay mode), execute synchronously
      executeCommand(baseCommand, args, cmd, false);
      if (onCommandExecute) {
        onCommandExecute();
      }
    } else {
      // For normal mode, add a small delay for better UX
      setTimeout(() => {
        executeCommand(baseCommand, args, cmd, false); // false = not a quick command
        if (onCommandExecute) {
          onCommandExecute();
        }
      }, 100);
    }
  };

  const executeCommand = (command: string, args: string[], fullCommand: string, isQuickCommand = false) => {

    switch (command) {
      case 'help':
        addToOutput(`{cyan}Available Commands & Features:{/cyan}

{yellow}Navigation Commands:{/yellow}
  about          - Learn about Paul M.
  projects       - View portfolio projects
  skills         - Technical skills overview
  contact        - Contact information
  cd <dir>       - Navigate to different pages
  
{yellow}System Commands:{/yellow}
  clear          - Clear the terminal
  pwd            - Show current directory
  ls             - List directory contents
  whoami         - Display user information
  history        - Show command history
  
{yellow}Interactive Features:{/yellow}
  tree           - Show portfolio structure
  resume         - Display resume/CV
  social         - Social media links

{green}New Interactive Features:{/green}
  - {cyan}Quick Command Buttons{/cyan} - Click the buttons above the input
  - {cyan}Smart Autocomplete{/cyan} - Press Tab to complete commands
  - {cyan}Directory Navigation{/cyan} - Use 'cd projects' to go to projects page
  - {cyan}Command History{/cyan} - Use arrow keys to browse history
  - {cyan}Real-time Suggestions{/cyan} - See suggestions as you type

{green}Pro Tips:{/green}
  - Press {yellow}Tab{/yellow} for command completion
  - Use {yellow}Up/Down{/yellow} keys for command history
  - Press {yellow}Esc{/yellow} to clear suggestions
  - Click quick command buttons for instant execution
  - Try {yellow}cd projects{/yellow} to navigate to the projects page

{cyan}Happy exploring!{/cyan}`, true);
        
        if (onPreviewUpdate) {
          onPreviewUpdate({
            type: 'help',
            title: 'Terminal Help',
            description: 'Available commands and navigation options',
            categories: [
              {
                name: 'Navigation',
                commands: [
                  { cmd: 'about', desc: 'Personal information' },
                  { cmd: 'projects', desc: 'Portfolio showcase' },
                  { cmd: 'skills', desc: 'Technical expertise' },
                  { cmd: 'contact', desc: 'Get in touch' }
                ]
              },
              {
                name: 'System',
                commands: [
                  { cmd: 'clear', desc: 'Clear terminal' },
                  { cmd: 'ls', desc: 'List contents' },
                  { cmd: 'pwd', desc: 'Current directory' }
                ]
              }
            ],
            tips: [
              'Use arrow keys for command history',
              'Commands are case-insensitive',
              'Tab completion available for some commands'
            ]
          });
        }
        break;

      case 'about':
        addToOutput(`{cyan}# About Paul M.{/cyan}

{green}Full Stack Developer & Problem Solver{/green}

I'm a passionate full-stack developer who loves creating innovative web solutions that bridge beautiful design with powerful functionality. My journey in tech spans across multiple technologies and frameworks, always with a focus on clean, efficient code and exceptional user experiences.

{yellow}## Core Values{/yellow}
- **Innovation:** Always looking for creative solutions
- **Quality:** Writing clean, maintainable code  
- **Collaboration:** Strong believer in teamwork
- **Growth:** Continuously learning new technologies

{yellow}## What I Do{/yellow}
- Build responsive web applications
- Design and implement RESTful APIs
- Create engaging user interfaces
- Optimize for performance and accessibility
- Mentor and collaborate with team members

{green}Ready to collaborate on your next project!{/green}`);

        if (onPreviewUpdate) {
          onPreviewUpdate({
            type: 'about',
            title: 'About Paul M.',
            description: 'Full Stack Developer passionate about creating innovative web solutions',
            details: [
              'Expert in modern web technologies',
              'Focus on clean, maintainable code',
              'Strong problem-solving skills',
              'Experience with both frontend and backend'
            ],
            skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'PostgreSQL']
          });
        }

        if (onNavigate && !isOverlayMode && !isQuickCommand) {
          onNavigate('about');
        }
        break;

      case 'projects':
        const projectList = projects.slice(0, 3).map((project, index) => 
          `{yellow}${index + 1}. ${project.title}{/yellow}
   ${project.description}
   Tech: ${project.tech.join(', ')}
   🔗 ${project.url}${project.liveUrl ? `\n   🚀 ${project.liveUrl}` : ''}`
        ).join('\n\n');

        addToOutput(`{cyan}# Portfolio Projects{/cyan}

{green}Showcasing innovative full-stack solutions:{/green}

${projectList}

{green}Use 'cd projects' to explore all projects in detail!{/green}`);

        if (onPreviewUpdate) {
          onPreviewUpdate({
            type: 'projects',
            title: 'Portfolio Projects',
            description: 'Showcase of full-stack applications and technical projects',
            stats: {
              total: projects.length.toString(),
              technologies: '20+',
              completed: projects.length.toString()
            },
            projects: projects.slice(0, 3).map(p => ({
              title: p.title,
              description: p.description,
              tech: p.tech,
              url: p.url,
              image: p.image
            }))
          });
        }

        if (onNavigate && !isOverlayMode && !isQuickCommand) {
          onNavigate('projects');
        }
        break;

      case 'skills':
        addToOutput(`{cyan}# Technical Skills{/cyan}

{green}## Frontend Development{/green}
- **Languages:** JavaScript (ES6+), TypeScript, HTML5, CSS3
- **Frameworks:** React, Vue.js, Angular
- **Styling:** Tailwind CSS, Sass, Styled Components
- **Tools:** Webpack, Vite, ESLint, Prettier

{green}## Backend Development{/green}
- **Languages:** Node.js, Python, Java
- **Frameworks:** Express.js, FastAPI, Spring Boot
- **Databases:** PostgreSQL, MongoDB, MySQL, Redis
- **APIs:** REST, GraphQL, WebSocket

{green}## DevOps & Tools{/green}
- **Cloud:** AWS, Docker, Kubernetes
- **CI/CD:** GitHub Actions, Jenkins
- **Version Control:** Git, GitHub, GitLab
- **Testing:** Jest, Cypress, PyTest

{yellow}Proficiency levels range from 75% to 95% across these technologies.{/yellow}`);

        if (onPreviewUpdate) {
          onPreviewUpdate({
            type: 'skills',
            title: 'Technical Skills',
            description: 'Comprehensive overview of programming languages, frameworks, and tools'
          });
        }

        if (onNavigate && !isOverlayMode && !isQuickCommand) {
          onNavigate('skills');
        }
        break;

      case 'contact':
        addToOutput(`{cyan}# Contact Information{/cyan}

{green}Let's connect and discuss opportunities!{/green}

{yellow}## Professional Contact{/yellow}
📧 **Email:** paul@example.com
🔗 **LinkedIn:** linkedin.com/in/paulm
🐙 **GitHub:** github.com/paulm

{yellow}## Availability{/yellow}
✅ **Status:** Available for new opportunities
⏱️ **Response Time:** Usually within 24 hours
🌍 **Location:** Open to remote work

{yellow}## What I'm Looking For{/yellow}
- Full-stack development roles
- Collaborative team environments
- Interesting technical challenges
- Growth and learning opportunities

{green}Don't hesitate to reach out - I'd love to hear about your project!{/green}`);

        if (onPreviewUpdate) {
          onPreviewUpdate({
            type: 'contact',
            title: 'Contact Information',
            description: 'Ready to collaborate on your next project',
            contacts: [
              {
                type: 'Email',
                value: 'paul@example.com',
                url: 'mailto:paul@example.com',
                icon: '📧'
              },
              {
                type: 'LinkedIn',
                value: 'linkedin.com/in/paulm',
                url: 'https://linkedin.com/in/paulm',
                icon: '🔗'
              },
              {
                type: 'GitHub',
                value: 'github.com/paulm',
                url: 'https://github.com/paulm',
                icon: '🐙'
              }
            ],
            availability: 'Available for new opportunities',
            responseTime: 'Usually responds within 24 hours'
          });
        }

        if (onNavigate && !isOverlayMode && !isQuickCommand) {
          onNavigate('contact');
        }
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'pwd':
        addToOutput(`{green}${currentDirectory}{/green}`);
        break;

      case 'ls':
        if (currentDirectory === '~') {
          addToOutput(`{cyan}Contents of ${currentDirectory}:{/cyan}

{yellow}📁 about/         {/yellow} - Personal information and background
{yellow}📁 projects/      {/yellow} - Portfolio and project showcase  
{yellow}📁 skills/        {/yellow} - Technical skills and expertise
{yellow}📁 contact/       {/yellow} - Contact information and links
{yellow}📁 resume/        {/yellow} - Professional resume and CV
{yellow}📄 README.md      {/yellow} - Welcome and instructions`);
        } else {
          addToOutput(`{green}Directory contents for ${currentDirectory} would be shown here.{/green}`);
        }
        break;

      case 'cd':
        if (args.length === 0) {
          setCurrentDirectory('~');
          addToOutput(`{green}Changed to home directory{/green}`);
          if (onNavigate && !isOverlayMode && !isQuickCommand) {
            onNavigate('about');
          }
        } else {
          const target = args[0];
          if (['about', 'projects', 'skills', 'contact', 'resume'].includes(target)) {
            setCurrentDirectory(`~/${target}`);
            addToOutput(`{green}Changed directory to ~/${target}{/green}
            
{cyan}${isOverlayMode ? 'Directory changed in terminal' : `Navigating to ${target} page...`}{/cyan}`);
            if (onNavigate && !isOverlayMode && !isQuickCommand) {
              setTimeout(() => {
                onNavigate(target === 'resume' ? 'about' : target);
              }, 500);
            }
          } else if (target === '..') {
            setCurrentDirectory('~');
            addToOutput(`{green}Changed to parent directory{/green}`);
            if (onNavigate && !isOverlayMode && !isQuickCommand) {
              onNavigate('about');
            }
          } else {
            addToOutput(`{red}Directory not found: ${target}{/red}

{yellow}Available directories:{/yellow}
- about
- projects  
- skills
- contact
- resume

{cyan}Tip: Use 'ls' to see directory contents{/cyan}`);
          }
        }
        break;

      case 'whoami':
        addToOutput(`{cyan}Paul M.{/cyan} - Full Stack Developer
{green}User ID:{/green} developer
{green}Groups:{/green} frontend, backend, devops
{green}Home:{/green} ${currentDirectory}
{green}Shell:{/green} /bin/portfolio-terminal`);
        break;

      case 'history':
        addToOutput(`{cyan}Command History:{/cyan}

${commandHistory.map((cmd, index) => `{green}${(index + 1).toString().padStart(3, ' ')}{/green} ${cmd}`).join('\n')}`);
        break;

      case 'tree':
        addToOutput(`{cyan}Portfolio Structure:{/cyan}

📁 ~/
├── 📁 about/
│   ├── 📄 bio.md
│   ├── 📄 experience.json
│   └── 📄 education.json
├── 📁 projects/
│   ├── 📁 ecommerce-platform/
│   ├── 📁 task-manager/
│   └── 📁 data-dashboard/
├── 📁 skills/
│   ├── 📄 frontend.json
│   ├── 📄 backend.json
│   └── 📄 tools.json
├── 📁 contact/
│   └── 📄 links.json
└── 📄 README.md`);
        break;

      case 'social':
        addToOutput(`{cyan}Social Media & Professional Links:{/cyan}

🔗 **LinkedIn:** https://linkedin.com/in/paulm
🐙 **GitHub:** https://github.com/paulm
🐦 **Twitter:** https://twitter.com/paulm_dev
💼 **Portfolio:** https://paulm.dev
📝 **Blog:** https://blog.paulm.dev

{green}Follow me for updates on projects and tech insights!{/green}`);
        break;

      case 'resume':
        addToOutput(`{cyan}# Resume / CV{/cyan}

{green}## Paul M. - Full Stack Developer{/green}

{yellow}### Professional Experience{/yellow}
**Senior Full Stack Developer** (2021 - Present)
- Led development of multiple web applications
- Improved system performance by 40%
- Mentored junior developers

**Full Stack Developer** (2019 - 2021)  
- Built responsive web applications
- Implemented REST APIs and microservices
- Collaborated with cross-functional teams

{yellow}### Education{/yellow}
**Computer Science Degree** - University (2015-2019)
- Focus on Software Engineering
- Graduated with Honors

{green}Download full resume: [Resume.pdf](mailto:paul@example.com?subject=Resume%20Request){/green}`);
        break;

      default:
        addToOutput(`{red}Command not found: ${command}{/red}

Type {yellow}help{/yellow} to see available commands.`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmdToExecute = currentCommand;
      // Only trigger overlay mode if not on terminal page, not in fullscreen, and not already in overlay
      if (!isTerminalPage && !isFullScreen && !onClose && activeSection !== 'terminal' && cmdToExecute.trim()) {
        // Execute command immediately for overlay mode
        handleCommand(cmdToExecute, true); // true = immediate execution
        // Open overlay after ensuring command execution is complete
        setTimeout(() => {
          setIsOverlayMode(true);
          // Focus the input after overlay opens
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }, 50);
      } else {
        handleCommand(cmdToExecute);
      }
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Enhanced tab completion
      const parts = currentCommand.split(' ');
      const lastPart = parts[parts.length - 1];
      
      if (parts.length === 1) {
        // Complete command
        const matching = availableCommands.filter(cmd => 
          cmd.toLowerCase().startsWith(lastPart.toLowerCase())
        );
        if (matching.length === 1) {
          setCurrentCommand(matching[0]);
          setShowSuggestions(false);
        } else if (matching.length > 1) {
          // Show all matching options
          addToOutput(`{cyan}Available completions:{/cyan}
${matching.join('  ')}`);
        }
      } else if (parts[0] === 'cd') {
        // Complete directory names for cd command
        const dirs = ['about', 'projects', 'skills', 'contact', 'resume', '..'];
        const matching = dirs.filter(dir => 
          dir.toLowerCase().startsWith(lastPart.toLowerCase())
        );
        if (matching.length === 1) {
          parts[parts.length - 1] = matching[0];
          setCurrentCommand(parts.join(' '));
        } else if (matching.length > 1) {
          addToOutput(`{cyan}Available directories:{/cyan}
${matching.join('  ')}`);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Don't trigger overlay on click - only on Enter
    if (onTerminalInteraction) {
      onTerminalInteraction();
    }
  };

  const executeQuickCommand = (cmd: string) => {
    setCurrentCommand(cmd);
    
    // For quick commands, we want to execute immediately without overlay unless specifically needed
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ').slice(1);
    const baseCommand = trimmedCmd.split(' ')[0];
    
    // Add command to output
    addToOutput(
      <div className="flex items-center gap-2 text-terminal-cyan/80">
        <span className="text-terminal-green">{currentDirectory}</span>
        <span>$</span>
        <span>{cmd}</span>
      </div>
    );

    // Only trigger overlay mode if not on terminal page, not in fullscreen, and not already in overlay
    if (!isTerminalPage && !isFullScreen && !onClose && activeSection !== 'terminal') {
      // Execute command immediately, then open overlay
      executeCommand(baseCommand, args, cmd, true); // true = is a quick command
      setTimeout(() => {
        setIsOverlayMode(true);
        // Focus the input after overlay opens
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }, 50);
    } else {
      // Execute immediately with quick command flag
      executeCommand(baseCommand, args, cmd, true); // true = is a quick command
    }
    setShowSuggestions(false);
  };

  const applySuggestion = (suggestion: string) => {
    setCurrentCommand(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Hide terminal when not on terminal page and hideTerminal prop is true
  if (hideTerminal && !isTerminalPage && !isFullScreen) {
    return (
      <div className="h-full flex items-center justify-center bg-black/10 backdrop-blur-sm border-2 border-dashed border-terminal-cyan/30 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2 text-terminal-cyan/50">👁️‍🗨️</div>
          <p className="text-terminal-cyan/70 font-mono text-sm">Terminal Hidden</p>
          <p className="text-terminal-cyan/50 font-mono text-xs mt-1">Click "Show Terminal" to restore</p>
        </div>
      </div>
    );
  }

  // Terminal Content Component - reused for both overlay and normal modes
  const TerminalContent = ({ isInOverlay = false }: { isInOverlay?: boolean }) => (
    <div className={`bg-black/90 border-2 border-terminal-cyan/50 rounded-lg font-mono text-sm overflow-hidden flex flex-col transition-all duration-300 ${
      isInOverlay ? 'h-full shadow-2xl shadow-terminal-cyan/20' : (isFullScreen ? 'h-full' : 'h-96')
    }`}
    onClick={(e) => {
      e.stopPropagation();
      handleTerminalClick();
    }}>
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 px-4 py-2 border-b border-terminal-cyan/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-terminal-cyan/80 text-xs font-bold ml-2">
            Portfolio Terminal - {currentDirectory}
          </span>
        </div>
        {(isFullScreen || isOverlayMode || isInOverlay) && (onClose || isOverlayMode) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isOverlayMode && !onClose) {
                setIsOverlayMode(false);
              } else if (onClose) {
                onClose();
              }
            }}
            className="text-terminal-cyan/60 hover:text-red-400 transition-colors text-lg font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto text-terminal-cyan/90 space-y-2 bg-black/50"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {output.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="leading-relaxed"
            >
              {typeof entry.content === 'string' ? (
                <TerminalTypewriter text={entry.content} speed={isOverlayMode || isInOverlay ? 1 : 3} blink={false} />
              ) : (
                <RichTerminalContent content={entry.content} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-terminal-cyan/60"
          >
            <span>Processing...</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-terminal-cyan rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Command Suggestions */}
      <div className="px-4 py-2 bg-black/50 border-t border-terminal-cyan/30">
        <div className="flex flex-wrap gap-2">
          <span className="text-terminal-cyan/60 text-xs mr-2">Quick commands:</span>
          {quickCommands.map((qCmd) => (
            <motion.button
              key={qCmd.cmd}
              onClick={() => executeQuickCommand(qCmd.cmd)}
              className="group flex items-center gap-1 px-2 py-1 bg-terminal-cyan/10 hover:bg-terminal-cyan/20 border border-terminal-cyan/30 rounded text-xs text-terminal-cyan hover:text-terminal-green transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{qCmd.icon}</span>
              <span className="font-mono">{qCmd.cmd}</span>
              <span className="text-terminal-cyan/60 group-hover:text-terminal-green/60 text-xs hidden sm:inline">
                {qCmd.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Autocomplete Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 bg-terminal-cyan/5 border-t border-terminal-cyan/20"
          >
            <div className="flex flex-wrap gap-1">
              <span className="text-terminal-cyan/60 text-xs mr-2">Press Tab to complete:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => applySuggestion(suggestion)}
                  className="px-2 py-1 bg-terminal-green/10 hover:bg-terminal-green/20 border border-terminal-green/30 rounded text-xs text-terminal-green font-mono transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Input */}
      <div className="px-4 py-2 bg-black/70 border-t border-terminal-cyan/30">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green font-bold">
            {currentDirectory}
          </span>
          <span className="text-terminal-cyan">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-terminal-cyan outline-none placeholder-terminal-cyan/50"
              placeholder="Type a command or use suggestions above..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <span className="text-terminal-cyan animate-pulse">▋</span>
        </div>
        
        {/* Input hints */}
        <div className="mt-1 text-xs text-terminal-cyan/40">
          <span>Tab: autocomplete</span>
          <span className="mx-2">•</span>
          <span>↑↓: history</span>
          <span className="mx-2">•</span>
          <span>Esc: clear suggestions</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay Mode */}
      <AnimatePresence>
        {isOverlayMode && !isTerminalPage && (
          <motion.div
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsOverlayMode(false)}
            />
            
            {/* Terminal Container */}
            <div className="relative flex items-center justify-center min-h-screen p-4">
              <motion.div
                ref={terminalRef}
                className="relative w-full max-w-6xl h-[80vh] max-h-[700px]"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <TerminalContent isInOverlay={true} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Normal Mode */}
      {!isOverlayMode && (
        <TerminalContent isInOverlay={false} />
      )}
    </>
  );
};