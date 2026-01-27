
"use client";
import React from 'react';
import { SpotlightCard } from './spotlight-card';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TimelineCardProps {
    type: 'work' | 'education';
    title: string;
    company?: string;
    description?: string;
    date: string;
    location?: string;
    focus?: string;
    images?: string[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
    type,
    title,
    company,
    description,
    date,
    location,
    focus,
    images = []
}) => {
    const { isDark } = useTheme();
    const isWork = type === 'work';

    // Dynamic colors based on type
    const accentColor = isWork ? 'text-primary-purple' : 'text-primary-yellow';
    const bgColor = isDark
        ? (isWork ? 'bg-primary-purple/10' : 'bg-primary-yellow/10')
        : (isWork ? 'bg-primary-purple/5' : 'bg-primary-yellow/5');
    const borderColor = isWork ? 'border-primary-purple/20' : 'border-primary-yellow/20';
    const spotlightColor = isWork ? 'rgba(168, 85, 247, 0.2)' : 'rgba(234, 179, 8, 0.2)';

    return (
        <SpotlightCard
            className={`h-full ${isDark ? 'bg-black/40' : 'bg-white/50'} border-opacity-50`}
            spotlightColor={spotlightColor}
        >
            <div className="p-6 md:p-8 flex flex-col gap-4 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-xl h-fit ${bgColor} ${borderColor} border shadow-lg backdrop-blur-sm`}>
                            {isWork ? (
                                <Briefcase className={`w-6 h-6 ${accentColor}`} />
                            ) : (
                                <GraduationCap className={`w-6 h-6 ${accentColor}`} />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                            {company && (
                                <p className={`text-lg font-medium ${accentColor}`}>
                                    {company}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit h-fit
             ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'} border`}>
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span>{date}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-3 pl-0 md:pl-[4.5rem]">
                    {focus && (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                            {focus}
                        </div>
                    )}

                    {description && (
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {description}
                        </p>
                    )}

                    {location && (
                        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{location}</span>
                        </div>
                    )}

                    {/* Images Section */}
                    {images && images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                    <img
                                        src={img}
                                        alt={`${company} - image ${idx + 1}`}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};
