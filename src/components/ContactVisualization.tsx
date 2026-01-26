import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ContactInfo {
  type: string;
  label: string;
  value: string;
  href: string;
  icon: string;
  color: string;
  description: string;
}


const ContactCard: React.FC<{ 
  contact: ContactInfo; 
  index: number;
}> = ({ contact, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <motion.a
        href={contact.href}
        target={contact.type !== "email" ? "_blank" : undefined}
        rel={contact.type !== "email" ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`
          block p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden
          bg-gradient-to-br from-black/60 to-gray-900/60 border-gray-700/50 hover:border-terminal-cyan/50
          hover:shadow-xl hover:shadow-terminal-cyan/10
        `}
      >
        {/* Contact Icon & Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`
            w-16 h-16 rounded-xl bg-gradient-to-br ${contact.color} 
            flex items-center justify-center text-2xl
            shadow-lg
          `}>
            {contact.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{contact.label}</h3>
            <p className="text-terminal-cyan text-sm font-mono">{contact.value}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mt-2">{contact.description}</p>

        {/* Action Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-terminal-green text-xs font-medium">
            {contact.type === 'email' ? 'Click to open' : contact.type === 'cv' ? 'Click to view' : 'Click to open'}
          </span>
          <motion.span
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-terminal-cyan"
          >
            →
          </motion.span>
        </div>

        {/* Hover Glow */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${contact.color} opacity-0`}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </motion.div>
  );
};

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-black/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50"
    >
      <h3 className="text-2xl font-bold text-white mb-6">{t('contactVisualization.form.title')}
        <span className="ml-2 text-terminal-cyan">💬</span>
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">{t('contactVisualization.form.name')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('contactVisualization.form.namePlaceholder')}
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-terminal-cyan focus:outline-none transition-colors duration-200"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">{t('contactVisualization.form.email')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('contactVisualization.form.emailPlaceholder')}
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-terminal-cyan focus:outline-none transition-colors duration-200"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">{t('contactVisualization.form.message')}</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('contactVisualization.form.messagePlaceholder')}
            rows={4}
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-terminal-cyan focus:outline-none transition-colors duration-200 resize-none"
          />
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-terminal-cyan to-blue-500 text-white font-semibold rounded-lg hover:from-terminal-cyan/80 hover:to-blue-500/80 transition-all duration-200"
        >
          {t('contactVisualization.form.send')} 🚀
        </motion.button>
      </form>
    </motion.div>
  );
};

export const ContactVisualization: React.FC = () => {
  const { t } = useTranslation();
  
  const contactData: ContactInfo[] = [
    {
      type: 'email',
      label: t('contactVisualization.actions.email'),
      value: t('contactVisualization.values.email'),
      href: 'mailto:paul@example.com',
      icon: '📧',
      color: 'from-blue-500 to-cyan-500',
      description: t('contactVisualization.descriptions.email')
    },
    {
      type: 'linkedin',
      label: t('contactVisualization.actions.linkedin'),
      value: t('contactVisualization.values.linkedin'),
      href: 'https://linkedin.com/in/paulm',
      icon: '💼',
      color: 'from-blue-600 to-blue-400',
      description: t('contactVisualization.descriptions.linkedin')
    },
    {
      type: 'github',
      label: t('contactVisualization.actions.github'),
      value: t('contactVisualization.values.github'),
      href: 'https://github.com/paulm',
      icon: '🐱',
      color: 'from-purple-500 to-pink-500',
      description: t('contactVisualization.descriptions.github')
    },
    {
      type: 'location',
      label: t('contactVisualization.actions.location'),
      value: t('contactVisualization.values.location'),
      href: '#',
      icon: '🌍',
      color: 'from-green-500 to-emerald-500',
      description: t('contactVisualization.descriptions.location')
    },
    {
      type: 'calendar',
      label: t('contactVisualization.actions.calendar'),
      value: t('contactVisualization.values.calendar'),
      href: '#',
      icon: '📅',
      color: 'from-orange-500 to-yellow-500',
      description: t('contactVisualization.descriptions.calendar')
    },
    {
      type: 'cv',
      label: t('contactVisualization.actions.cv'),
      value: t('contactVisualization.values.cv'),
      href: '/Paul_Mchivelli_CV.pdf',
      icon: '📄',
      color: 'from-red-500 to-pink-500',
      description: t('contactVisualization.descriptions.cv')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('contactVisualization.title')}
          <span className="ml-2 text-terminal-green">📞</span>
        </h2>
        <p className="text-gray-400">
          {t('contactVisualization.subtitle')}
        </p>
      </motion.div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {contactData.map((contact: ContactInfo, index: number) => (
          <ContactCard
            key={contact.type}
            contact={contact}
            index={index}
          />
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-terminal-cyan/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </motion.div>
  );
};
