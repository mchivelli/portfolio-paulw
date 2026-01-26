export interface FileSystemNode {
  name: string;
  type: 'directory' | 'file';
  content?: string | React.ReactNode;
  children?: { [key: string]: FileSystemNode };
  link?: string;
  preview?: string;
  description?: string;
}

export const fileSystem: FileSystemNode = {
  name: 'root',
  type: 'directory',
  children: {
    projects: {
      name: 'projects',
      type: 'directory',
      description: 'My portfolio projects',
      children: {
        'epicwars-cvc': {
          name: 'epicwars-cvc',
          type: 'file',
          preview: 'Complete ecosystem for modded Minecraft SMP with 300+ members',
          description: 'A comprehensive web platform and game server infrastructure for a modded Minecraft Survival Multiplayer community.',
          link: 'https://epicwarscvc.com',
          content: `# EpicWars CvC - Minecraft SMP Platform

Complete ecosystem for modded Minecraft SMP with 300+ members.

## Features:
- Community forums and wiki
- Advanced user/admin management
- Server statistics and monitoring
- Player progression tracking
- Event management system
- Integrated mod support
- Real-time server status
- Custom authentication system

## Tech Stack:
- Node.js, React, PostgreSQL
- Ubuntu Server, Minecraft Server
- PHP, JavaScript, HTML/CSS

## Live Site:
[Visit EpicWars CvC](https://epicwarscvc.com)

*Note: Source code is private*`
        },
        'discord-bot': {
          name: 'discord-bot',
          type: 'file',
          preview: 'Administrative assistant bot for server management and community engagement',
          description: 'A sophisticated Discord bot designed specifically for Minecraft SMP server administration.',
          link: 'https://github.com/mchivelli/discordhelper',
          content: `# Minecraft SMP Discord Bot

Administrative assistant bot for server management and community engagement.

## Features:
- Task assignment and tracking
- Automated changelog generation
- Community announcements
- Server status monitoring
- Player statistics integration
- Moderation tools
- Custom command system
- Admin permission management

## Tech Stack:
- Node.js, Discord.js, SQLite
- JavaScript, REST API

## Source Code:
[View on GitHub](https://github.com/mchivelli/discordhelper)`
        },
        'war-n-taxes': {
          name: 'war-n-taxes',
          type: 'file',
          preview: 'Popular Minecolonies addon with 150,000+ downloads on CurseForge',
          description: 'A comprehensive addon mod for Minecolonies that introduces tax generation systems and war mechanics.',
          link: 'https://www.curseforge.com/minecraft/mc-mods/minecolonies-war-n-taxes',
          content: `# War 'N Taxes - Minecraft Mod

Popular Minecolonies addon with 150,000+ downloads on CurseForge.

## Features:
- Tax collection system
- War mechanics and combat
- Colony economic management
- Resource taxation algorithms
- Military unit recruitment
- Diplomatic relations system
- Custom GUI interfaces
- Multiplayer compatibility

## Tech Stack:
- Java, Minecraft Forge, Gradle
- JSON, Minecolonies API

## Links:
- [Download on CurseForge](https://www.curseforge.com/minecraft/mc-mods/minecolonies-war-n-taxes)
- [Source Code](https://github.com/mchivelli/War-N-Taxes-Mod---Minecolonies-Addon)`
        },
        'rank-restrictions': {
          name: 'rank-restrictions',
          type: 'file',
          preview: 'Administrative mod for item/block restrictions based on player ranks',
          description: 'A server administration mod that allows admins to set specific item and block restrictions based on player ranks.',
          link: 'https://github.com/mchivelli/rankrestrictions',
          content: `# Rank Restriction Mod

Administrative mod for item/block restrictions based on player ranks.

## Features:
- Rank-based item restrictions
- FTBRanks integration
- Custom permission rules
- Admin configuration GUI
- Real-time restriction updates
- Whitelist/blacklist system
- Multi-server compatibility
- Detailed logging system

## Tech Stack:
- Java, Minecraft Forge
- FTBRanks API, Gradle

## Source Code:
[View on GitHub](https://github.com/mchivelli/rankrestrictions)

*Status: Coming Soon*`
        },
        'excel-budget': {
          name: 'excel-budget',
          type: 'file',
          preview: 'Comprehensive financial tracking system with intuitive statistics',
          description: 'A sophisticated Excel-based household budget tracker with comprehensive income and expense monitoring.',
          content: `# Advanced Excel Household Budget

Comprehensive financial tracking system with intuitive statistics.

## Features:
- Automated expense categorization
- Income vs expense analysis
- Monthly/yearly comparisons
- Interactive charts and graphs
- Budget forecasting
- Custom category creation
- Export functionality
- Multi-currency support

## Tech Stack:
- Excel VBA, Advanced Formulas
- Pivot Tables, Data Visualization, Macros

## Download:
*Coming soon - will be available for download*`
        },
        'blackjack-bot': {
          name: 'blackjack-bot',
          type: 'file',
          preview: 'Advanced card counting system with Monte Carlo simulation',
          description: 'A sophisticated blackjack card counting application that tracks cards and suggests optimal plays.',
          link: 'https://github.com/mchivelli/bjbot',
          content: `# Blackjack Card Counter

Advanced card counting system with Monte Carlo simulation.

## Features:
- Multiple counting systems (Hi-Lo, KO, etc.)
- Monte Carlo probability simulation
- Real-time betting suggestions
- Card tracking and statistics
- Strategy optimization
- Historical analysis
- Risk assessment calculations
- Custom rule configurations

## Tech Stack:
- Python, NumPy, Pandas
- Matplotlib, Monte Carlo, Tkinter

## Source Code:
[View on GitHub](https://github.com/mchivelli/bjbot)

*Status: Coming Soon*`
        },
        'smart-home': {
          name: 'smart-home',
          type: 'file',
          preview: 'Local LLM-powered Home Assistant integration for enhanced productivity',
          description: 'An intelligent IoT system that integrates with Home Assistant using local LLM technology.',
          link: 'https://github.com/mchivelli/smarter-echo-bot',
          content: `# Smart Home Assistant (IoT)

Local LLM-powered Home Assistant integration for enhanced productivity.

## Features:
- Local LLM integration
- Natural language commands
- Automated task scheduling
- Device state monitoring
- Energy usage optimization
- Custom automation scripts
- Voice command recognition
- Privacy-focused processing

## Tech Stack:
- Python, Home Assistant, Local LLM
- MQTT, Docker, REST API, IoT Sensors

## Source Code:
[View on GitHub](https://github.com/mchivelli/smarter-echo-bot)

*Status: Coming Soon*`
        },
        'aquaclash': {
          name: 'aquaclash',
          type: 'file',
          preview: 'Unity-based mobile naval battle game with strategic combat',
          description: 'A mobile naval warfare game developed in Unity featuring strategic ship-to-ship combat.',
          link: 'https://github.com/mchivelli/AquaClash',
          content: `# AquaClash - Mobile Naval Game

Unity-based mobile naval battle game with strategic combat.

## Features:
- Real-time naval combat
- Fleet customization system
- Multiplayer battle modes
- Strategic positioning mechanics
- Ship upgrade systems
- Maritime campaign mode
- Touch-optimized controls
- Cross-platform compatibility

## Tech Stack:
- Unity, C#, Mobile SDK
- Multiplayer Networking, 2D/3D Graphics

## Source Code:
[View on GitHub](https://github.com/mchivelli/AquaClash)

*Status: Coming Soon*`
        },
        'zivildienst': {
          name: 'zivildienst',
          type: 'file',
          preview: 'Community service organization platform with ticket tracking',
          description: 'A web-based management system for community service (Zivildienst) operations.',
          content: `# Zivildienst Management Platform

Community service organization platform with ticket tracking.

## Features:
- Ticket tracking system
- Weekly duty assignments
- Discussion forums
- User role management
- Task scheduling
- Document management
- Real-time notifications
- Reporting dashboard

## Tech Stack:
- React, Node.js, Express
- PostgreSQL, Socket.io, JWT

*Note: Source code is private*
*Status: Coming Soon*`
        }
      }
    },
    skills: {
      name: 'skills',
      type: 'directory',
      description: 'My technical skills and expertise',
      children: {
        frontend: {
          name: 'frontend',
          type: 'file',
          preview: 'Frontend technologies and frameworks',
          content: `# Frontend Skills

## Languages:
- JavaScript (ES6+)
- TypeScript
- HTML5 & CSS3

## Frameworks & Libraries:
- React.js & React Native
- Next.js
- Vue.js
- Angular

## Styling:
- Tailwind CSS
- Styled Components
- SASS/SCSS
- Material-UI

## Tools:
- Webpack
- Vite
- ESLint & Prettier`
        },
        backend: {
          name: 'backend',
          type: 'file',
          preview: 'Server-side technologies and APIs',
          content: `# Backend Skills

## Languages:
- Node.js
- Python
- Java
- Go

## Frameworks:
- Express.js
- Django
- Spring Boot
- FastAPI

## Databases:
- PostgreSQL
- MongoDB
- Redis
- SQLite

## APIs:
- REST APIs
- GraphQL
- WebSocket`
        },
        devops: {
          name: 'devops',
          type: 'file',
          preview: 'DevOps and deployment technologies',
          content: `# DevOps Skills

## Cloud Platforms:
- AWS (EC2, S3, Lambda)
- Google Cloud Platform
- Microsoft Azure
- Netlify & Vercel

## Containers:
- Docker
- Kubernetes
- Docker Compose

## CI/CD:
- GitHub Actions
- Jenkins
- GitLab CI

## Monitoring:
- Prometheus
- Grafana
- New Relic`
        }
      }
    },
    contact: {
      name: 'contact',
      type: 'directory',
      description: 'Ways to get in touch',
      children: {
        email: {
          name: 'email',
          type: 'file',
          preview: 'paul.m.developer@gmail.com',
          description: 'Send me an email for project inquiries',
          link: 'mailto:paul.m.developer@gmail.com',
          content: 'Email: paul.m.developer@gmail.com\n\nFeel free to reach out for:\n- Project collaboration\n- Job opportunities\n- Technical discussions\n- Freelance work'
        },
        linkedin: {
          name: 'linkedin',
          type: 'file',
          preview: 'Professional networking profile',
          description: 'Connect with me on LinkedIn',
          link: 'https://linkedin.com/in/paul-m-developer',
          content: 'LinkedIn: https://linkedin.com/in/paul-m-developer\n\nConnect with me to:\n- View my professional experience\n- See recommendations\n- Expand your network\n- Discuss opportunities'
        },
        github: {
          name: 'github',
          type: 'file',
          preview: 'Open source contributions and repositories',
          description: 'Check out my code on GitHub',
          link: 'https://github.com/mchivelli',
          content: 'GitHub: https://github.com/mchivelli\n\nExplore my:\n- Open source projects\n- Code samples\n- Contributions to repositories\n- Technical experiments'
        }
      }
    }
  }
};

