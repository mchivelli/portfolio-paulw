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
    title: "EpicWars CvC - Minecraft SMP Platform",
    description: "Complete ecosystem for modded Minecraft SMP with 300+ members",
    longDescription: "A comprehensive web platform and game server infrastructure for a modded Minecraft Survival Multiplayer community. Features a full-stack web application with forums, wiki, admin/user management systems, and interconnected features running on a dedicated Ubuntu server.",
    tech: ["Node.js", "React", "MySQL", "Ubuntu Server", "Minecraft Server", "PHP", "JavaScript", "HTML/CSS"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/epicwars-cvc",
    liveUrl: "https://epicwarscvc.com",
    features: [
      "Community forums and wiki",
      "Advanced user/admin management",
      "Server statistics and monitoring",
      "Player progression tracking",
      "Event management system",
      "Integrated mod support",
      "Real-time server status",
      "Custom authentication system"
    ]
  },
  {
    id: 2,
    title: "Minecraft SMP Discord Bot",
    description: "Administrative assistant bot for server management and community engagement",
    longDescription: "A sophisticated Discord bot designed specifically for Minecraft SMP server administration. Enables admins to assign tasks, track progress, manage changelogs, and create announcements with seamless integration to the server ecosystem.",
    tech: ["Node.js", "Discord.js", "SQLite", "JavaScript", "REST API"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/smp-discord-bot",
    features: [
      "Task assignment and tracking",
      "Automated changelog generation",
      "Community announcements",
      "Server status monitoring",
      "Player statistics integration",
      "Moderation tools",
      "Custom command system",
      "Admin permission management"
    ]
  },
  {
    id: 3,
    title: "War 'N Taxes - Minecraft Mod",
    description: "Popular Minecolonies addon with 40,000+ downloads on CurseForge",
    longDescription: "A comprehensive addon mod for Minecolonies that introduces tax generation systems and war mechanics. Downloaded over 40,000 times on CurseForge, this mod adds strategic depth to colony management with economic and military features.",
    tech: ["Java", "Minecraft Forge", "Gradle", "JSON", "Minecolonies API"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/war-n-taxes",
    liveUrl: "https://www.curseforge.com/minecraft/mc-mods/war-n-taxes",
    features: [
      "Tax collection system",
      "War mechanics and combat",
      "Colony economic management",
      "Resource taxation algorithms",
      "Military unit recruitment",
      "Diplomatic relations system",
      "Custom GUI interfaces",
      "Multiplayer compatibility"
    ]
  },
  {
    id: 4,
    title: "Rank Restriction Mod",
    description: "Administrative mod for item/block restrictions based on player ranks",
    longDescription: "A server administration mod that allows admins to set specific item and block restrictions based on player ranks. Fully integrated with FTBRanks for seamless permission management in modded Minecraft servers.",
    tech: ["Java", "Minecraft Forge", "FTBRanks API", "Gradle"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/rank-restriction-mod",
    features: [
      "Rank-based item restrictions",
      "FTBRanks integration",
      "Custom permission rules",
      "Admin configuration GUI",
      "Real-time restriction updates",
      "Whitelist/blacklist system",
      "Multi-server compatibility",
      "Detailed logging system"
    ]
  },
  {
    id: 5,
    title: "Blackjack Card Counter",
    description: "Advanced card counting system with Monte Carlo simulation",
    longDescription: "A sophisticated blackjack card counting application that tracks cards and suggests optimal plays based on various counting systems. Utilizes Monte Carlo simulation for probability calculations and supports multiple counting strategies.",
    tech: ["Python", "NumPy", "Pandas", "Matplotlib", "Monte Carlo", "Tkinter"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/blackjack-counter",
    features: [
      "Multiple counting systems (Hi-Lo, KO, etc.)",
      "Monte Carlo probability simulation",
      "Real-time betting suggestions",
      "Card tracking and statistics",
      "Strategy optimization",
      "Historical analysis",
      "Risk assessment calculations",
      "Custom rule configurations"
    ]
  },
  {
    id: 6,
    title: "Smart Home Assistant (IoT)",
    description: "Local LLM-powered Home Assistant integration for enhanced productivity",
    longDescription: "An intelligent IoT system that integrates with Home Assistant using local LLM technology. Designed to increase productivity and provide a superior home AI experience through natural language processing and automation.",
    tech: ["Python", "Home Assistant", "Local LLM", "MQTT", "Docker", "REST API", "IoT Sensors"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/smart-home-assistant",
    features: [
      "Local LLM integration",
      "Natural language commands",
      "Automated task scheduling",
      "Device state monitoring",
      "Energy usage optimization",
      "Custom automation scripts",
      "Voice command recognition",
      "Privacy-focused processing"
    ]
  },
  {
    id: 7,
    title: "AquaClash - Mobile Naval Game",
    description: "Unity-based mobile naval battle game with strategic combat",
    longDescription: "A mobile naval warfare game developed in Unity featuring strategic ship-to-ship combat, fleet management, and multiplayer battles. Currently in development with focus on engaging gameplay mechanics and stunning maritime visuals.",
    tech: ["Unity", "C#", "Mobile SDK", "Multiplayer Networking", "2D/3D Graphics"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/aquaclash",
    features: [
      "Real-time naval combat",
      "Fleet customization system",
      "Multiplayer battle modes",
      "Strategic positioning mechanics",
      "Ship upgrade systems",
      "Maritime campaign mode",
      "Touch-optimized controls",
      "Cross-platform compatibility"
    ]
  },
  {
    id: 8,
    title: "Advanced Excel Household Budget",
    description: "Comprehensive financial tracking system with intuitive statistics",
    longDescription: "A sophisticated Excel-based household budget tracker that provides comprehensive income and expense monitoring with an intuitive user interface and detailed statistical analysis. Features advanced formulas and beautiful data visualizations.",
    tech: ["Excel VBA", "Advanced Formulas", "Pivot Tables", "Data Visualization", "Macros"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/excel-budget-tracker",
    features: [
      "Automated expense categorization",
      "Income vs expense analysis",
      "Monthly/yearly comparisons",
      "Interactive charts and graphs",
      "Budget forecasting",
      "Custom category creation",
      "Export functionality",
      "Multi-currency support"
    ]
  },
  {
    id: 9,
    title: "Zivildienst Management Platform",
    description: "Community service organization platform with ticket tracking",
    longDescription: "A web-based management system for community service (Zivildienst) operations featuring information dissemination, ticket tracking, weekly cooking assignments, and discussion forums. Currently in development to streamline organizational workflows.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "JWT"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/zivildienst-platform",
    features: [
      "Ticket tracking system",
      "Weekly duty assignments",
      "Discussion forums",
      "User role management",
      "Task scheduling",
      "Document management",
      "Real-time notifications",
      "Reporting dashboard"
    ]
  },
  {
    id: 10,
    title: "Minecraft Mod Collection",
    description: "Suite of specialized Minecraft mods for server enhancement",
    longDescription: "A collection of custom Minecraft mods including Regen Mod for area regeneration, MachiavellianMinigames for SMP server events, and Recruits Addon extending the original Recruits mod functionality.",
    tech: ["Java", "Minecraft Forge", "Gradle", "Mod APIs", "JSON"],
    image: "/img/portrait2.png",
    images: ["/img/portrait2.png", "/img/portrait1.png"],
    url: "https://github.com/paulm/minecraft-mod-collection",
    features: [
      "Area regeneration system (Regen Mod)",
      "Custom minigame framework",
      "Extended recruit mechanics",
      "Server administration tools",
      "Custom event systems",
      "Multi-mod integration",
      "Configuration management",
      "Performance optimization"
    ]
  }
];
