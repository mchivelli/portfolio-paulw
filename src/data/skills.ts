export interface Skill {
  name: string;
  level: number; // 1-100
  category: string;
  icon: string;
  color: string;
  description: string;
  yearsOfExperience: number;
  projects?: string[];
}

export interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  description: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    name: "Frontend Development",
    icon: "🎨",
    color: "from-blue-500 to-cyan-500",
    description: "Creating beautiful, responsive user interfaces",
    skills: [
      {
        name: "React",
        level: 95,
        category: "Frontend",
        icon: "⚛️",
        color: "text-blue-400",
        description: "Advanced React development with hooks, context, and modern patterns",
        yearsOfExperience: 4,
        projects: ["Admin Dashboard", "E-commerce Platform", "DeFi Platform"]
      },
      {
        name: "TypeScript",
        level: 90,
        category: "Frontend",
        icon: "📘",
        color: "text-blue-600",
        description: "Type-safe JavaScript development for scalable applications",
        yearsOfExperience: 3,
        projects: ["Admin Dashboard", "Microservices Weather API"]
      },
      {
        name: "Next.js",
        level: 85,
        category: "Frontend",
        icon: "▲",
        color: "text-gray-800",
        description: "Full-stack React framework with SSR/SSG capabilities",
        yearsOfExperience: 2,
        projects: ["E-commerce Platform"]
      },
      {
        name: "Vue.js",
        level: 80,
        category: "Frontend",
        icon: "💚",
        color: "text-green-500",
        description: "Progressive framework for building user interfaces",
        yearsOfExperience: 2,
        projects: ["Task Management App"]
      },
      {
        name: "Tailwind CSS",
        level: 92,
        category: "Frontend",
        icon: "🎨",
        color: "text-cyan-500",
        description: "Utility-first CSS framework for rapid UI development",
        yearsOfExperience: 3,
        projects: ["E-commerce Platform", "Task Management App", "DeFi Platform"]
      },
      {
        name: "D3.js",
        level: 75,
        category: "Frontend",
        icon: "📊",
        color: "text-orange-500",
        description: "Data visualization library for creating interactive charts",
        yearsOfExperience: 2,
        projects: ["Admin Dashboard"]
      }
    ]
  },
  {
    name: "Backend Development",
    icon: "⚙️",
    color: "from-green-500 to-emerald-500",
    description: "Building robust server-side applications and APIs",
    skills: [
      {
        name: "Node.js",
        level: 88,
        category: "Backend",
        icon: "🟢",
        color: "text-green-500",
        description: "Server-side JavaScript runtime for scalable applications",
        yearsOfExperience: 4,
        projects: ["Admin Dashboard", "Microservices Weather API", "DeFi Platform"]
      },
      {
        name: "Python",
        level: 85,
        category: "Backend",
        icon: "🐍",
        color: "text-yellow-500",
        description: "Versatile programming language for backend development and data science",
        yearsOfExperience: 3,
        projects: ["CLI Tool", "Microservices Weather API"]
      },
      {
        name: "PostgreSQL",
        level: 82,
        category: "Backend",
        icon: "🐘",
        color: "text-blue-700",
        description: "Advanced relational database management and optimization",
        yearsOfExperience: 3,
        projects: ["E-commerce Platform", "Microservices Weather API", "DeFi Platform"]
      },
      {
        name: "Redis",
        level: 78,
        category: "Backend",
        icon: "🔴",
        color: "text-red-500",
        description: "In-memory data store for caching and session management",
        yearsOfExperience: 2,
        projects: ["E-commerce Platform", "Microservices Weather API"]
      },
      {
        name: "Express.js",
        level: 90,
        category: "Backend",
        icon: "🚄",
        color: "text-gray-600",
        description: "Minimal and flexible Node.js web application framework",
        yearsOfExperience: 4,
        projects: ["Admin Dashboard", "Microservices Weather API"]
      },
      {
        name: "Firebase",
        level: 80,
        category: "Backend",
        icon: "🔥",
        color: "text-orange-500",
        description: "Backend-as-a-Service platform for rapid development",
        yearsOfExperience: 2,
        projects: ["Task Management App"]
      }
    ]
  },
  {
    name: "DevOps & Cloud",
    icon: "☁️",
    color: "from-purple-500 to-pink-500",
    description: "Infrastructure, deployment, and cloud technologies",
    skills: [
      {
        name: "Docker",
        level: 88,
        category: "DevOps",
        icon: "🐳",
        color: "text-blue-500",
        description: "Containerization for consistent development and deployment",
        yearsOfExperience: 3,
        projects: ["CLI Tool", "Microservices Weather API"]
      },
      {
        name: "Kubernetes",
        level: 75,
        category: "DevOps",
        icon: "⚓",
        color: "text-blue-600",
        description: "Container orchestration for scalable applications",
        yearsOfExperience: 2,
        projects: ["Microservices Weather API"]
      },
      {
        name: "AWS",
        level: 80,
        category: "DevOps",
        icon: "☁️",
        color: "text-orange-400",
        description: "Amazon Web Services for cloud infrastructure",
        yearsOfExperience: 3,
        projects: ["Admin Dashboard", "Microservices Weather API"]
      },
      {
        name: "GitHub Actions",
        level: 85,
        category: "DevOps",
        icon: "🔄",
        color: "text-gray-800",
        description: "CI/CD pipelines for automated testing and deployment",
        yearsOfExperience: 2,
        projects: ["CLI Tool", "E-commerce Platform"]
      },
      {
        name: "Grafana",
        level: 70,
        category: "DevOps",
        icon: "📊",
        color: "text-orange-500",
        description: "Monitoring and observability platform",
        yearsOfExperience: 1,
        projects: ["Microservices Weather API"]
      }
    ]
  },
  {
    name: "Blockchain & Web3",
    icon: "⛓️",
    color: "from-yellow-500 to-orange-500",
    description: "Decentralized applications and smart contracts",
    skills: [
      {
        name: "Solidity",
        level: 82,
        category: "Blockchain",
        icon: "💎",
        color: "text-gray-700",
        description: "Smart contract development for Ethereum blockchain",
        yearsOfExperience: 2,
        projects: ["DeFi Platform"]
      },
      {
        name: "Web3.js",
        level: 78,
        category: "Blockchain",
        icon: "🌐",
        color: "text-blue-500",
        description: "JavaScript library for interacting with Ethereum blockchain",
        yearsOfExperience: 2,
        projects: ["DeFi Platform"]
      },
      {
        name: "Hardhat",
        level: 75,
        category: "Blockchain",
        icon: "⚡",
        color: "text-yellow-500",
        description: "Ethereum development environment for testing and deployment",
        yearsOfExperience: 1,
        projects: ["DeFi Platform"]
      },
      {
        name: "Ethereum",
        level: 80,
        category: "Blockchain",
        icon: "💠",
        color: "text-purple-500",
        description: "Decentralized platform for smart contracts and DApps",
        yearsOfExperience: 2,
        projects: ["DeFi Platform"]
      }
    ]
  },
  {
    name: "Tools & Others",
    icon: "🛠️",
    color: "from-gray-500 to-slate-500",
    description: "Development tools and additional technologies",
    skills: [
      {
        name: "Git",
        level: 95,
        category: "Tools",
        icon: "📝",
        color: "text-orange-500",
        description: "Version control and collaborative development",
        yearsOfExperience: 5,
        projects: ["All Projects"]
      },
      {
        name: "Stripe",
        level: 85,
        category: "Tools",
        icon: "💳",
        color: "text-purple-500",
        description: "Payment processing integration",
        yearsOfExperience: 2,
        projects: ["E-commerce Platform"]
      },
      {
        name: "WebSocket",
        level: 80,
        category: "Tools",
        icon: "🔌",
        color: "text-green-500",
        description: "Real-time bidirectional communication",
        yearsOfExperience: 2,
        projects: ["Admin Dashboard", "Task Management App"]
      },
      {
        name: "scikit-learn",
        level: 70,
        category: "Tools",
        icon: "🤖",
        color: "text-blue-400",
        description: "Machine learning library for Python",
        yearsOfExperience: 1,
        projects: ["Microservices Weather API"]
      }
    ]
  }
];

export const getSkillByName = (name: string): Skill | undefined => {
  for (const category of skillsData) {
    const skill = category.skills.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (skill) return skill;
  }
  return undefined;
};

export const getSkillsByCategory = (categoryName: string): Skill[] => {
  const category = skillsData.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  return category ? category.skills : [];
};

export const getAllSkills = (): Skill[] => {
  return skillsData.flatMap(category => category.skills);
};

export const getTopSkills = (limit: number = 10): Skill[] => {
  return getAllSkills()
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
};
