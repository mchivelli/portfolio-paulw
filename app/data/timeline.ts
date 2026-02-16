import timelineData from '@/app/api/admin/data/timeline.json';

export interface TimelineItem {
    id?: number;
    year: string;
    role: { [key: string]: string };
    company: string;
    description: { [key: string]: string };
    tech: string[];
}

export const timeline: TimelineItem[] = timelineData as TimelineItem[];
