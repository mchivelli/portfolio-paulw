import { useState } from 'react';
import { Terminal } from './components/Terminal';
import { motion, AnimatePresence } from 'motion/react';
import { SkillsPreview } from './components/SkillsPreview';
import { ProjectsPage } from './components/ProjectsPage';
import { SkillsPage } from './components/SkillsPage';
import { ContactPage } from './components/ContactPage';
import { Navbar } from './components/Navbar';

function App() {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [command, setCommand] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [showFullProjectsPage, setShowFullProjectsPage] = useState(false);
  const [showSkillsPage, setShowSkillsPage] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const [showHeroTerminal, setShowHeroTerminal] = useState(false);
  const [showMainTerminalOverlay, setShowMainTerminalOverlay] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsTerminalFocused(false);
    
    if (section === 'projects') {
      setShowFullProjectsPage(true);
      setShowSkillsPage(false);
      setShowContactPage(false);
      setShowHero(false);
    } else if (section === 'skills') {
      setShowSkillsPage(true);
      setShowFullProjectsPage(false);
      setShowContactPage(false);
      setShowHero(false);
    } else if (section === 'contact') {
      setShowContactPage(true);
      setShowFullProjectsPage(false);
      setShowSkillsPage(false);
      setShowHero(false);
    } else {
      setShowFullProjectsPage(false);
      setShowSkillsPage(false);
      setShowContactPage(false);
      setShowHero(true);
    }
    
    // Scroll to top when changing sections with better timing
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setTimeout(() => setCommand(''), 200);
  };

  const handleTerminalFocus = () => {
    setIsTerminalFocused(true);
    setShowFullProjectsPage(false);
    setShowSkillsPage(false);
    setShowContactPage(false);
    setShowHero(false);
    setActiveSection('terminal');
    
    // Smooth scroll to top on initial load and when hero is shown
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTerminalInteraction = () => {
    if (!isTerminalFocused) {
      handleTerminalFocus();
    }
  };

  const handleHeroTerminalToggle = () => {
    setShowHeroTerminal(!showHeroTerminal);
  };

  const handleMainTerminalClick = () => {
    // This function will now only be used for the overlay, 
    // triggered after a command is executed.
    if (!showMainTerminalOverlay) {
      setShowMainTerminalOverlay(true);
    }
  };

  const handlePreviewUpdate = (data: any) => {
    setPreviewData(data);
    setShowPreview(!!data);
  };

  // Show full projects page when projects section is active
  if (showFullProjectsPage) {
    return (
      <>
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onTerminalFocus={handleTerminalFocus}
        />
        <div className="pt-16">
          <ProjectsPage />
        </div>
      </>
    );
  }

  // Show full skills page when skills section is active
  if (showSkillsPage) {
    return (
      <>
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onTerminalFocus={handleTerminalFocus}
        />
        <div className="pt-16">
          <SkillsPage />
        </div>
      </>
    );
  }

  // Show full contact page when contact section is active
  if (showContactPage) {
    return (
      <>
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onTerminalFocus={handleTerminalFocus}
        />
        <div className="pt-16">
          <ContactPage />
        </div>
      </>
    );
  }

  // Show terminal-focused page when terminal is active
  if (isTerminalFocused) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan font-mono overflow-hidden">
        {/* Navbar */}
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onTerminalFocus={handleTerminalFocus}
        />

        {/* Matrix Rain Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-terminal-green/30 font-mono text-xs select-none"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: '-50px',
              }}
              animate={{ 
                y: ['0vh', '110vh'],
                opacity: [0, Math.random() * 0.6 + 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
            >
              {['0', '1', '01', '10', '101', '010'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
        
        {/* Terminal Focused Layout - Enhanced Full Screen With Preview Section */}
        <div className="absolute inset-0 pt-16 overflow-hidden">
          <div className="h-full flex gap-4 p-4">
            {/* Terminal Panel - Left Side - Bigger */}
            <motion.div 
              className="w-[60%] relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md border border-terminal-border rounded-lg shadow-2xl shadow-terminal-cyan/10">
                <Terminal 
                  onPreviewUpdate={handlePreviewUpdate} 
                  command={command}
                  isFullScreen={true}
                  onTerminalInteraction={handleTerminalInteraction}
                  onClose={() => setIsTerminalFocused(false)}
                  isTerminalPage={true}
                  onNavigate={handleSectionChange}
                  activeSection={activeSection}
                  hideTerminal={false}
                />
              </div>
            </motion.div>

            {/* Enhanced Command Preview Panel - Right Side - Bigger */}
            <motion.aside
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-[40%] bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md border border-terminal-border rounded-lg shadow-2xl shadow-terminal-cyan/10"
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-terminal-border bg-gradient-to-r from-terminal-cyan/10 to-blue-500/10">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-2 glow-text flex items-center gap-3">
                      <span className="text-3xl text-terminal-cyan">⚡</span>
                      Command Center
                    </h2>
                    <p className="text-terminal-cyan/70 text-sm">Interactive command options and previews</p>
                  </motion.div>
                </div>

                {/* Command Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <motion.div 
                    className="grid gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    {/* Navigation Commands */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-terminal-green flex items-center gap-2">
                        <span className="text-xl">🧭</span>
                        Navigation Commands
                      </h3>
                      <div className="grid gap-2">
                        {[
                          { cmd: 'about', desc: 'Learn about Paul M.', icon: '👤', color: 'cyan' },
                          { cmd: 'projects', desc: 'View portfolio projects', icon: '🚀', color: 'green' },
                          { cmd: 'skills', desc: 'Technical expertise', icon: '⚡', color: 'yellow' },
                          { cmd: 'contact', desc: 'Get in touch', icon: '📧', color: 'blue' }
                        ].map((item, index) => (
                          <motion.button
                            key={item.cmd}
                            onClick={() => setCommand(`${item.cmd}`)}
                            className={`p-3 rounded-lg border border-terminal-cyan/30 bg-gradient-to-r from-terminal-cyan/10 to-terminal-cyan/5 hover:from-terminal-cyan/20 hover:to-terminal-cyan/10 transition-all duration-300 text-left group`}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{item.icon}</span>
                              <div className="flex-1">
                                <div className="font-mono font-bold text-terminal-cyan group-hover:glow-text">{item.cmd}</div>
                                <div className="text-xs text-terminal-cyan/70">{item.desc}</div>
                              </div>
                              <span className="text-terminal-cyan/50 group-hover:text-terminal-cyan transition-colors">▶</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* System Commands */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-terminal-green flex items-center gap-2">
                        <span className="text-xl">⚙️</span>
                        System Commands
                      </h3>
                      <div className="grid gap-2">
                        {[
                          { cmd: 'help', desc: 'Show all commands', icon: '❓', color: 'cyan' },
                          { cmd: 'clear', desc: 'Clear terminal', icon: '🧹', color: 'yellow' },
                          { cmd: 'history', desc: 'Command history', icon: '📜', color: 'blue' },
                          { cmd: 'tree', desc: 'Portfolio structure', icon: '🌳', color: 'green' }
                        ].map((item, index) => (
                          <motion.button
                            key={item.cmd}
                            onClick={() => setCommand(`${item.cmd}`)}
                            className={`p-3 rounded-lg border border-terminal-cyan/30 bg-gradient-to-r from-terminal-cyan/10 to-terminal-cyan/5 hover:from-terminal-cyan/20 hover:to-terminal-cyan/10 transition-all duration-300 text-left group`}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{item.icon}</span>
                              <div className="flex-1">
                                <div className="font-mono font-bold text-terminal-cyan group-hover:glow-text">{item.cmd}</div>
                                <div className="text-xs text-terminal-cyan/70">{item.desc}</div>
                              </div>
                              <span className="text-terminal-cyan/50 group-hover:text-terminal-cyan transition-colors">▶</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Quick Tips */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-terminal-green/10 to-terminal-cyan/10 rounded-lg border border-terminal-green/30">
                    <h4 className="font-semibold text-terminal-green mb-2 flex items-center gap-2">
                      <span>💡</span>
                      Quick Tips
                    </h4>
                    <div className="space-y-1 text-xs text-terminal-cyan/70">
                      <div>• Click any command above to execute it</div>
                      <div>• Use Tab for auto-completion</div>
                      <div>• Arrow keys navigate command history</div>
                      <div>• Type 'cd projects' to navigate to projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan font-mono overflow-hidden">
      {/* Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        onTerminalFocus={handleTerminalFocus}
      />

      {/* Matrix-style background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-green/20 font-mono text-xs select-none"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-50px',
            }}
            animate={{ 
              y: ['0vh', '110vh'],
              opacity: [0, Math.random() * 0.6 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {['0', '1', '01', '10', '101', '010'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      {/* Vertical lines background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-cyan/10 font-mono text-sm select-none whitespace-pre"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-50px',
            }}
            animate={{ 
              y: ['0vh', '120vh'],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {'|'.repeat(Math.floor(Math.random() * 5) + 1)}
          </motion.div>
        ))}
      </div>

      {/* CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none crt z-40" />
      
      {/* Main Container */}
      <div className="relative min-h-screen flex flex-col pt-16">

        {/* Hero Section with Portrait */}
        <AnimatePresence>
          {showHero && activeSection === 'about' && (
            <motion.section
              className="relative py-20 px-4 bg-gradient-to-r from-black/50 via-transparent to-black/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Portrait Side */}
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                      {/* Glowing border */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-terminal-cyan via-blue-500 to-purple-600 p-1 animate-glow">
                        <div className="w-full h-full rounded-full bg-black p-4">
                          <img 
                            src="/portrait1.png" 
                            alt="Paul M. - Full Stack Developer"
                            className="w-full h-full object-cover rounded-full filter brightness-75 contrast-90"
                          />
                        </div>
                      </div>
                      
                      {/* Floating particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-terminal-cyan rounded-full"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div 
                    className="space-y-8"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="space-y-4">
                      <motion.h1 
                        className="text-5xl lg:text-7xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      >
                        <span className="text-terminal-cyan glow-text">Paul M.</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green via-terminal-cyan to-blue-500">
                          Full Stack
                        </span>
                        <br />
                        <span className="text-terminal-yellow">Developer</span>
                      </motion.h1>
                      
                      <motion.p 
                        className="text-xl text-terminal-cyan/80 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        Crafting innovative web solutions with modern technologies. 
                        Passionate about clean code, user experience, and bringing ideas to life.
                      </motion.p>
                    </div>

                    <motion.div 
                      className="flex flex-wrap gap-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.1 }}
                    >
                      <motion.button
                        onClick={handleHeroTerminalToggle}
                        className="px-8 py-4 bg-gradient-to-r from-terminal-cyan to-blue-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-terminal-cyan/50 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex items-center gap-2">
                          <span>▶</span>
                          Launch Terminal
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleSectionChange('projects')}
                        className="px-8 py-4 border-2 border-terminal-cyan text-terminal-cyan font-bold rounded-lg hover:bg-terminal-cyan hover:text-black transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Projects
                      </motion.button>
                    </motion.div>

                    {/* Skills Preview */}
                    <motion.div 
                      className="flex flex-wrap gap-3 pt-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                    >
                      {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'PostgreSQL'].map((skill, index) => (
                        <motion.span 
                          key={skill}
                          className="px-4 py-2 bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50 rounded-full text-sm font-mono"
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 211, 238, 0.3)' }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex relative">
          {/* Terminal Panel */}
          <motion.div 
            className={`flex-1 ${showPreview ? 'lg:w-[70%]' : 'w-full'} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >

            
            <div 
              className="h-full bg-black/20 backdrop-blur-sm border-r border-terminal-border"
            >
              <Terminal 
                onPreviewUpdate={handlePreviewUpdate} 
                command={command}
                onCommandExecute={handleMainTerminalClick}
                onNavigate={handleSectionChange}
                activeSection={activeSection}
                isTerminalPage={false}
                hideTerminal={false}
              />
            </div>
          </motion.div>

          {/* Enhanced Preview Panel */}
          <AnimatePresence>
            {showPreview && (
              <motion.aside
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="hidden lg:block lg:w-[30%] bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-md border-l border-terminal-border"
              >
                <div className="h-full overflow-y-auto p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h2 className="text-xl font-bold mb-6 glow-text flex items-center gap-2">
                      <span className="text-2xl text-terminal-cyan">▣</span>
                      Preview Panel
                    </h2>
                  </motion.div>
                
                  {/* Dynamic Content Based on Active Section */}
                  <AnimatePresence mode="wait">
                    {previewData?.type === 'skills' ? (
                      <motion.div
                        key="skills-preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="h-full overflow-y-auto"
                      >
                        <SkillsPreview />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="default-preview"
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-6xl mb-4 text-terminal-cyan/50">◈</div>
                        <p className="text-terminal-cyan/50">Execute commands to see preview</p>
                        <p className="text-terminal-cyan/30 text-sm mt-2">Terminal-focused interface</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Hero Terminal Overlay */}
      <AnimatePresence>
        {showHeroTerminal && (
          <motion.div
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" 
              onClick={() => setShowHeroTerminal(false)}
            />
            
            {/* Terminal Container */}
            <div className="relative flex items-center justify-center min-h-screen p-4">
              <motion.div
                className="relative w-full max-w-5xl h-[80vh] max-h-[600px]"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Terminal 
                  onPreviewUpdate={handlePreviewUpdate} 
                  command={command}
                  isFullScreen={true}
                  onTerminalInteraction={handleTerminalInteraction}
                  onClose={() => setShowHeroTerminal(false)}
                  isTerminalPage={false}
                  activeSection={activeSection}
                  hideTerminal={false}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Terminal Overlay */}
      <AnimatePresence>
        {showMainTerminalOverlay && (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
              onClick={() => setShowMainTerminalOverlay(false)}
            />
            
            {/* Terminal Container */}
            <div className="relative flex items-center justify-center min-h-screen p-4">
              <motion.div
                className="relative w-full max-w-6xl h-[85vh] max-h-[700px] mx-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{ transform: 'translate(-50%, -50%)', position: 'absolute', top: '50%', left: '50%' }}
              >
                <Terminal 
                  onPreviewUpdate={handlePreviewUpdate} 
                  command={command}
                  isFullScreen={true}
                  onTerminalInteraction={() => {}}
                  onClose={() => setShowMainTerminalOverlay(false)}
                  onNavigate={handleSectionChange}
                  activeSection={activeSection}
                  isTerminalPage={false}
                  hideTerminal={false}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;