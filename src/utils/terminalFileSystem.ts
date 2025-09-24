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
        'admin-dashboard': {
          name: 'admin-dashboard',
          type: 'file',
          preview: 'Full-stack admin dashboard with React + Node.js',
          description: 'A comprehensive admin dashboard with user management, analytics, and real-time data visualization.',
          link: 'https://admin-dashboard-demo.netlify.app',
          content: `# Admin Dashboard

A modern, responsive admin dashboard built with React and Node.js.

## Features:
- User management system
- Real-time analytics
- Data visualization with charts
- Role-based access control
- Dark/Light theme support

## Tech Stack:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JWT tokens
- Charts: Chart.js, D3.js

## Live Demo:
Visit the live application to explore all features.`
        },
        'e-commerce': {
          name: 'e-commerce',
          type: 'file',
          preview: 'Modern e-commerce platform with payment integration',
          description: 'Full-featured e-commerce site with shopping cart, payments, and inventory management.',
          link: 'https://ecommerce-demo.netlify.app',
          content: `# E-commerce Platform

A fully functional e-commerce platform with modern features.

## Features:
- Product catalog with search and filters
- Shopping cart and checkout
- Payment processing (Stripe integration)
- User accounts and order history
- Inventory management
- Responsive design

## Tech Stack:
- Frontend: React, Redux, Styled Components
- Backend: Node.js, Express, PostgreSQL
- Payments: Stripe API
- Deployment: Vercel + Heroku

## Live Demo:
Experience the full shopping workflow.`
        },
        'task-manager': {
          name: 'task-manager',
          type: 'file',
          preview: 'Collaborative task management application',
          description: 'Team collaboration tool with real-time updates and project management features.',
          link: 'https://taskmanager-demo.netlify.app',
          content: `# Task Manager

A collaborative task management application for teams.

## Features:
- Create and organize tasks
- Team collaboration
- Real-time updates
- Project timelines
- File attachments
- Progress tracking

## Tech Stack:
- Frontend: React, Material-UI
- Backend: Node.js, Socket.io
- Database: MongoDB
- Real-time: WebSockets

## Live Demo:
Try the collaborative features with multiple users.`
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
          link: 'https://github.com/paul-m-developer',
          content: 'GitHub: https://github.com/paul-m-developer\n\nExplore my:\n- Open source projects\n- Code samples\n- Contributions to repositories\n- Technical experiments'
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
    return [...baseCommands, ...sectionCommands];
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
