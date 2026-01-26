"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      // Use ResizeObserver to avoid forced reflows
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use requestAnimationFrame to batch DOM updates
          requestAnimationFrame(() => {
            setHeight(entry.contentRect.height);
          });
        }
      });
      
      resizeObserver.observe(ref.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Group entries by individual year sections and 'PRESENT'

  const byYearMap = new Map<string, React.ReactNode[]>();
  const addToGroup = (key: string, node: React.ReactNode) => {
    const arr = byYearMap.get(key) ?? [];
    arr.push(node);
    byYearMap.set(key, arr);
  };

  data.forEach((d) => {
    const title = d.title;
    const hasPresent = /present/i.test(title);
    const nums = (title.match(/\d{4}/g) || []).map((n) => parseInt(n, 10));

      if (hasPresent) {
      // Only show in PRESENT to avoid duplicating into numeric years
      addToGroup("PRESENT", d.content);
    } else if (nums.length >= 2) {
      const start = Math.min(...nums);
      const end = Math.max(...nums);
      for (let y = start; y <= end; y++) {
        addToGroup(String(y), d.content);
      }
    } else if (nums.length === 1) {
      addToGroup(String(nums[0]), d.content);
    } else {
      // Fallback if no year detected
      addToGroup("PRESENT", d.content);
    }
  });

  const numericYears = Array.from(byYearMap.keys())
    .filter((k) => k !== "PRESENT" && /^\d{4}$/.test(k))
    .map((k) => parseInt(k, 10))
    .sort((a, b) => b - a);

  const groupedData: TimelineEntry[] = [
    ...(byYearMap.has("PRESENT")
      ? [
          {
            title: "PRESENT",
            content: (
              <div className="space-y-12">
                {(byYearMap.get("PRESENT") || []).map((c, i) => (
                  <div key={`present-${i}`} className="space-y-4">
                    {c}
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...numericYears.map((y) => ({
      title: String(y),
      content: (
        <div className="space-y-12">
          {(byYearMap.get(String(y)) || []).map((c, i) => (
            <div key={`${y}-${i}`} className="space-y-4">
              {c}
            </div>
          ))}
        </div>
      ),
    })),
  ];

  return (
    <div
      className={`relative w-full font-mono md:px-10 text-[15px] md:text-base leading-relaxed transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
          : 'gradient-bg'
      }`}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className={`text-lg md:text-4xl mb-4 glow-text max-w-4xl font-bold ${
          isDark ? 'text-primary-blue' : 'text-primary-blue'
        }`}>
          Education & Work Experience
        </h2>
        <p className={`text-sm md:text-base max-w-sm ${
          isDark ? 'text-primary-blue/70' : 'text-light-text-secondary'
        }`}>
          A comprehensive timeline of my education and professional experience.
        </p>
        <div className="mt-4">
          <a
            href="/Paul_Mchivelli_CV.pdf"
            download
            className={`inline-flex items-center gap-2 border rounded-md px-3 py-2 transition-colors ${
              isDark 
                ? 'text-primary-blue border-primary-blue/40 hover:bg-primary-blue/10' 
                : 'text-primary-blue border-primary-blue/40 hover:bg-primary-blue/5'
            }`}
          >
            <span>{t('timeline.download')}</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {groupedData.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-12 absolute left-3 md:left-3 w-12 rounded-full bg-gradient-to-br from-primary-blue/20 to-primary-yellow/20 border border-primary-blue/50 shadow-[0_0_24px_rgba(59,130,246,0.15)] flex items-center justify-center">
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-primary-blue shadow-lg shadow-primary-blue/50" />
              </div>
              <h3 className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold glow-text ${
                isDark ? 'text-primary-blue' : 'text-primary-blue'
              }`}>
                {item.title} -
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className={`md:hidden block text-2xl mb-4 text-left font-bold glow-text ${
                isDark ? 'text-primary-blue' : 'text-primary-blue'
              }`}>
                {item.title} -
              </h3>
              <motion.div 
                className={`timeline-card timeline-content rounded-xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 card-bg ${
                  isDark 
                    ? 'bg-gradient-to-br from-black/60 to-gray-900/60 border border-terminal-border/30 shadow-[0_0_24px_rgba(34,42,53,0.08)] hover:shadow-primary-blue/20' 
                    : 'bg-white/90 border border-light-border/30 shadow-[0_0_24px_rgba(59,130,246,0.08)] hover:shadow-primary-blue/15'
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {item.content}
              </motion.div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-terminal-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary-blue via-primary-purple to-primary-yellow from-[0%] via-[50%] rounded-full shadow-lg shadow-primary-blue/50"
          />
        </div>
      </div>
    </div>
  );
};