import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { CardBody, CardContainer, CardItem } from './ui/3d-card';
import { LinkPreview } from './ui/link-preview';
import { projects } from '../data/projects';

export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-gray-900 to-black text-terminal-cyan relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,247,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(0,247,255,0.05)_60deg,transparent_120deg)]" />
      </div>

      {/* Matrix Rain Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-cyan font-mono text-sm"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: '-20px',
              fontSize: `${Math.random() * 6 + 8}px`,
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

      {/* Header */}
      <motion.header 
        className="relative z-20 pt-20 pb-16 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-terminal-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('projects.title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-terminal-cyan/80 leading-relaxed"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-64 gap-y-1">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var py-8">
                <CardBody className="bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 relative group/card hover:shadow-2xl hover:shadow-terminal-cyan/[0.1] border-terminal-border/30 border-2 w-full h-[500px] rounded-xl p-6 backdrop-blur-sm hover:border-terminal-cyan/50 transition-all duration-300">
                  
                  {/* Project Title */}
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-terminal-cyan mb-2 glow-text"
                  >
                    {project.title}
                  </CardItem>
                  
                  {/* Project Description */}
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-terminal-cyan/80 text-sm leading-relaxed mb-4 line-clamp-3"
                  >
                    {project.description}
                  </CardItem>

                  {/* Project Image */}
                  <CardItem translateZ="100" className="w-full mb-4">
                    <div className="relative overflow-hidden rounded-lg border border-terminal-border/50">
                      <img
                        src={project.image}
                        height="200"
                        width="400"
                        className="h-48 w-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Live Demo Badge */}
                      {project.liveUrl && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-xs font-semibold">
                            ● {t('common.live')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardItem>

                  {/* Tech Stack */}
                  <CardItem translateZ="80" className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-terminal-cyan/20 rounded-full text-terminal-cyan/90 border border-terminal-cyan/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="text-xs px-2 py-1 text-terminal-cyan/60">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  </CardItem>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-auto">
                    <CardItem
                      translateZ={20}
                      as={LinkPreview}
                      url={project.url}
                      className="px-4 py-2 rounded-xl text-sm font-normal text-terminal-cyan hover:glow-text transition-all duration-300 border border-terminal-border/50 hover:border-terminal-cyan/50"
                    >
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        {t('projects.buttons.viewCode')}
                      </div>
                    </CardItem>
                    
                    {project.liveUrl && (
                      <CardItem
                        translateZ={20}
                        as={LinkPreview}
                        url={project.liveUrl}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 border border-terminal-cyan/50 text-terminal-cyan text-sm font-bold hover:from-terminal-cyan/30 hover:to-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span>🚀</span>
                          {t('projects.buttons.liveDemo')}
                        </div>
                      </CardItem>
                    )}
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-terminal-cyan/5 via-transparent to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-all duration-500 pointer-events-none" />
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
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-terminal-border/30 rounded-2xl">
            <h3 className="text-2xl font-bold text-terminal-cyan mb-4 glow-text">
              {t('projects.moreComing.title')}
            </h3>
            <p className="text-terminal-cyan/80 leading-relaxed mb-6">
              {t('projects.moreComing.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkPreview 
                url="https://github.com/paulm"
                className="px-6 py-3 bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 border border-terminal-cyan/50 rounded-xl text-terminal-cyan font-semibold hover:from-terminal-cyan/30 hover:to-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  {t('projects.moreComing.buttons.github')}
                </div>
              </LinkPreview>
              <LinkPreview 
                url="mailto:paul@example.com"
                className="px-6 py-3 border border-terminal-border/50 rounded-xl text-terminal-cyan font-semibold hover:border-terminal-cyan/50 hover:glow-text transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span>✉</span>
                  {t('projects.moreComing.buttons.collaborate')}
                </div>
              </LinkPreview>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};