export function resolvePath(currentPath: string[], relativePath: string): string[] {
  const parts = relativePath.split('/').filter(p => p);
  let newPath = [...currentPath];
  
  for (const part of parts) {
    if (part === '..') {
      if (newPath.length > 0) {
        newPath.pop();
      }
    } else if (part === '~') {
      newPath = [];
    } else if (part !== '.') {
      newPath.push(part);
    }
  }
  
  return newPath;
}

export function getNodeAtPath(path: string[]): FileSystemNode | null {
  let current = fileSystem;
  
  for (const segment of path) {
    if (current.children && current.children[segment]) {
      current = current.children[segment];
    } else {
      return null;
    }
  }
  
  return current;
}

export function getPathString(pathArray: string[]): string {
  if (!pathArray || !Array.isArray(pathArray)) {
    return '~';
  }
  return pathArray.length === 0 ? '~' : `/${pathArray.join('/')}`;
}

export function getAvailableCommands(currentPath: string[]): string[] {
  const baseCommands = ['help', 'clear', 'pwd', 'ls', 'dir', 'cd'];
  
  // Add bare section commands for quick access
  const sectionCommands = ['projects', 'skills', 'contact'];
  
  const node = getNodeAtPath(currentPath);
  
  if (!node || !node.children) {
    return [...baseCommands, ...sectionCommands, 'cd ..', 'cd ~'];
  }
  
  // Add cd commands for subdirectories
  const cdCommands = Object.keys(node.children)
    .filter(name => node.children![name].type === 'directory')
    .map(name => `cd ${name}`);
  
  // Add cat/open commands for files
  const fileCommands = Object.keys(node.children)
    .filter(name => node.children![name].type === 'file')
    .flatMap(name => [`cat ${name}`, `open ${name}`]);
  
  return [...baseCommands, ...sectionCommands, ...cdCommands, ...fileCommands, 'cd ..', 'cd ~'];
}

