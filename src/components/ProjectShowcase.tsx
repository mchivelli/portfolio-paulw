import React from 'react';
import { motion } from 'motion/react';
import type { Project } from '../data/projects';

interface ProjectShowcaseProps {
  project: Project;
  onClose: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ project, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-black/90 to-gray-900/90 border-2 border-terminal-cyan/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 100 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 pb-4">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-terminal-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              {project.title}
            </h1>
            <p className="text-terminal-cyan/80 text-lg">{project.description}</p>
          </motion.div>
        </div>

        {/* Project Image */}
        <motion.div
          className="px-8 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative rounded-xl overflow-hidden border border-terminal-border/50 group">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-terminal-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                About This Project
              </h3>
              <p className="text-terminal-cyan/80 leading-relaxed mb-6">
                {project.longDescription || project.description}
              </p>
              
              {project.features && (
                <>
                  <h4 className="text-lg font-semibold text-terminal-cyan mb-3 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Key Features
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="text-terminal-cyan/70 flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        <span className="text-terminal-cyan mt-1">•</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>

            {/* Tech Stack & Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-terminal-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">🛠️</span>
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tech.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className="px-4 py-2 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm font-mono hover:bg-terminal-cyan/20 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full terminal-btn px-6 py-4 rounded-lg text-center text-terminal-cyan hover:text-white transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">🔗</span>
                    View Source Code
                  </span>
                </motion.a>
                
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 border border-terminal-cyan/50 px-6 py-4 rounded-lg text-center text-terminal-cyan hover:text-white hover:from-terminal-cyan/30 hover:to-blue-500/30 transition-all duration-300 font-semibold"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🚀</span>
                      View Live Demo
                    </span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};