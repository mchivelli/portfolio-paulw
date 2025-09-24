import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: 'profile' | 'project' | 'workspace';
}

const galleryImages: GalleryImage[] = [
  {
    src: '/img/portrait2.png',
    title: 'Professional Portrait',
    description: 'My professional headshot for networking and portfolio use.',
    category: 'profile'
  },
  {
    src: '/img/portrait2.png',
    title: 'Casual Portrait',
    description: 'A more casual photo showcasing my personality.',
    category: 'profile'
  },
  {
    src: '/img/portrait2.png',
    title: 'Admin Dashboard Project',
    description: 'Screenshot of the analytics dashboard with real-time data visualization.',
    category: 'project'
  },
  {
    src: '/img/portrait2.png',
    title: 'E-commerce Platform',
    description: 'Modern shopping interface with seamless user experience.',
    category: 'project'
  },
  {
    src: '/img/portrait2.png',
    title: 'Development Workspace',
    description: 'My coding setup optimized for productivity and creativity.',
    category: 'workspace'
  },
  {
    src: '/img/portrait2.png',
    title: 'Mobile App Interface',
    description: 'Responsive design showcasing mobile-first approach.',
    category: 'project'
  }
];

interface ImageGalleryProps {
  category?: 'all' | 'profile' | 'project' | 'workspace';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ category = 'all' }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>(category);

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const categories = [
    { key: 'all', label: 'All', icon: '🖼️' },
    { key: 'profile', label: 'Profile', icon: '👨‍💻' },
    { key: 'project', label: 'Projects', icon: '🚀' },
    { key: 'workspace', label: 'Workspace', icon: '⚡' }
  ];

  return (
    <div className="p-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map(cat => (
          <motion.button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
              filter === cat.key
                ? 'bg-terminal-cyan/20 border-terminal-cyan text-terminal-cyan'
                : 'border-terminal-border/50 text-terminal-cyan/70 hover:border-terminal-cyan/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Image Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <motion.div
                className="relative overflow-hidden rounded-xl border border-terminal-border/50 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:border-terminal-cyan/50 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square overflow-hidden">
                  <motion.img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  initial={{ y: '100%' }}
                  whileHover={{ y: 0 }}
                >
                  <h3 className="font-bold mb-1 text-terminal-cyan">{image.title}</h3>
                  <p className="text-sm text-terminal-cyan/80 line-clamp-2">{image.description}</p>
                </motion.div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-terminal-cyan text-sm">🔍</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-black/90 to-gray-900/90 border-2 border-terminal-cyan/30 rounded-2xl overflow-hidden backdrop-blur-sm"
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-terminal-cyan mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-terminal-cyan/80 leading-relaxed">
                  {selectedImage.description}
                </p>
                <div className="mt-4">
                  <span className="px-3 py-1 bg-terminal-cyan/20 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm">
                    {selectedImage.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};