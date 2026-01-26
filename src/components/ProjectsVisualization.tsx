import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';


interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  liveUrl: string;
  tech: string[];
  features: string[];
}

const ProjectCard: React.FC<{ 
  project: Project; 
  index: number; 
  isSelected: boolean; 
  onClick: () => void;
}> = ({ project, index, isSelected, onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -10 }}
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden
        ${isSelected 
          ? 'bg-gradient-to-br from-terminal-cyan/20 to-blue-500/20 border-terminal-cyan/50 shadow-xl shadow-terminal-cyan/25' 
          : 'bg-gradient-to-br from-black/60 to-gray-900/60 border-gray-700/50 hover:border-terminal-cyan/30'
        }
      `}
    >
      {/* Project Image */}
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-black/70 text-terminal-cyan text-xs rounded-full font-medium">
            #{project.id}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech?.slice(0, 3).map((tech: string) => (
            <span 
              key={tech}
              className="px-2 py-1 bg-terminal-green/20 text-terminal-green text-xs rounded-md border border-terminal-green/30"
            >
              {tech}
            </span>
          ))}
          {project.tech?.length > 3 && (
            <span className="text-gray-400 text-xs">+{project.tech.length - 3} {t('projectsVisualization.more')}</span>
          )}
        </div>

        {/* Action Links */}
        <div className="flex gap-3 pt-2">
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-terminal-cyan/20 hover:bg-terminal-cyan/30 text-terminal-cyan text-sm rounded-lg border border-terminal-cyan/30 transition-all duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {t('projectsVisualization.buttons.viewSource')}
          </a>
          {project.liveUrl && (
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm rounded-lg border border-green-500/30 transition-all duration-200 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {t('projectsVisualization.buttons.viewDemo')}
            </a>
          )}
        </div>
      </div>

      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-terminal-cyan/5 to-blue-500/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const ProjectDetailPanel: React.FC<{ 
  project: Project; 
  onClose: () => void;
}> = ({ project, onClose }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.4 }}
      className="fixed right-4 top-4 bottom-4 w-96 bg-black/95 border border-terminal-cyan/50 rounded-xl backdrop-blur-xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Project Image */}
        <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">{t('projectsVisualization.about')}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{project.longDescription}</p>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">{t('projectsVisualization.techStack')}</h4>
          <div className="flex flex-wrap gap-2">
            {project.tech?.map((tech, idx) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-3 py-2 bg-terminal-cyan/10 border border-terminal-cyan/30 rounded-lg text-terminal-cyan text-sm"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">{t('projectsVisualization.keyFeatures')}</h4>
            <div className="space-y-2">
              {project.features.map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-gray-300 text-sm"
                >
                  <span className="text-terminal-cyan">•</span>
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/30 rounded-full text-xs font-medium hover:bg-terminal-cyan/30 transition-colors duration-200"
              >
                {t('projectsVisualization.buttons.code')}
              </motion.a>
            )}
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded-full text-xs font-medium hover:bg-terminal-green/30 transition-colors duration-200"
              >
                {t('projectsVisualization.buttons.live')}
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsVisualization: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('projectsVisualization.title')}
          <span className="ml-2 text-terminal-green">💼</span>
        </h2>
        <p className="text-gray-400">
          {t('projectsVisualization.subtitle')}
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project: any, index: number) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isSelected={selectedProject?.id === project.id}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>

      {/* Project Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-terminal-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
