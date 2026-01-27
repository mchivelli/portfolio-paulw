
"use client";
import { useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: string;
}

export const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)"
}: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const { isDark } = useTheme();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-xl border transition-colors duration-200 ${isDark
                ? 'border-neutral-800 bg-neutral-900/50'
                : 'border-neutral-200 bg-white'
                } ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};
