export interface TechStackCategory {
    category: string;
    skills: string[];
}

export const techStackData: TechStackCategory[] = [
    {
        category: "Frontend Development",
        skills: [
            "React 19",
            "TypeScript",
            "Vite",
            "Tailwind CSS",
            "Framer Motion",
            "Radix UI",
            "Lucide React",
            "i18next",
            "React Bits"
        ]
    },
    {
        category: "Backend & Server-Side",
        skills: [
            "Node.js",
            "Express.js",
            "RESTful API",
            "Web Scraping",
            "Authentication (OTP)"
        ]
    },
    {
        category: "DevOps & Infrastructure",
        skills: [
            "Docker",
            "Nginx",
            "Linux/Windows Hybrid",
            "Git"
        ]
    },
    {
        category: "Automation & Integrations",
        skills: [
            "n8n (Workflow Automation)",
            "Moxis (Digital Signatures)",
            "Finmatics (Accounting)",
            "PDF Processing",
            "Multi-Agent Systems"
        ]
    },
    {
        category: "Other Skills",
        skills: [
            "Minecraft Modding (Java)",
            "Database Management",
            "System Architecture"
        ]
    }
];
