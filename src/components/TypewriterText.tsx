'use client';

import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  speed?: number;
  deleteSpeed?: number;
  loopDelay?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
}

export default function TypewriterText({
  text,
  className = '',
  tag: Tag = 'p',
  speed = 50,
  deleteSpeed = 30,
  loopDelay = 10000,
  cursor = true,
  style,
}: TypewriterTextProps) {
  const [displayedChars, setDisplayedChars] = useState(text.length);
  const [phase, setPhase] = useState<'typing' | 'deleting' | 'waiting'>('typing');
  const indexRef = useRef(text.length);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    indexRef.current = text.length;
    setDisplayedChars(text.length);
    setPhase('waiting');

    const typeChar = () => {
      if (indexRef.current >= text.length) {
        setPhase('waiting');
        const holdTimer = setTimeout(() => {
          setPhase('deleting');
          deleteChar();
        }, loopDelay);
        timerRef.current = holdTimer;
        return;
      }

      indexRef.current++;
      setDisplayedChars(indexRef.current);
      const variance = speed * (0.5 + Math.random() * 1);
      timerRef.current = setTimeout(typeChar, variance);
    };

    const deleteChar = () => {
      if (indexRef.current <= 0) {
        setPhase('typing');
        typeChar();
        return;
      }

      indexRef.current--;
      setDisplayedChars(indexRef.current);
      const variance = deleteSpeed * (0.5 + Math.random() * 1);
      timerRef.current = setTimeout(deleteChar, variance);
    };

    const readyTimer = setTimeout(() => {
      setPhase('deleting');
      deleteChar();
    }, loopDelay);

    timerRef.current = readyTimer;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, deleteSpeed, loopDelay]);

  if (text.length === 0) return null;

  return (
    <Tag className={className} style={style}>
      {text.slice(0, displayedChars)}
      {cursor && (
        <span className="inline-block w-[0.05em] h-[0.85em] bg-current ml-[0.04em] align-middle animate-typewriter-cursor" />
      )}
    </Tag>
  );
}
