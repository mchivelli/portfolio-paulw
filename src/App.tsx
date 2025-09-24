import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnhancedTerminal } from './components/EnhancedTerminal';
import { CommandCenter } from './components/CommandCenter';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectsPage } from './components/ProjectsPage';
import { SkillsPage } from './components/SkillsPage';
import { ContactPage } from './components/ContactPage';
import { Navbar } from './components/Navbar';
import { Timeline } from './components/ui/timeline';
import { createTimelineData } from './data/timeline';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('about');
  const [previewData, setPreviewData] = useState<any>(null);
  const [currentTerminalPath, setCurrentTerminalPath] = useState<string[]>([]);
  const [showHero, setShowHero] = useState(true);
  const [showFullProjectsPage, setShowFullProjectsPage] = useState(false);
  const [showSkillsPage, setShowSkillsPage] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);

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

  const handlePreviewUpdate = (data: any) => {
    setPreviewData(data);
    if (data?.currentPath !== undefined) {
      setCurrentTerminalPath(data.currentPath);
    }
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
      <div className={`min-h-screen font-mono overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan' 
          : 'gradient-bg text-light-text'
      }`}>
        {/* Navbar */}
        <Navbar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onTerminalFocus={handleTerminalFocus}
        />

        {/* Matrix Rain Background - Enhanced for terminal mode */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute font-mono text-xs select-none matrix-rain ${
                isDark ? 'text-terminal-green/40' : 'text-primary-blue/20'
              }`}
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: '-50px',
              }}
              animate={{ 
                y: ['0vh', '110vh'],
                opacity: [0, isDark ? Math.random() * 0.8 + 0.3 : Math.random() * 0.3 + 0.1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "linear"
              }}
            >
              {['0', '1', '01', '10', '101', '010', '001', '110', '011', '100'][Math.floor(Math.random() * 10)]}
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
              <div className={`h-full backdrop-blur-md rounded-lg shadow-2xl card-bg ${
                isDark 
                  ? 'bg-gradient-to-br from-black/60 via-black/40 to-black/60 border border-terminal-border shadow-terminal-cyan/10' 
                  : 'bg-white/90 border border-light-border shadow-primary-blue/10'
              }`}>
                <EnhancedTerminal 
                  onPreviewUpdate={handlePreviewUpdate} 
                  command=""
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

            {/* Enhanced Command Center Panel - Right Side */}
            <motion.aside
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`w-[40%] backdrop-blur-md rounded-lg shadow-2xl overflow-hidden card-bg ${
                isDark 
                  ? 'bg-gradient-to-br from-black/60 via-black/40 to-black/60 border border-terminal-border shadow-terminal-cyan/10' 
                  : 'bg-white/90 border border-light-border shadow-primary-blue/10'
              }`}
            >
              <CommandCenter 
                previewData={previewData}
                currentPath={currentTerminalPath}
              />
            </motion.aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-mono overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan' 
        : 'gradient-bg text-light-text'
    }`}>
      {/* Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        onTerminalFocus={handleTerminalFocus}
      />

      {/* Matrix-style background - Theme-aware */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute font-mono text-xs select-none matrix-rain ${
              isDark ? 'text-primary-purple/25' : 'text-primary-blue/15'
            }`}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-50px',
            }}
            animate={{ 
              y: ['0vh', '110vh'],
              opacity: [0, isDark ? Math.random() * 0.6 + 0.2 : Math.random() * 0.3 + 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {['0', '1', '01', '10', '101', '010', '001', '110', '011', '100'][Math.floor(Math.random() * 10)]}
          </motion.div>
        ))}
      </div>

      {/* Vertical lines background - Theme-aware */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute font-mono text-sm select-none whitespace-pre ${
              isDark ? 'text-primary-blue/8' : 'text-primary-blue/4'
            }`}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-50px',
            }}
            animate={{ 
              y: ['0vh', '120vh'],
              opacity: [0, isDark ? 0.4 : 0.2, 0]
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "linear"
            }}
          >
            {'|'.repeat(Math.floor(Math.random() * 3) + 1)}
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
              className={`relative py-20 px-4 ${
                isDark 
                  ? 'bg-gradient-to-r from-black/50 via-transparent to-black/50' 
                  : 'bg-gradient-to-r from-white/30 via-transparent to-white/30'
              }`}
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
                    <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96 portrait-container">
                      {/* Layer 1: Gradient Ring */}
                      <div className="gradient-ring"></div>
                      
                      {/* Layer 2: Portrait with bottom curvature crop */}
                      <div className="portrait-with-curve">
                        <img 
                          src="/portrait2.webp" 
                          alt="Paul Wallner - Full Stack Developer"
                          width={320}
                          height={320}
                          loading="eager"
                          decoding="async"
                          fetchpriority="high"
                          className={`${
                            isDark 
                              ? 'filter brightness-75 contrast-90' 
                              : 'filter brightness-100 contrast-100'
                          }`}
                        />
                      </div>
                      
                      {/* Floating particles - positioned behind the portrait */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full -z-10"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            y: [0, -15, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
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
                        <span className="animate-gradient-text glow-text">{t('hero.name')}</span>
                        <br />
                        <span className="text-primary-yellow text-3xl md:text-4xl">
                          {t('hero.title')} {t('hero.subtitle')}
                        </span>
                      </motion.h1>
                      
                      <motion.p 
                        className={`text-xl leading-relaxed max-w-2xl ${
                          isDark ? 'text-primary-blue/80' : 'text-light-text-secondary'
                        }`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        {t('hero.description')}
                      </motion.p>
                    </div>

                    <motion.div 
                      className="flex flex-wrap gap-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.1 }}
                    >
                      <motion.button
                        onClick={handleTerminalFocus}
                        className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary-blue/30 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          {t('hero.buttons.terminal')}
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleSectionChange('projects')}
                        className="px-8 py-4 border-2 border-primary-blue text-primary-blue font-bold rounded-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('hero.buttons.projects')}
                      </motion.button>
                    </motion.div>

                    {/* Skills Preview */}
                    <motion.div 
                      className="flex flex-wrap gap-3 pt-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                    >
                      {(t('hero.skills', { returnObjects: true }) as string[]).map((skill: string, index: number) => (
                        <motion.span 
                          key={skill}
                          className={`px-3 py-1 text-xs font-medium rounded-md ${
                            isDark 
                              ? 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20' 
                              : 'bg-primary-blue/5 text-primary-blue border border-primary-blue/15'
                          } hover:${isDark ? 'bg-primary-blue/15' : 'bg-primary-blue/10'} transition-colors duration-200`}
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

        {/* Main Content - Timeline */}
        <main className="flex-1 relative">
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Timeline data={createTimelineData(t)} />
          </motion.div>
        </main>
      </div>




    </div>
  );
}

export default App;