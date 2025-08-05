import React from 'react';

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const timelineData: TimelineEntry[] = [
  {
    title: "2024",
    content: React.createElement('div', {}, [
      React.createElement('p', { 
        key: 'p1',
        className: "mb-8 text-xs font-normal text-terminal-cyan md:text-sm" 
      }, "Senior Full-Stack Developer - Leading innovative web applications with modern technologies"),
      React.createElement('div', { 
        key: 'skills',
        className: "mb-6 space-y-2" 
      }, [
        React.createElement('div', { 
          key: 's1',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon1', className: "text-terminal-cyan" }, "▶"),
          "React, TypeScript, Node.js, Python"
        ]),
        React.createElement('div', { 
          key: 's2',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon2', className: "text-terminal-cyan" }, "▶"),
          "Microservices, Docker, Kubernetes, AWS"
        ]),
        React.createElement('div', { 
          key: 's3',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon3', className: "text-terminal-cyan" }, "▶"),
          "Blockchain, DeFi, Smart Contracts"
        ])
      ]),
      React.createElement('div', { 
        key: 'images',
        className: "grid grid-cols-2 gap-4" 
      }, [
        React.createElement('img', {
          key: 'img1',
          src: "/img/portrait1.png",
          alt: "Portfolio Project",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img2',
          src: "/img/portrait2.png",
          alt: "Development Work",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img3',
          src: "/img/portrait1.png",
          alt: "Technical Architecture",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img4',
          src: "/img/portrait2.png",
          alt: "Innovation Projects",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        })
      ])
    ]),
  },
  {
    title: "2022-2023",
    content: React.createElement('div', {}, [
      React.createElement('p', { 
        key: 'p1',
        className: "mb-8 text-xs font-normal text-terminal-cyan md:text-sm" 
      }, "Full-Stack Developer - Specialized in modern web technologies and scalable architectures"),
      React.createElement('p', { 
        key: 'p2',
        className: "mb-8 text-xs font-normal text-terminal-cyan/80 md:text-sm" 
      }, "Led development of multiple high-performance applications using React, Node.js, and cloud technologies."),
      React.createElement('div', { 
        key: 'images',
        className: "grid grid-cols-2 gap-4" 
      }, [
        React.createElement('img', {
          key: 'img1',
          src: "/img/portrait2.png",
          alt: "Web Development",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img2',
          src: "/img/portrait1.png",
          alt: "System Design",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img3',
          src: "/img/portrait2.png",
          alt: "API Development",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img4',
          src: "/img/portrait1.png",
          alt: "Database Optimization",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        })
      ])
    ]),
  },
  {
    title: "2020-2021",
    content: React.createElement('div', {}, [
      React.createElement('p', { 
        key: 'p1',
        className: "mb-4 text-xs font-normal text-terminal-cyan md:text-sm" 
      }, "Junior Developer - Started journey in professional software development"),
      React.createElement('div', { 
        key: 'achievements',
        className: "mb-8" 
      }, [
        React.createElement('div', { 
          key: 'a1',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon1', className: "text-terminal-cyan" }, "✓"),
          "Mastered JavaScript and modern frameworks"
        ]),
        React.createElement('div', { 
          key: 'a2',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon2', className: "text-terminal-cyan" }, "✓"),
          "Built first full-stack applications"
        ]),
        React.createElement('div', { 
          key: 'a3',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon3', className: "text-terminal-cyan" }, "✓"),
          "Learned cloud deployment and DevOps"
        ]),
        React.createElement('div', { 
          key: 'a4',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon4', className: "text-terminal-cyan" }, "✓"),
          "Contributed to open-source projects"
        ]),
        React.createElement('div', { 
          key: 'a5',
          className: "flex items-center gap-2 text-xs text-terminal-green md:text-sm" 
        }, [
          React.createElement('span', { key: 'icon5', className: "text-terminal-cyan" }, "✓"),
          "Developed problem-solving and debugging skills"
        ])
      ]),
      React.createElement('div', { 
        key: 'images',
        className: "grid grid-cols-2 gap-4" 
      }, [
        React.createElement('img', {
          key: 'img1',
          src: "/img/portrait1.png",
          alt: "Learning Journey",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img2',
          src: "/img/portrait2.png",
          alt: "First Projects",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img3',
          src: "/img/portrait1.png",
          alt: "Team Collaboration",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        }),
        React.createElement('img', {
          key: 'img4',
          src: "/img/portrait2.png",
          alt: "Skill Development",
          width: 500,
          height: 500,
          className: "h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
        })
      ])
    ]),
  },
];