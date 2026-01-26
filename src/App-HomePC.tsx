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
import { timelineData } from './data/timeline';

function App() {
  const { t } = useTranslation();
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
      <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan font-mono overflow-hidden">
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
              className="absolute text-terminal-green/40 font-mono text-xs select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
              }}
              animate={{
                y: ['0vh', '110vh'],
                opacity: [0, Math.random() * 0.8 + 0.3, 0],
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
              <div className="h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md border border-terminal-border rounded-lg shadow-2xl shadow-terminal-cyan/10">
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
              className="w-[40%] bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md border border-terminal-border rounded-lg shadow-2xl shadow-terminal-cyan/10 overflow-hidden"
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
    <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan font-mono overflow-hidden">
      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onTerminalFocus={handleTerminalFocus}
      />

      {/* Matrix-style background - Enhanced density and visibility */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-green/35 font-mono text-xs select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-50px',
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, Math.random() * 0.8 + 0.3, 0],
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
                    <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96 portrait-container">
                      {/* Layer 1: Gradient Ring */}
                      <div className="gradient-ring"></div>

                      {/* Layer 2: Portrait with bottom curvature crop */}
                      <div className="portrait-with-curve">
                        <img
                          src="/portrait2.png"
                          alt="Paul Wallner - Full Stack Developer"
                          className="filter brightness-75 contrast-90"
                        />
                      </div>

                      {/* Floating particles - positioned behind the portrait */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-terminal-cyan rounded-full -z-10"
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
                        <span className="animate-gradient-text glow-text">{t('hero.name')}</span>
                        <br />
                        <span className="text-terminal-yellow text-3xl md:text-4xl">
                          {t('hero.title')} {t('hero.subtitle')}
                        </span>
                      </motion.h1>

                      <motion.p
                        className="text-xl text-terminal-cyan/80 leading-relaxed max-w-2xl"
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
                        className="px-8 py-4 bg-gradient-to-r from-terminal-cyan to-blue-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-terminal-cyan/50 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex items-center gap-2">
                          <span>▶</span>
                          {t('hero.buttons.terminal')}
                        </span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleSectionChange('projects')}
                        className="px-8 py-4 border-2 border-terminal-cyan text-terminal-cyan font-bold rounded-lg hover:bg-terminal-cyan hover:text-black transition-all duration-300"
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
                          className="px-3 py-1 bg-terminal-cyan/10 text-terminal-cyan border border-terminal-cyan/20 rounded-md text-xs font-medium hover:bg-terminal-cyan/15 transition-colors duration-200"
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
            <Timeline data={timelineData} />
          </motion.div>
        </main>
      </div>




    </div>
  );
}

export default App;