"use client"

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';

export interface StaggeredMenuItem {
    id: string;
    label: string;
    ariaLabel: string;
}
export interface StaggeredMenuSocialItem {
    label: string;
    link: string;
}
export interface StaggeredMenuProps {
    position?: 'left' | 'right';
    colors?: string[];
    items?: StaggeredMenuItem[];
    socialItems?: StaggeredMenuSocialItem[];
    displaySocials?: boolean;
    displayItemNumbering?: boolean;
    className?: string;
    logoUrl?: string;
    menuButtonColor?: string;
    openMenuButtonColor?: string;
    accentColor?: string;
    changeMenuColorOnOpen?: boolean;
    closeOnClickAway?: boolean;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    onItemClick?: (id: string) => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
    position = 'left',
    colors = ['#1a1b26', '#16161e'],
    items = [],
    socialItems = [],
    displaySocials = false,
    displayItemNumbering = true,
    className,
    menuButtonColor = 'hsl(var(--muted-foreground))',
    openMenuButtonColor = '#ffffff',
    changeMenuColorOnOpen = true,
    accentColor = 'hsl(var(--accent))',
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose,
    onItemClick
}: StaggeredMenuProps) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const preLayersRef = useRef<HTMLDivElement | null>(null);
    const preLayerElsRef = useRef<HTMLElement[]>([]);

    const plusHRef = useRef<HTMLSpanElement | null>(null);
    const plusVRef = useRef<HTMLSpanElement | null>(null);
    const iconRef = useRef<HTMLSpanElement | null>(null);

    const textInnerRef = useRef<HTMLSpanElement | null>(null);
    const textWrapRef = useRef<HTMLSpanElement | null>(null);
    const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);
    const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
    const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
    const colorTweenRef = useRef<gsap.core.Tween | null>(null);

    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
    const busyRef = useRef(false);

    const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

    const [mounted, setMounted] = useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!mounted || !panelRef.current) return;

        try {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            const toggle = toggleBtnRef.current;
            const offscreen = position === 'left' ? -100 : 100;

            gsap.set(panel, { xPercent: offscreen });

            if (preContainer) {
                const preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
                if (preLayers.length > 0) {
                    gsap.set(preLayers, { xPercent: offscreen });
                    preLayerElsRef.current = preLayers as HTMLElement[];
                }
            }

            if (plusHRef.current) gsap.set(plusHRef.current, { transformOrigin: '50% 50%', rotate: 0 });
            if (plusVRef.current) gsap.set(plusVRef.current, { transformOrigin: '50% 50%', rotate: 90 });
            if (iconRef.current) gsap.set(iconRef.current, { rotate: 0, transformOrigin: '50% 50%' });
            if (textInnerRef.current) gsap.set(textInnerRef.current, { yPercent: 0 });
            // Replaced GSAP color mutation to prevent crash
        } catch (e) {
            console.error("GSAP useLayoutEffect error:", e);
        }

        return () => {
            gsap.killTweensOf(panelRef.current);
            gsap.killTweensOf(preLayerElsRef.current);
        };
    }, [mounted, menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        const numberEls = Array.from(
            panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            if (ls && ls.el) {
                tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
            }
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        if (itemEls.length) {
            const itemsStartRatio = 0.05;
            const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 0.65, ease: 'power4.out', stagger: { each: 0.04, from: 'start' } },
                itemsStart
            );

            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.4, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.04, from: 'start' } },
                    itemsStart + 0.05
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;

            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => {
                            gsap.set(socialLinks, { clearProps: 'opacity' });
                        }
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, [position]);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all: HTMLElement[] = [...layers, panel];
        closeTweenRef.current?.kill();

        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

                const numberEls = Array.from(
                    panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
                ) as HTMLElement[];
                if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

                const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
                const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

                busyRef.current = false;
            }
        });
    }, [position]);

    const animateIcon = useCallback((opening: boolean) => {
        const icon = iconRef.current;
        const h = plusHRef.current;
        const v = plusVRef.current;
        if (!icon || !h || !v) return;

        spinTweenRef.current?.kill();

        if (opening) {
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power4.out' } })
                .to(h, { rotate: 45, duration: 0.5 }, 0)
                .to(v, { rotate: -45, duration: 0.5 }, 0);
        } else {
            spinTweenRef.current = gsap
                .timeline({ defaults: { ease: 'power3.inOut' } })
                .to(h, { rotate: 0, duration: 0.35 }, 0)
                .to(v, { rotate: 90, duration: 0.35 }, 0)
                .to(icon, { rotate: 0, duration: 0.001 }, 0);
        }
    }, []);

    const animateColor = useCallback(
        (opening: boolean) => {
            // Replaced GSAP color animation with React state/inline styles
        },
        []
    );

    React.useEffect(() => {
        // Removed gsap.set color to avoid crashing Next.js GSAP parser
    }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

    const animateText = useCallback((opening: boolean) => {
        const inner = textInnerRef.current;
        if (!inner) return;

        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const cycles = 3;

        const seq: string[] = [currentLabel];
        let last = currentLabel;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);

        setTextLines(seq);
        gsap.set(inner, { yPercent: 0 });

        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;

        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.5 + lineCount * 0.07,
            ease: 'power4.out'
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateIcon(target);
        animateColor(target);
        animateText(target);
    }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            onMenuClose?.();
            playClose();
            animateIcon(false);
            animateColor(false);
            animateText(false);
        }
    }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                toggleBtnRef.current &&
                !toggleBtnRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickAway, open, closeMenu]);

    return (
        <div className={`sm-scope relative ${className || ''}`}>
            {/* The main button that toggles the menu */}
            <button
                ref={toggleBtnRef}
                className={`sm-toggle relative -translate-x-3 items-center gap-[0.5rem] bg-transparent border-0 cursor-pointer font-medium leading-[1rem] overflow-visible pointer-events-auto transform -rotate-90 origin-center transition-colors duration-300 hover:text-foreground ${open ? 'flex' : 'flex'
                    }`}
                style={{ color: changeMenuColorOnOpen ? (open ? openMenuButtonColor : menuButtonColor) : menuButtonColor }}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="staggered-menu-panel"
                onClick={toggleMenu}
                type="button"
            >
                <span
                    ref={iconRef}
                    className="sm-icon relative w-[16px] h-[16px] shrink-0 inline-flex items-center justify-center will-change-transform mt-[0.1em]"
                    aria-hidden="true"
                >
                    <span
                        ref={plusHRef}
                        className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    />
                    <span
                        ref={plusVRef}
                        className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    />
                </span>
                <span
                    ref={textWrapRef}
                    className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap"
                    aria-hidden="true"
                >
                    <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                        {textLines.map((l, i) => (
                            <span className="sm-toggle-line block h-[1em] leading-none text-[12px] tracking-[0.2em] uppercase align-top" key={i}>
                                {l}
                            </span>
                        ))}
                    </span>
                </span>
            </button>

            {/* The full-screen menu overlay rendered in a portal */}
            {mounted && typeof document !== 'undefined' ? createPortal(
                <div className="sm-scope">
                    <div
                        className="staggered-menu-wrapper fixed inset-0 z-[40] pointer-events-none data-[open]:pointer-events-auto"
                        style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
                        data-position={position}
                        data-open={open || undefined}
                    >
                        <div
                            ref={preLayersRef}
                            className="sm-prelayers absolute top-0 left-0 bottom-0 pointer-events-none z-[5]"
                            aria-hidden="true"
                        >
                            {(() => {
                                const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e24', '#2a2a35'];
                                let arr = [...raw];
                                if (arr.length >= 3) {
                                    const mid = Math.floor(arr.length / 2);
                                    arr.splice(mid, 1);
                                }
                                return arr.map((c, i) => (
                                    <div
                                        key={i}
                                        className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                                        style={{ background: c }}
                                    />
                                ));
                            })()}
                        </div>

                        <aside
                            id="staggered-menu-panel"
                            ref={panelRef}
                            className="staggered-menu-panel absolute top-0 left-0 h-full bg-background flex flex-col pt-32 pb-8 px-[10vw] overflow-y-auto z-10 
                               backdrop-blur-[12px] pointer-events-auto shadow-2xl border-r border-border/10"
                            style={{ WebkitBackdropFilter: 'blur(12px)' }}
                            aria-hidden={!open}
                        >
                            <div className="sm-panel-inner flex-1 flex flex-col justify-center h-full gap-5">
                                <ul
                                    className="sm-panel-list list-none m-0 p-0 flex flex-col gap-4"
                                    role="list"
                                    data-numbering={displayItemNumbering || undefined}
                                >
                                    {items && items.length ? (
                                        items.map((it, idx) => (
                                            <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                                                <a
                                                    className="sm-panel-item group relative text-foreground font-semibold text-[2.5rem] md:text-[4rem] cursor-pointer 
                                                       leading-[1.1] tracking-[-0.03em] uppercase transition-[background,color] duration-150 ease-linear 
                                                       inline-block no-underline pr-[1.4em] hover:text-[hsl(var(--accent))]"
                                                    href={`#${it.id || ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (onItemClick && it.id) onItemClick(it.id);
                                                        closeMenu();
                                                    }}
                                                    aria-label={it.ariaLabel || it.label}
                                                    data-index={idx + 1}
                                                >
                                                    <span className="sm-panel-itemLabel inline-block transform-gpu will-change-transform origin-bottom text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                                        {it.label}
                                                    </span>
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                                            <span className="sm-panel-item relative text-black font-semibold text-[3rem] sm:text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                                                <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                                    No items
                                                </span>
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>, document.body) : null}

            <style>{`
.sm-scope .staggered-menu-wrapper { position: fixed; width: 100vw; height: 100vh; z-index: 40; pointer-events: none; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid hsl(var(--accent)); outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-toggle-textInner { font-family: var(--font-mono), monospace; font-weight: 500;}
.sm-scope .staggered-menu-panel { width: 100vw; }
.sm-scope .sm-prelayers { width: 100vw; z-index: 5; }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: "0" counter(smItem); position: absolute; top: 0.1em; right: 2.2em; font-size: 14px; font-weight: 400; font-family: var(--font-mono), monospace; color: hsl(var(--accent)); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
            `}</style>
        </div>
    );
};

export default StaggeredMenu;
