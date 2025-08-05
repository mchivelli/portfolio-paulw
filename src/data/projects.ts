export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  image: string;
  images?: string[];
  url: string;
  liveUrl?: string;
  features?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Admin Dashboard",
    description: "Modern analytics platform with real-time data visualization",
    longDescription: "A comprehensive admin dashboard built with React and TypeScript, featuring real-time data updates, interactive charts, and a responsive design. Integrated with various APIs to provide meaningful insights.",
    tech: ["React", "TypeScript", "D3.js", "Node.js", "WebSocket"],
    image: "/img/portrait1.png",
    images: ["/img/portrait1.png", "/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/admin-dashboard",
    liveUrl: "https://dashboard.example.com",
    features: [
      "Real-time data synchronization",
      "Interactive D3.js visualizations",
      "User permission management",
      "Export functionality"
    ]
  },
  {
    id: 2,
    title: "CLI Tool",
    description: "Developer productivity toolkit for automated workflows",
    longDescription: "A powerful command-line interface tool designed to streamline development workflows. Features include automated testing, deployment scripts, and custom task runners.",
    tech: ["Python", "Click", "Docker", "GitHub Actions"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/cli-tool",
    features: [
      "Automated testing pipeline",
      "Docker container management",
      "Custom script execution",
      "Plugin architecture"
    ]
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description: "Full-stack shopping experience with payment integration",
    longDescription: "A modern e-commerce platform built with Next.js and integrated with Stripe for secure payment processing. Features include inventory management, order tracking, and customer analytics.",
    tech: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Tailwind CSS"],
    image: "/img/portrait1.png",
    images: ["/img/portrait1.png", "/img/portrait2.png"],
    url: "https://github.com/paulm/ecommerce",
    liveUrl: "https://shop.example.com",
    features: [
      "Secure payment processing",
      "Real-time inventory updates",
      "Order tracking system",
      "Customer analytics dashboard"
    ]
  },
  {
    id: 4,
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates",
    longDescription: "A Trello-inspired task management application with drag-and-drop functionality, real-time collaboration, and team analytics.",
    tech: ["Vue.js", "Firebase", "Vuex", "Tailwind CSS"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/task-manager",
    features: [
      "Drag-and-drop interface",
      "Real-time collaboration",
      "Team analytics",
      "Custom workflows"
    ]
  },
  {
    id: 5,
    title: "Microservices Weather API",
    description: "Scalable microservices architecture for weather data aggregation and ML-powered forecasting",
    longDescription: "A robust, scalable weather API service built with microservices architecture. Aggregates data from multiple sources, provides machine learning-powered forecasting, and features intelligent caching, rate limiting, and comprehensive monitoring.",
    tech: ["Node.js", "Express", "Redis", "Docker", "Kubernetes", "Python", "scikit-learn", "PostgreSQL", "Grafana"],
    image: "/img/portrait1.png",
    images: ["/img/portrait1.png", "/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/microservices-weather-api",
    liveUrl: "https://weather-api.paulm.dev",
    features: [
      "Microservices architecture",
      "ML-powered weather forecasting",
      "Multiple data source aggregation",
      "Intelligent caching with Redis",
      "Advanced rate limiting",
      "Comprehensive API documentation",
      "Real-time monitoring and alerts",
      "Auto-scaling capabilities"
    ]
  },
  {
    id: 6,
    title: "Blockchain DeFi Platform",
    description: "Decentralized finance platform with yield farming, staking, and portfolio management",
    longDescription: "A comprehensive DeFi platform built on Ethereum, featuring yield farming protocols, staking mechanisms, and advanced portfolio management tools. Includes smart contracts, web3 integration, and real-time market data.",
    tech: ["Solidity", "React", "Web3.js", "Hardhat", "Node.js", "PostgreSQL", "Tailwind CSS", "Ethereum"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/defi-platform",
    liveUrl: "https://defi.paulm.dev",
    features: [
      "Smart contract development",
      "Yield farming protocols",
      "Staking and rewards system",
      "Portfolio tracking and analytics",
      "Multi-wallet integration",
      "Real-time market data",
      "Liquidity pool management",
      "Security audited contracts"
    ]
  }
];
