import React from 'react';
import { TerminalImagePreview } from './TerminalImagePreview';

interface RichTerminalContentProps {
  content: string | React.ReactNode;
  className?: string;
}

export const RichTerminalContent: React.FC<RichTerminalContentProps> = ({ content, className = '' }) => {
  if (typeof content !== 'string') {
    return <div className={`font-mono whitespace-pre-line leading-relaxed ${className}`}>{content}</div>;
  }

  // Simple and reliable parser
  const parseContent = (text: string): React.ReactNode => {
    // First, replace emojis with terminal-friendly symbols
    let processedText = text
      .replace(/💡/g, '◆')
      .replace(/🚀/g, '▲')
      .replace(/⚡/g, '◆')
      .replace(/✅/g, '✓')
      .replace(/📊/g, '■')
      .replace(/🔥/g, '▼')
      .replace(/💎/g, '◇')
      .replace(/👁️/g, '◈')
      .replace(/📬/g, '●')
      .replace(/👨‍💻/g, '◆')
      .replace(/🗑/g, '×')
      .replace(/📁/g, '□')
      .replace(/🎯/g, '◉')
      .replace(/⭐/g, '★');

    const lines = processedText.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Handle headers
      if (line.match(/^### (.+)$/)) {
        const match = line.match(/^### (.+)$/);
        result.push(
          <h3 key={index} className="text-lg font-bold text-terminal-cyan glow-text mb-2 mt-4">
            {match![1].trim()}
          </h3>
        );
        return;
      }

      if (line.match(/^## (.+)$/)) {
        const match = line.match(/^## (.+)$/);
        result.push(
          <h2 key={index} className="text-xl font-bold text-terminal-green glow-text mb-3 mt-4">
            {match![1].trim()}
          </h2>
        );
        return;
      }

      if (line.match(/^# (.+)$/)) {
        const match = line.match(/^# (.+)$/);
        result.push(
          <h1 key={index} className="text-2xl font-bold text-yellow-400 glow-text mb-4 mt-4">
            {match![1].trim()}
          </h1>
        );
        return;
      }

      // Handle lists
      if (line.match(/^- (.+)$/)) {
        const match = line.match(/^- (.+)$/);
        const content = parseInlineContent(match![1]);
        result.push(
          <div key={index} className="flex items-start my-1">
            <span className="text-terminal-cyan mr-2">▸</span>
            <span>{content}</span>
          </div>
        );
        return;
      }

      // Handle image tags
      const imgMatch = line.match(/\[IMG:([^\]]*)\]\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
      if (imgMatch) {
        const [, alt, url, image, title, desc] = imgMatch;
        result.push(
          <div key={index} className="my-2">
            <TerminalImagePreview 
              text={alt}
              images={[image]}
              title={title}
              description={desc}
              url={url}
              type="contact"
            />
          </div>
        );
        return;
      }

      // Handle code blocks
      if (line.match(/^```/)) {
        result.push(
          <div key={index} className="bg-black/50 border border-terminal-cyan/30 rounded p-3 my-2 text-terminal-cyan font-mono text-sm whitespace-pre-wrap">
            {line.replace(/```/g, '')}
          </div>
        );
        return;
      }

      // Handle regular lines with inline formatting
      if (line.trim()) {
        result.push(
          <div key={index} className="my-1">
            {parseInlineContent(line)}
          </div>
        );
      } else {
        result.push(<div key={index} className="h-4" />);
      }
    });

    return result;
  };

  const parseInlineContent = (text: string): React.ReactNode => {
    const elements: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // Process patterns one by one
    const patterns = [
      // Color codes
      {
        regex: /\{cyan\}([^{]+)\{\/cyan\}/g,
        render: (match: string, content: string) => 
          <span key={key++} className="text-terminal-cyan glow-text">{content}</span>
      },
      {
        regex: /\{green\}([^{]+)\{\/green\}/g,
        render: (match: string, content: string) => 
          <span key={key++} className="text-terminal-green glow-text">{content}</span>
      },
      {
        regex: /\{yellow\}([^{]+)\{\/yellow\}/g,
        render: (match: string, content: string) => 
          <span key={key++} className="text-yellow-400 glow-text">{content}</span>
      },
      {
        regex: /\{red\}([^{]+)\{\/red\}/g,
        render: (match: string, content: string) => 
          <span key={key++} className="text-red-400 glow-text">{content}</span>
      },
      // Bold text
      {
        regex: /\*\*([^*]+)\*\*/g,
        render: (match: string, content: string) => 
          <strong key={key++} className="text-terminal-green font-bold glow-text">{content}</strong>
      },
      // Italic text
      {
        regex: /\*([^*]+)\*/g,
        render: (match: string, content: string) => 
          <em key={key++} className="text-terminal-cyan/80 italic">{content}</em>
      },
      // Image tags first (before regular links)
      {
        regex: /\[IMG:([^\]]*)\]\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
        render: (match: string, alt: string, url: string, image: string, title: string, desc: string) => 
          <TerminalImagePreview 
            key={key++}
            text={alt}
            images={[image]}
            title={title}
            description={desc}
            url={url}
            type="contact"
          />
      },
      // CD command links (special handling)
      {
        regex: /\[([^\]]+)\]\(cd-([^)]+)\)/g,
        render: (match: string, text: string, destination: string) => 
          <button 
            key={key++} 
            onClick={() => {
              // Execute cd command
              const event = new CustomEvent('executeCommand', { detail: { command: `cd ${destination}` } });
              window.dispatchEvent(event);
            }}
            className="text-terminal-cyan hover:text-terminal-green underline transition-colors cursor-pointer glow-text bg-transparent border-none font-mono"
          >
            {text}
          </button>
      },
      // Regular Links
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/g,
        render: (match: string, text: string, url: string) => 
          <a key={key++} href={url} className="text-terminal-cyan hover:text-terminal-green underline transition-colors cursor-pointer glow-text" target="_blank" rel="noopener noreferrer">
            {text}
          </a>
      },
      // Progress bars
      {
        regex: /\[PROGRESS:(\d+)\]/g,
        render: (match: string, percentage: string) => {
          const percent = parseInt(percentage);
          const color = percent >= 80 ? 'bg-terminal-green' : percent >= 60 ? 'bg-yellow-400' : 'bg-red-400';
          return (
            <span key={key++} className="inline-flex items-center ml-2">
              <span className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <span className={`h-full ${color} transition-all duration-300 block`} style={{ width: `${percent}%` }}></span>
              </span>
              <span className="ml-2 text-xs text-terminal-cyan">{percent}%</span>
            </span>
          );
        }
      },
      // Inline code
      {
        regex: /`([^`]+)`/g,
        render: (match: string, code: string) => 
          <code key={key++} className="bg-black/50 text-terminal-cyan px-1 rounded text-sm border border-terminal-cyan/30">{code}</code>
      }
    ];

    // Apply patterns sequentially
    let parts = [currentText];
    
    patterns.forEach(pattern => {
      const newParts: (string | React.ReactNode)[] = [];
      
      parts.forEach(part => {
        if (typeof part === 'string') {
          let lastIndex = 0;
          let match;
          const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
          
          while ((match = regex.exec(part)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
              newParts.push(part.substring(lastIndex, match.index));
            }
            
            // Add rendered component
            newParts.push(pattern.render(match[0], ...match.slice(1)));
            
            lastIndex = regex.lastIndex;
          }
          
          // Add remaining text
          if (lastIndex < part.length) {
            newParts.push(part.substring(lastIndex));
          }
        } else {
          newParts.push(part);
        }
      });
      
      parts = newParts;
    });

    return parts.filter(p => p !== '').map((part, i) => 
      <React.Fragment key={i}>{part}</React.Fragment>
    );
  };

  return (
    <div className={`font-mono whitespace-pre-line leading-relaxed ${className}`}>
      {parseContent(content)}
    </div>
  );
};