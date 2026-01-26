import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { CardBody, CardContainer, CardItem } from './ui/3d-card';
import { LinkPreview } from './ui/link-preview';
import { projects } from '../data/projects';
import { useTheme } from '../contexts/ThemeContext';

interface ProjectsPageProps {
  compact?: boolean;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  if (compact) {
    return (
      <div className="space-y-3 font-mono">
        {projects.slice(0, 8).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`rounded border p-3 transition-all duration-300 group card-bg ${
              isDark 
                ? 'bg-black/60 border-terminal-border/50 hover:border-terminal-cyan/50' 
                : 'bg-white/80 border-light-border/50 hover:border-primary-blue/50'
            }`}
          >
            <div className="flex gap-3">
              <div className={`w-12 h-12 rounded overflow-hidden border flex-shrink-0 ${
                isDark ? 'border-terminal-border/30' : 'border-light-border/30'
              }`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-sm truncate ${
                    isDark ? 'text-terminal-cyan' : 'text-primary-blue'
                  }`}>
                    {project.title}
                  </h3>

                  {project.status === 'coming-soon' && (
                    <span className="text-xs text-blue-400 bg-blue-400/20 px-1 rounded">
                      SOON
                    </span>
                  )}
                  {project.status === 'coming-soon' && (
                    <span className="text-xs text-blue-400 bg-blue-400/20 px-1 rounded">
                      SOON
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-2 line-clamp-2 ${
                  isDark ? 'text-terminal-cyan/70' : 'text-light-text-secondary'
                }`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        isDark 
                          ? 'bg-terminal-cyan/20 text-terminal-cyan/90 border-terminal-cyan/30' 
                          : 'bg-primary-blue/10 text-primary-blue border-primary-blue/30'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className={`text-xs ${
                      isDark ? 'text-terminal-cyan/60' : 'text-light-text-muted'
                    }`}>
                      +{project.tech.length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-xs">
                  {project.showViewCode !== false && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors ${
                        isDark 
                          ? 'text-terminal-cyan hover:text-terminal-green' 
                          : 'text-primary-blue hover:text-primary-purple'
                      }`}
                    >
                      [view code]
                    </a>
                  )}
                  {project.downloadUrl && (
                    <span className={`transition-colors ${
                      isDark 
                        ? 'text-yellow-400' 
                        : 'text-yellow-600'
                    }`}>
                      [download: {project.downloadUrl}]
                    </span>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors ${
                        isDark 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      [live demo]
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Terminal-style footer */}
        <div className={`mt-4 p-3 rounded border ${
          isDark 
            ? 'bg-black/40 border-terminal-border/30' 
            : 'bg-gray-50/80 border-light-border/30'
        }`}>
          <div className={`text-xs mb-1 ${
            isDark ? 'text-terminal-green' : 'text-primary-purple'
          }`}>
            $ ls projects/ | wc -l
          </div>
          <div className={`text-xs ${
            isDark ? 'text-terminal-cyan' : 'text-light-text'
          }`}>
            {projects.length} total projects found
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan' 
        : 'gradient-bg text-light-text'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,247,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(0,247,255,0.05)_60deg,transparent_120deg)]" />
      </div>

      {/* Matrix Rain Effect */}
      <div className={`fixed inset-0 pointer-events-none z-10 ${
        isDark ? 'opacity-20' : 'opacity-10'
      }`}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute font-mono text-sm matrix-rain ${
              isDark ? 'text-terminal-cyan' : 'text-primary-blue'
            }`}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-20px',
              fontSize: `${Math.random() * 6 + 8}px`,
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
            {['0', '1', '01', '10', '101', '010'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-20 pt-20 pb-16 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-blue via-primary-purple to-primary-yellow bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('projects.title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-primary-blue/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('projects.description')}
          </motion.p>
        </div>
      </motion.header>

      {/* Projects Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var py-8">
                <CardBody className={`relative group/card hover:shadow-2xl border-2 w-full h-[500px] rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 hover:shadow-terminal-cyan/[0.1] border-terminal-border/30 hover:border-terminal-cyan/50' 
                    : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 hover:shadow-primary-blue/[0.15] border-light-border/40 hover:border-primary-blue/50'
                }`}>
                  
                  {/* Status Badge - Top Right Corner of Card */}
                  {project.status && project.status !== 'completed' && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 flex items-center gap-1 ${
                        project.status === 'coming-soon' 
                          ? 'bg-primary-blue/90 border-primary-blue text-white' 
                          : 'bg-primary-blue/90 border-primary-blue text-white'
                      }`}>
                        {project.status === 'coming-soon' ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            SOON
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            SOON
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Project Title */}
                  <CardItem
                    translateZ="50"
                    className={`text-xl font-bold mb-2 glow-text ${
                      isDark ? 'text-primary-blue' : 'text-primary-blue'
                    }`}
                  >
                    {project.title}
                  </CardItem>
                  
                  {/* Project Description */}
                  <CardItem
                    as="p"
                    translateZ="60"
                    className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
                      isDark ? 'text-primary-blue/80' : 'text-light-text-secondary'
                    }`}
                  >
                    {project.description}
                  </CardItem>

                  {/* Project Image */}
                  <CardItem translateZ="100" className="w-full mb-4">
                    <div className={`relative overflow-hidden rounded-lg border ${
                      isDark ? 'border-terminal-border/50' : 'border-light-border/50'
                    }`}>
                      <img
                        src={project.image}
                        height="200"
                        width="400"
                        className="h-48 w-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                        alt={project.title}
                      />
                      <div className={`absolute inset-0 ${
                        isDark 
                          ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' 
                          : 'bg-gradient-to-t from-black/20 via-transparent to-transparent'
                      }`} />
                      

                    </div>
                  </CardItem>

                  {/* Tech Stack */}
                  <CardItem translateZ="80" className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={`text-xs px-2 py-1 rounded-full border ${
                            isDark 
                              ? 'bg-primary-blue/20 text-primary-blue/90 border-primary-blue/30' 
                              : 'bg-primary-blue/10 text-primary-blue border-primary-blue/40'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className={`text-xs px-2 py-1 ${
                          isDark ? 'text-primary-blue/60' : 'text-light-text-muted'
                        }`}>
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  </CardItem>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-auto gap-2">
                    {project.showViewCode !== false && (
                      <CardItem
                        translateZ={20}
                        as={LinkPreview}
                        url={project.url}
                        className={`px-4 py-2 rounded-xl text-sm font-normal hover:glow-text transition-all duration-300 border hover:border-primary-blue/50 ${
                          isDark 
                            ? 'text-primary-blue border-terminal-border/50' 
                            : 'text-primary-blue border-light-border/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {t('projects.buttons.viewCode')}
                        </div>
                      </CardItem>
                    )}

                    {project.downloadUrl && (
                      <CardItem
                        translateZ={20}
                        className={`px-4 py-2 rounded-xl text-sm font-normal transition-all duration-300 border ${
                          isDark 
                            ? 'text-yellow-400 border-yellow-400/50' 
                            : 'text-yellow-600 border-yellow-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Download: {project.downloadUrl}
                        </div>
                      </CardItem>
                    )}
                    
                    {project.liveUrl && (
                      <CardItem
                        translateZ={20}
                        as={LinkPreview}
                        url={project.liveUrl}
                        className={`px-4 py-2 rounded-xl border text-primary-blue text-sm font-bold transition-all duration-300 ${
                          isDark 
                            ? 'bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border-primary-blue/50 hover:from-primary-blue/30 hover:to-primary-purple/30' 
                            : 'bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 border-primary-blue/40 hover:from-primary-blue/20 hover:to-primary-purple/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          {t('projects.buttons.liveDemo')}
                        </div>
                      </CardItem>
                    )}
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-all duration-500 pointer-events-none ${
                    isDark 
                      ? 'bg-gradient-to-r from-terminal-cyan/5 via-transparent to-blue-500/5' 
                      : 'bg-gradient-to-r from-primary-blue/3 via-transparent to-primary-purple/3'
                  }`} />
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className={`max-w-2xl mx-auto p-8 backdrop-blur-sm border rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-black/60 to-gray-900/60 border-terminal-border/30' 
              : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-light-border/30'
          }`}>
            <h3 className="text-2xl font-bold text-primary-blue mb-4 glow-text">
              {t('projects.moreComing.title')}
            </h3>
            <p className={`leading-relaxed mb-6 ${
              isDark ? 'text-primary-blue/80' : 'text-light-text-secondary'
            }`}>
              {t('projects.moreComing.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/paulm"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border border-primary-blue/50 rounded-xl text-primary-blue font-semibold hover:from-primary-blue/30 hover:to-primary-purple/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                {t('projects.moreComing.buttons.github')}
              </a>
              <a
                href="mailto:paul@example.com"
                className={`px-6 py-3 border rounded-xl text-primary-blue font-semibold hover:border-primary-blue/50 hover:glow-text transition-all duration-300 inline-flex items-center gap-2 ${
                  isDark ? 'border-terminal-border/50' : 'border-light-border/50'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {t('projects.moreComing.buttons.collaborate')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};