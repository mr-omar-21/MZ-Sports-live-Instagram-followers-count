'use client';

import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  speed?: number;
  loopDelay?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
}

export default function TypewriterText({
  text,
  className = '',
  tag: Tag = 'p',
  speed = 50,
  loopDelay = 10000,
  cursor = true,
  style,
}: TypewriterTextProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'paused'>('typing');
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedChars(0);
    setPhase('typing');

    const typeChar = () => {
      if (indexRef.current >= text.length) {
        const holdTimer = setTimeout(() => {
          setPhase('paused');
          const pauseTimer = setTimeout(() => {
            indexRef.current = 0;
            setDisplayedChars(0);
            setPhase('typing');
          }, 200);
          timerRef.current = pauseTimer;
        }, loopDelay);
        timerRef.current = holdTimer;
        return;
      }

      indexRef.current++;
      setDisplayedChars(indexRef.current);
      const variance = speed * (0.5 + Math.random() * 1);
      timerRef.current = setTimeout(typeChar, variance);
    };

    timerRef.current = setTimeout(typeChar, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, loopDelay]);

  if (text.length === 0) return null;

  return (
    <Tag className={className} style={style}>
      {text.slice(0, displayedChars)}
      {cursor && phase !== 'paused' && (
        <span className="inline-block w-[0.05em] h-[0.85em] bg-current ml-[0.04em] align-middle animate-typewriter-cursor" />
      )}
    </Tag>
  );
}
