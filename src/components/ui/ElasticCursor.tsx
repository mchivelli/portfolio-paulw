"use client";

import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { gsap } from "gsap";
import { useMouse } from "@/src/hooks/use-mouse";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import { useTheme } from "next-themes";

// Gsap Ticker Function
function useTicker(callback: any, paused: boolean) {
    useEffect(() => {
        if (!paused && callback) {
            gsap.ticker.add(callback);
        }
        return () => {
            gsap.ticker.remove(callback);
        };
    }, [callback, paused]);
}

const EMPTY = {} as any;
function useInstance(value = {}) {
    const ref = useRef(EMPTY);
    if (ref.current === EMPTY) {
        ref.current = typeof value === "function" ? value() : value;
    }
    return ref.current;
}

// Function for Mouse Move Scale Change
function getScale(diffX: number, diffY: number) {
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    return Math.min(distance / 735, 0.35);
}

// Function For Mouse Movement Angle in Degrees
function getAngle(diffX: number, diffY: number) {
    return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

function getRekt(el: HTMLElement) {
    if (el.classList.contains("cursor-can-hover"))
        return el.getBoundingClientRect();
    else if (el.parentElement?.classList.contains("cursor-can-hover"))
        return el.parentElement.getBoundingClientRect();
    else if (
        el.parentElement?.parentElement?.classList.contains("cursor-can-hover")
    )
        return el.parentElement.parentElement.getBoundingClientRect();
    return null;
}

const CURSOR_DIAMETER = 50;

export function ElasticCursor() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // React Refs for Jelly Blob and Text
    const jellyRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const { x, y } = useMouse();

    // Save pos and velocity Objects
    const pos = useInstance(() => ({ x: 0, y: 0 }));
    const vel = useInstance(() => ({ x: 0, y: 0 }));
    const set = useInstance();

    // Set GSAP quick setter Values on useLayoutEffect Update
    useLayoutEffect(() => {
        set.x = gsap.quickSetter(jellyRef.current, "x", "px");
        set.y = gsap.quickSetter(jellyRef.current, "y", "px");
        set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
        set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
        set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
        set.width = gsap.quickSetter(jellyRef.current, "width", "px");
    }, []);

    // Start Animation loop
    const loop = useCallback(() => {
        if (!set.width || !set.sx || !set.sy || !set.r) return;
        // Calculate angle and scale based on velocity
        var rotation = getAngle(+vel.x, +vel.y); // Mouse Move Angle
        var scale = getScale(+vel.x, +vel.y); // Blob Squeeze Amount

        // Set GSAP quick setter Values on Loop Function
        if (!isHovering) {
            set.x(pos.x);
            set.y(pos.y);
            set.width(CURSOR_DIAMETER + scale * 300);
            set.r(rotation);
            set.sx(1 + scale);
            set.sy(1 - scale * 2);
        } else {
            set.r(0);
        }
    }, [isHovering]);

    const [cursorMoved, setCursorMoved] = useState(false);
    // Run on Mouse Move
    useLayoutEffect(() => {
        if (isMobile) return;
        // Caluclate Everything Function
        const setFromEvent = (e: MouseEvent) => {
            if (!jellyRef.current) return;
            if (!cursorMoved) {
                setCursorMoved(true);
            }
            const el = e.target as HTMLElement;
            const hoverElemRect = getRekt(el);
            if (hoverElemRect) {
                const rect = el.getBoundingClientRect();
                setIsHovering(true);
                gsap.to(jellyRef.current, {
                    rotate: 0,
                    duration: 0,
                });
                gsap.to(jellyRef.current, {
                    width: rect.width + 20,
                    height: rect.height + 20,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    borderRadius: 10,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)",
                });
            } else {
                gsap.to(jellyRef.current, {
                    borderRadius: 50,
                    width: CURSOR_DIAMETER,
                    height: CURSOR_DIAMETER,
                });
                setIsHovering(false);
            }
            // Mouse X and Y
            const clientX = e.clientX;
            const clientY = e.clientY;

            // Animate Position and calculate Velocity with GSAP
            gsap.to(pos, {
                x: clientX,
                y: clientY,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)",
                onUpdate: () => {
                    vel.x = (clientX - (pos as any).x) * 1.2;
                    vel.y = (clientY - (pos as any).y) * 1.2;
                },
            });

            loop();
        };

        window.addEventListener("mousemove", setFromEvent);
        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    }, [isMobile, cursorMoved, isHovering]);

    useEffect(() => {
        if (!jellyRef.current) return;
        if (!isHovering) {
            jellyRef.current.style.height = `${CURSOR_DIAMETER}px`;
            jellyRef.current.style.borderRadius = "50%";
            jellyRef.current.style.width = `${CURSOR_DIAMETER}px`;
        }
    }, [isHovering]);

    useTicker(loop, !cursorMoved || isMobile);
    if (isMobile) return null;
    // Return UI
    return (
        <>
            <div
                ref={jellyRef}
                id={"jelly-id"}
                className={`fixed left-0 top-0 z-[9999] pointer-events-none will-change-transform translate-x-[-50%] translate-y-[-50%] border-2 ${isDark ? 'border-white' : 'border-black'
                    }`}
                style={{
                    width: `${CURSOR_DIAMETER}px`,
                    height: `${CURSOR_DIAMETER}px`,
                    backdropFilter: "invert(100%)",
                }}
            ></div>
            <div
                className="fixed w-3 h-3 rounded-full z-[9999] translate-x-[-50%] translate-y-[-50%] pointer-events-none transition-none duration-300 bg-transparent"
                style={{
                    top: y,
                    left: x,
                    backdropFilter: "invert(100%)",
                }}
            ></div>
        </>
    );
}

export default ElasticCursor;
