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
    mockup?: boolean;
    /** Real product screenshots rendered in laptop/tablet/phone frames (tablet + phone optional) */
    devices?: { laptop: string; tablet?: string; phone?: string };
    /** Captioned screenshot gallery */
    gallery?: { src: string; caption: { [key: string]: string } }[];
    /** Headline numbers shown as a stat band */
    stats?: { value: string; label: { [key: string]: string } }[];
    /** Named code-rendered visual when no screenshot exists (e.g. "io-panel") */
    visual?: string;
}

export const projects: Project[] = projectsData as Project[];
