import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface ContactPageProps {
  compact?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Try multiple API URLs to ensure we reach the backend
      const apiUrls = [
        '/api/contact',  // Proxy URL (production/dev server)
        `${window.location.protocol}//${window.location.hostname}:3001/api/contact`,  // Same host, port 3001
        'http://localhost:3001/api/contact',  // Local development fallback
      ];
      
      let response = null;
      let lastError = null;
      
      for (const apiUrl of apiUrls) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          if (response.ok) {
            break;
          } else {
            lastError = new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      
      if (response && response.ok) {
        const result = await response.json();
        
        // Handle different response methods
        if (result.method === 'mailgun' || result.method === 'email') {
          // Email was sent successfully via Mailgun or SMTP
          setEmailMethod(result.method);
          setSubmitStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form on success
        } else if (result.mailtoLink) {
          // Fallback to mailto
          window.open(result.mailtoLink, '_blank');
          setEmailMethod('mailto');
          setSubmitStatus('success-mailto');
        }
        
        setIsSubmitting(false);
      } else {
        throw lastError || new Error('All API endpoints failed');
      }
      
    } catch (error) {
      // Fallback to mailto on any error
      const emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent from Portfolio Contact Form
      `;

      const mailtoLink = `mailto:paulmallner@gmail.com?subject=${encodeURIComponent(`Portfolio Contact: ${formData.subject}`)}&body=${encodeURIComponent(emailContent)}`;
      
      window.open(mailtoLink, '_blank');
      
      setIsSubmitting(false);
      setSubmitStatus('success-mailto');
      setEmailMethod('mailto');
    }
  };

  const contactLinks = [
    {
      name: 'Email',
      value: 'paulmallner@gmail.com',
      href: 'mailto:paulmallner@gmail.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      description: t('contact.info.descriptions.email')
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/paul-michael-wallner-678b96158',
      href: 'https://www.linkedin.com/in/paul-michael-wallner-678b96158/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      ),
      description: t('contact.info.descriptions.linkedin')
    },
    {
      name: 'GitHub',
      value: 'github.com/mchivelli',
      href: 'https://github.com/mchivelli',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      ),
      description: t('contact.info.descriptions.github')
    }
  ];

  if (compact) {
    return (
      <div className="space-y-4 font-mono">
        {/* Contact Methods */}
        <div className={`rounded border p-3 card-bg ${
          isDark 
            ? 'bg-black/60 border-terminal-border/50' 
            : 'bg-white/80 border-light-border/50'
        }`}>
          <div className={`text-sm font-bold mb-3 ${
            isDark ? 'text-primary-purple' : 'text-primary-blue'
          }`}>
            Contact Methods
          </div>
          <div className="space-y-2">
            {contactLinks.map((contact, index) => (
              <motion.a
                key={contact.name}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-2 border rounded hover:border-primary-blue/50 transition-all duration-300 ${
                  isDark 
                    ? 'bg-black/40 border-terminal-border/30' 
                    : 'bg-gray-50/80 border-light-border/30'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs w-16 ${
                    isDark ? 'text-primary-blue' : 'text-primary-blue'
                  }`}>
                    {contact.name.toUpperCase()}
                  </span>
                  <span className={`text-xs truncate ${
                    isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
                  }`}>
                    {contact.value}
                  </span>
                </div>
                <span className={`text-xs group-hover:text-primary-blue ${
                  isDark ? 'text-primary-blue/50' : 'text-light-text-muted'
                }`}>
                  [open]
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-black/60 rounded border border-terminal-border/50 p-3">
          <div className="text-primary-purple text-sm font-bold mb-3">
            Availability Status
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-primary-blue/70">Project Status:</span>
              <span className="text-primary-purple">AVAILABLE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-blue/70">Response Time:</span>
              <span className="text-primary-yellow">~24 HOURS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-blue/70">Work Mode:</span>
              <span className="text-primary-blue">REMOTE OK</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="bg-black/60 rounded border border-terminal-border/50 p-3">
          <div className="text-primary-purple text-sm font-bold mb-3">
            Quick Contact
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="your.name"
              className="w-full px-2 py-1 bg-black/40 border border-terminal-border/30 rounded text-primary-blue placeholder-primary-blue/50 text-xs font-mono focus:border-primary-blue/70 focus:outline-none"
            />
            <textarea
              placeholder="message content..."
              rows={3}
              className="w-full px-2 py-1 bg-black/40 border border-terminal-border/30 rounded text-primary-blue placeholder-primary-blue/50 text-xs font-mono focus:border-primary-blue/70 focus:outline-none resize-none"
            />
            <button className="w-full px-3 py-1 bg-primary-blue/20 border border-primary-blue/50 rounded text-primary-blue text-xs font-bold hover:bg-primary-blue/30 transition-all duration-300">
              [SEND MESSAGE]
            </button>
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="bg-black/40 rounded border border-terminal-border/30 p-2">
          <div className="text-primary-purple text-xs">
            $ whoami && echo "Ready to collaborate"
          </div>
          <div className="text-primary-blue text-xs mt-1">
            paul.mchivelli
          </div>
          <div className="text-primary-blue text-xs">
            Ready to collaborate
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
        : 'gradient-bg'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-header mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-primary-blue/70 text-lg md:text-xl max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-black/40 backdrop-blur-md border border-terminal-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary-blue glow-text mb-6 flex items-center gap-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                </svg>
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-4">
                {contactLinks.map((contact, index) => (
                  <motion.a
                    key={contact.name}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-black/30 border border-terminal-border/30 rounded-lg hover:border-primary-blue/50 hover:bg-primary-blue/5 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-primary-blue">{contact.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary-blue group-hover:text-primary-purple transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-primary-blue/80 text-sm">{contact.value}</p>
                      <p className="text-primary-blue/60 text-xs mt-1">{contact.description}</p>
                    </div>
                    <div className="text-primary-blue/50 group-hover:text-primary-blue transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-black/40 backdrop-blur-md border border-terminal-border rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-primary-purple glow-text mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {t('contact.availability.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary-purple rounded-full animate-pulse"></div>
                  <span className="text-primary-blue">{t('contact.availability.status.available')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary-yellow rounded-full"></div>
                  <span className="text-primary-blue/80">{t('contact.availability.status.response')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary-blue rounded-full"></div>
                  <span className="text-primary-blue/80">{t('contact.availability.status.remote')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-md border border-terminal-border rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-primary-blue glow-text mb-6 flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t('contact.form.title')}
            </h2>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-terminal-green/20 border border-terminal-green/50 rounded-lg"
              >
                <div className="flex items-center gap-2 text-primary-purple">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">{t('contact.form.success.title')}</span>
                </div>
                <p className="text-primary-purple/80 text-sm mt-1">
                  {t('contact.form.success.description')}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-primary-blue font-semibold mb-2">
                    {t('contact.form.fields.name')} {t('common.required')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-primary-blue placeholder-primary-blue/50 focus:border-primary-blue/70 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300"
                    placeholder={t('contact.form.placeholders.name')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-primary-blue font-semibold mb-2">
                    {t('contact.form.fields.email')} {t('common.required')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-primary-blue placeholder-primary-blue/50 focus:border-primary-blue/70 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300"
                    placeholder={t('contact.form.placeholders.email')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-primary-blue font-semibold mb-2">
                  {t('contact.form.fields.subject')} {t('common.required')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-primary-blue placeholder-primary-blue/50 focus:border-primary-blue/70 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300"
                  placeholder={t('contact.form.placeholders.subject')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-primary-blue font-semibold mb-2">
                  {t('contact.form.fields.message')} {t('common.required')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-primary-blue placeholder-primary-blue/50 focus:border-primary-blue/70 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 resize-vertical"
                  placeholder={t('contact.form.placeholders.message')}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 border-2 border-primary-blue/50 rounded-lg font-mono text-primary-blue hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-primary-blue rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span>{t('contact.form.sending')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">{t('contact.form.button')}</span>
                  </div>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-terminal-border/30">
              <p className="text-primary-blue/60 text-sm text-center">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <strong>{t('contact.form.directContact')}</strong>{' '}
                <a href="mailto:paul@example.com" className="text-primary-blue hover:text-primary-purple underline transition-colors">
                  email
                </a>{' '}
                {t('contact.form.or')}{' '}
                <a href="https://linkedin.com/in/paulm" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:text-primary-purple underline transition-colors">
                  LinkedIn
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-terminal-cyan/10 to-blue-500/10 border border-terminal-cyan/30 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary-purple glow-text mb-4">
              {t('contact.cta.title')}
            </h3>
            <p className="text-primary-blue/80 mb-6">
              {t('contact.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {(t('contact.cta.services', { returnObjects: true }) as string[]).map((service: string) => (
                <span key={service} className="px-4 py-2 bg-primary-blue/20 border border-primary-blue/30 rounded-full text-primary-blue text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};