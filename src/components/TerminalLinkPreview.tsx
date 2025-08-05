import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TerminalLinkPreviewProps {
  url: string;
  children: React.ReactNode;
  onPreview?: (data: any) => void;
  className?: string;
  type?: 'github' | 'project' | 'email' | 'linkedin' | 'website';
}

export const TerminalLinkPreview: React.FC<TerminalLinkPreviewProps> = ({
  url,
  children,
  onPreview,
  className = "",
  type = 'website'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPreviewData = () => {
    const previewDataMap = {
      github: {
        url,
        title: 'GitHub Repository',
        description: 'View my code repositories, contributions, and open source projects on GitHub.',
        image: '/img/portrait2.png',
        icon: '🔗',
        color: 'from-purple-500 to-pink-500'
      },
      project: {
        url,
        title: 'Portfolio Project',
        description: 'Explore this project showcasing modern web development techniques and best practices.',
        image: '/img/portrait1.png',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500'
      },
      email: {
        url,
        title: 'Email Contact',
        description: 'Get in touch with me directly via email for collaborations and opportunities.',
        image: '/img/portrait1.png',
        icon: '📧',
        color: 'from-green-500 to-emerald-500'
      },
      linkedin: {
        url,
        title: 'LinkedIn Profile',
        description: 'Connect with me professionally and view my career background and experience.',
        image: '/img/portrait2.png',
        icon: '💼',
        color: 'from-blue-600 to-blue-400'
      },
      website: {
        url,
        title: 'External Link',
        description: 'Visit this external website for more information.',
        image: '/img/portrait1.png',
        icon: '🌐',
        color: 'from-terminal-cyan to-blue-400'
      }
    };

    return previewDataMap[type] || previewDataMap.website;
  };

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (onPreview) {
      const previewData = getPreviewData();
      onPreview(previewData);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (type === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.span 
      className={`relative inline-block text-terminal-cyan underline cursor-pointer transition-all duration-300 hover:glow-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect on hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 rounded-md -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 0.8
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Icon indicator */}
      <span className="mr-1">{getPreviewData().icon}</span>
      
      {children}
      
      {/* Hover indicator */}
      <motion.span
        className="ml-1 text-xs"
        initial={{ opacity: 0, x: -5 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : -5
        }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.span>
  );
}; 