export function getSuggestedCommands(currentPath: string[]): Array<{ cmd: string; desc: string; icon: string }> {
  
  // Context-aware suggestions based on current directory
  if (currentPath.length === 0) {
    // Root directory - prioritize bare commands for quick access
    return [
      { cmd: 'projects', desc: 'View projects', icon: '🚀' },
      { cmd: 'skills', desc: 'View skills', icon: '⚡' },
      { cmd: 'contact', desc: 'View contact', icon: '📧' },
      { cmd: 'ls', desc: 'List contents', icon: '📋' },
      { cmd: 'help', desc: 'Show help', icon: '❓' },
      { cmd: 'clear', desc: 'Clear terminal', icon: '🧹' }
    ];
  } else if (currentPath[0] === 'projects') {
    if (currentPath.length === 1) {
      // In projects directory - show project names and actions
      const node = getNodeAtPath(currentPath);
      const suggestions = [
        { cmd: 'ls', desc: 'List projects', icon: '📋' },
        { cmd: 'cd ..', desc: 'Go back', icon: '⬅️' }
      ];
      
      // Add individual projects
      if (node && node.children) {
        const projects = Object.keys(node.children).slice(0, 4); // Show first 4 projects
        projects.forEach(projectName => {
          suggestions.push({ cmd: `open ${projectName}`, desc: `Open ${projectName}`, icon: '🚀' });
        });
      }
      
      return suggestions;
    }
  } else if (currentPath[0] === 'skills') {
    if (currentPath.length === 1) {
      // In skills directory - show skill categories
      const node = getNodeAtPath(currentPath);
      const suggestions = [
        { cmd: 'ls', desc: 'List skills', icon: '📋' },
        { cmd: 'cd ..', desc: 'Go back', icon: '⬅️' }
      ];
      
      // Add skill categories
      if (node && node.children) {
        const skills = Object.keys(node.children).slice(0, 4);
        skills.forEach(skillName => {
          suggestions.push({ cmd: `cat ${skillName}`, desc: `View ${skillName}`, icon: '⚡' });
        });
      }
      
      return suggestions;
    }
  } else if (currentPath[0] === 'contact') {
    if (currentPath.length === 1) {
      // In contact directory - show contact methods
      const node = getNodeAtPath(currentPath);
      const suggestions = [
        { cmd: 'ls', desc: 'List contacts', icon: '📋' },
        { cmd: 'cd ..', desc: 'Go back', icon: '⬅️' }
      ];
      
      // Add contact methods
      if (node && node.children) {
        const contacts = Object.keys(node.children);
        contacts.forEach(contactName => {
          suggestions.push({ cmd: `open ${contactName}`, desc: `Open ${contactName}`, icon: '📧' });
        });
      }
      
      return suggestions;
    }
  }
  
  // Default suggestions for any other directory
  return [
    { cmd: 'ls', desc: 'List contents', icon: '📋' },
    { cmd: 'cd ..', desc: 'Go back', icon: '⬅️' },
    { cmd: 'help', desc: 'Show help', icon: '❓' },
    { cmd: 'clear', desc: 'Clear terminal', icon: '🧹' }
  ];
}
