'use client';

import { useMemo } from 'react';
import FlipDigit from './FlipDigit';

interface FollowerCounterProps {
  value: number;
}

function getDigitCount(n: number): number {
  return n.toString().length;
}

function getFontSize(digitCount: number): string {
  if (digitCount <= 3) return 'clamp(3.5rem, 16vw, 12rem)';
  if (digitCount <= 4) return 'clamp(3rem, 12vw, 10rem)';
  if (digitCount <= 5) return 'clamp(2.5rem, 10vw, 8rem)';
  if (digitCount <= 6) return 'clamp(2rem, 8vw, 6.5rem)';
  return 'clamp(1.75rem, 6.5vw, 5.5rem)';
}

export default function FollowerCounter({ value }: FollowerCounterProps) {
  const digitCount = useMemo(() => getDigitCount(value), [value]);
  const fontSize = useMemo(() => getFontSize(digitCount), [digitCount]);

  const digits = useMemo(() => {
    return value.toString().split('').map(Number);
  }, [value]);

  return (
    <div className="flex items-center justify-center" style={{ gap: '0.06em' }}>
      {digits.map((digit, i) => (
        <div key={i} style={{ fontSize }}>
          <FlipDigit value={digit} delay={i * 60} />
        </div>
      ))}
    </div>
  );
}
