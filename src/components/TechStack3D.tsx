"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { Skill, SkillNames, SKILLS } from "@/src/data/constants";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import { useTheme } from "next-themes";
const Spline = React.lazy(() => import("@splinetool/react-spline"));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const TechStack3D = () => {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    const isMobile = useMediaQuery("(max-width: 768px)");
    const splineContainer = useRef<HTMLDivElement>(null);
    const [splineApp, setSplineApp] = useState<Application>();

    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const initScale = isMobile ? { x: 0.15, y: 0.15, z: 0.15 } : { x: 0.45, y: 0.45, z: 0.45 };
    const initPos = isMobile ? { x: -20, y: -20, z: 0 } : { x: 0, y: -40, z: 0 };
    const initRot = isMobile ? { x: 0, y: Math.PI / 8, z: 0 } : { x: 0, y: Math.PI / 12, z: 0 };

    const handleMouseHover = (e: SplineEvent) => {
        if (!splineApp || selectedSkill?.name === e.target.name) return;

        if (e.target.name === "body" || e.target.name === "platform") {
            setSelectedSkill(null);
            if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
                splineApp.setVariable("heading", "");
                splineApp.setVariable("desc", "");
            }
        } else {
            if (!selectedSkill || selectedSkill.name !== e.target.name) {
                const skill = SKILLS[e.target.name as SkillNames];
                if (skill) setSelectedSkill(skill);
            }
        }
    };

    useEffect(() => {
        if (!selectedSkill || !splineApp) return;
        splineApp.setVariable("heading", selectedSkill.label);
        splineApp.setVariable("desc", selectedSkill.shortDescription);
    }, [selectedSkill, splineApp]);

    useEffect(() => {
        if (!splineApp) return;
        const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
        const textDesktopLight = splineApp.findObjectByName("text-desktop");
        const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
        const textMobileLight = splineApp.findObjectByName("text-mobile");

        if (
            !textDesktopDark ||
            !textDesktopLight ||
            !textMobileDark ||
            !textMobileLight
        )
            return;

        if (theme === "dark" && !isMobile) {
            textDesktopDark.visible = false;
            textDesktopLight.visible = true;
            textMobileDark.visible = false;
            textMobileLight.visible = false;
        } else if (theme === "dark" && isMobile) {
            textDesktopDark.visible = false;
            textDesktopLight.visible = false;
            textMobileDark.visible = false;
            textMobileLight.visible = true;
        } else if (theme === "light" && !isMobile) {
            textDesktopDark.visible = true;
            textDesktopLight.visible = false;
            textMobileDark.visible = false;
            textMobileLight.visible = false;
        } else {
            textDesktopDark.visible = false;
            textDesktopLight.visible = false;
            textMobileDark.visible = true;
            textMobileLight.visible = false;
        }
    }, [theme, splineApp, isMobile]);

    useEffect(() => {
        if (!splineApp) return;

        const revealKeyCaps = async () => {
            const kbd = splineApp.findObjectByName("keyboard");
            if (kbd) {
                gsap.fromTo(
                    kbd.scale,
                    { x: 0.01, y: 0.01, z: 0.01 },
                    {
                        x: initScale.x,
                        y: initScale.y,
                        z: initScale.z,
                        duration: 1.5,
                        ease: "elastic.out(1, 0.6)",
                    }
                );

                gsap.to(kbd.position, { ...initPos, duration: 1 });
                gsap.to(kbd.rotation, { ...initRot, duration: 1 });
            }

            const allObjects = splineApp.getAllObjects();
            const keycaps = allObjects.filter((obj) => obj.name === "keycap");

            await sleep(900);

            if (isMobile) {
                const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
                mobileKeyCaps.forEach((keycap) => {
                    keycap.visible = true;
                });
            } else {
                const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
                desktopKeyCaps.forEach(async (keycap, idx) => {
                    await sleep(idx * 70);
                    keycap.visible = true;
                });
            }

            keycaps.forEach(async (keycap, idx) => {
                keycap.visible = false;
                await sleep(idx * 70);
                keycap.visible = true;
                gsap.fromTo(
                    keycap.position,
                    { y: 200 },
                    { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
                );
            });
        };

        revealKeyCaps();

        splineApp.addEventListener("keyUp", () => {
            // splineApp.setVariable("heading", "");
            // splineApp.setVariable("desc", "");
        });

        splineApp.addEventListener("keyDown", (e) => {
            const skill = SKILLS[e.target.name as SkillNames];
            if (skill) setSelectedSkill(skill);
            splineApp.setVariable("heading", skill ? skill.label : "");
            splineApp.setVariable("desc", skill ? skill.shortDescription : "");
        });

        splineApp.addEventListener("mouseHover", handleMouseHover);

    }, [splineApp, isMobile]);

    return (
        <div className="w-full relative pointer-events-auto mx-auto h-[450px] sm:h-[700px] md:h-[800px] lg:h-[1000px] xl:h-[1200px] max-w-[1800px]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center animate-pulse">Loading 3D Workspace...</div>}>
                <Spline
                    ref={splineContainer}
                    onLoad={(app: Application) => {
                        setSplineApp(app);
                    }}
                    scene="/assets/skills-keyboard.spline"
                />
            </Suspense>
        </div>
    );
};
