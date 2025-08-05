import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalImagePreviewProps {
  text: string;
  images?: string[]; // Make images optional and an array
  image?: string; // Keep single image for backward compatibility and skills
  title: string;
  description: string;
  url?: string;
  type: 'project' | 'skill' | 'contact';
  className?: string;
}

export const TerminalImagePreview: React.FC<TerminalImagePreviewProps> = ({
  text,
  images = [],
  image,
  title,
  description,
  url,
  type,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use `images` array if provided and non-empty, otherwise fallback to `image`
  const displayImages = images && images.length > 0 ? images : (image ? [image] : []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && displayImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1500); // Change image every 1.5 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    setCurrentImageIndex(0); // Reset to first image on hover
    updateMousePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateMousePosition(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const updateMousePosition = (e: React.MouseEvent) => {
    // This logic seems complex and might be the cause of positioning issues.
    // Let's simplify and use the clientX/Y for direct positioning.
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleClick = () => {
    if (url) {
      if (type === 'contact' && url.startsWith('mailto:')) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'project': return '▲';
      case 'skill': return '◆';
      case 'contact': return '●';
      default: return '◆';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'project': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50';
      case 'skill': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
      case 'contact': return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
      default: return 'from-terminal-cyan/20 to-blue-500/20 border-terminal-cyan/50';
    }
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className={`
          text-terminal-cyan underline cursor-pointer font-mono transition-all duration-300 hover:glow-text
          ${url ? 'hover:scale-105' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={{ scale: url ? 1.05 : 1 }}
        whileTap={{ scale: url ? 0.95 : 1 }}
      >
        <span className="mr-1">{getIcon()}</span>
        {text}
      </motion.span>

      <AnimatePresence>
        {isHovered && displayImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.2
            }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${mousePosition.x + 20}px`,
              top: `${mousePosition.y - 10}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className={`
              bg-gradient-to-br ${getColorClasses()}
              backdrop-blur-md border-2 rounded-xl p-4 shadow-2xl max-w-xs
              shadow-terminal-cyan/20
            `}>
              <div className="relative overflow-hidden rounded-lg mb-3 border border-terminal-border/30 h-32">
                <AnimatePresence>
                  <motion.img
                    key={currentImageIndex}
                    src={displayImages[currentImageIndex]}
                    alt={`${title} preview ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                 {displayImages.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {displayImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-terminal-cyan scale-125' : 'bg-terminal-cyan/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-terminal-cyan font-bold text-sm mb-2 glow-text">
                  {title}
                </h3>
                <p className="text-terminal-cyan/80 text-xs leading-relaxed mb-3">
                  {description}
                </p>
                {url && (
                  <div className="flex items-center gap-2 text-terminal-cyan/60 text-xs">
                    <span>Click to {type === 'contact' ? 'contact' : 'visit'}</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
