import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ContactPage: React.FC = () => {
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactLinks = [
    {
      name: 'Email',
      value: 'paul@example.com',
      href: 'mailto:paul@example.com',
      icon: '📧',
      description: 'Direct email for professional inquiries'
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/paulm',
      href: 'https://linkedin.com/in/paulm',
      icon: '🔗',
      description: 'Professional networking and career updates'
    },
    {
      name: 'GitHub',
      value: 'github.com/paulm',
      href: 'https://github.com/paulm',
      icon: '🐙',
      description: 'Code repositories and open source contributions'
    },
    {
      name: 'Twitter',
      value: '@paulm_dev',
      href: 'https://twitter.com/paulm_dev',
      icon: '🐦',
      description: 'Tech insights and industry discussions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-terminal-green glow-text mb-4">
            Let's Connect
          </h1>
          <p className="text-terminal-cyan/70 text-lg md:text-xl max-w-2xl mx-auto">
            Ready to collaborate on your next project? I'd love to hear from you.
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
              <h2 className="text-2xl font-bold text-terminal-cyan glow-text mb-6 flex items-center gap-2">
                <span className="text-3xl">📬</span>
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {contactLinks.map((contact, index) => (
                  <motion.a
                    key={contact.name}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-black/30 border border-terminal-border/30 rounded-lg hover:border-terminal-cyan/50 hover:bg-terminal-cyan/5 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-3xl">{contact.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-terminal-cyan group-hover:text-terminal-green transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-terminal-cyan/80 text-sm">{contact.value}</p>
                      <p className="text-terminal-cyan/60 text-xs mt-1">{contact.description}</p>
                    </div>
                    <div className="text-terminal-cyan/50 group-hover:text-terminal-cyan transition-colors">
                      →
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
              <h3 className="text-xl font-bold text-terminal-green glow-text mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Availability
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-terminal-green rounded-full animate-pulse"></div>
                  <span className="text-terminal-cyan">Available for new opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-terminal-cyan/80">Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-terminal-cyan/80">Open to remote work worldwide</span>
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
            <h2 className="text-2xl font-bold text-terminal-cyan glow-text mb-6 flex items-center gap-2">
              <span className="text-3xl">✉️</span>
              Send Message
            </h2>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-terminal-green/20 border border-terminal-green/50 rounded-lg"
              >
                <div className="flex items-center gap-2 text-terminal-green">
                  <span className="text-xl">✅</span>
                  <span className="font-bold">Message sent successfully!</span>
                </div>
                <p className="text-terminal-green/80 text-sm mt-1">
                  Thanks for reaching out. I'll get back to you soon!
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-terminal-cyan font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-terminal-cyan placeholder-terminal-cyan/50 focus:border-terminal-cyan/70 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/20 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-terminal-cyan font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-terminal-cyan placeholder-terminal-cyan/50 focus:border-terminal-cyan/70 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/20 transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-terminal-cyan font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-terminal-cyan placeholder-terminal-cyan/50 focus:border-terminal-cyan/70 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/20 transition-all duration-300"
                  placeholder="Project collaboration, job opportunity, etc."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-terminal-cyan font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-black/30 border border-terminal-border/30 rounded-lg text-terminal-cyan placeholder-terminal-cyan/50 focus:border-terminal-cyan/70 focus:outline-none focus:ring-2 focus:ring-terminal-cyan/20 transition-all duration-300 resize-vertical"
                  placeholder="Tell me about your project, requirements, or any questions you have..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-terminal-cyan/20 to-blue-500/20 border-2 border-terminal-cyan/50 rounded-lg font-mono text-terminal-cyan hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-terminal-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-terminal-cyan rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span>Sending Message...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl">🚀</span>
                    <span className="font-bold">Send Message</span>
                  </div>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-terminal-border/30">
              <p className="text-terminal-cyan/60 text-sm text-center">
                💡 <strong>Prefer direct contact?</strong> Feel free to reach out via{' '}
                <a href="mailto:paul@example.com" className="text-terminal-cyan hover:text-terminal-green underline transition-colors">
                  email
                </a>{' '}
                or{' '}
                <a href="https://linkedin.com/in/paulm" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green underline transition-colors">
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
            <h3 className="text-2xl font-bold text-terminal-green glow-text mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-terminal-cyan/80 mb-6">
              Whether you have a project in mind, need technical expertise, or just want to connect, 
              I'm always excited to discuss new opportunities and collaborations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm">
                Full Stack Development
              </span>
              <span className="px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm">
                Technical Consulting
              </span>
              <span className="px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm">
                Code Review
              </span>
              <span className="px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan/30 rounded-full text-terminal-cyan text-sm">
                Mentoring
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};