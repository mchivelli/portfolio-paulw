import React, { useState, useEffect } from 'react';
import { RichTerminalContent } from './RichTerminalContent';

interface TypewriterProps {
  text: string;
  speed?: number;
  blink?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const TerminalTypewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 8,
  blink = true,
  onComplete,
  className = "",
}) => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className={`font-mono whitespace-pre-line ${className}`}>
      <RichTerminalContent content={typedText} />
      {blink && currentIndex < text.length && (
        <span className="ml-1 animate-pulse text-terminal-cyan">▋</span>
      )}
    </div>
  );
}; 