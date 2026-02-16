import projectsData from '@/app/api/admin/data/projects.json';

export interface Project {
    id: number;
    title: { [key: string]: string };
    description: { [key: string]: string };
    longDescription: { [key: string]: string };
    tech: string[];
    image: string;
    images?: string[];
    url: string;
    liveUrl?: string;
    features?: { [key: string]: string[] };
    medium: { [key: string]: string };
    span?: string;
    featured?: boolean;
}

export const projects: Project[] = projectsData as Project[];
