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
  if (digitCount <= 3) return 'clamp(8rem, 38vw, 30rem)';
  if (digitCount <= 4) return 'clamp(7rem, 32vw, 26rem)';
  if (digitCount <= 5) return 'clamp(5.5rem, 26vw, 21rem)';
  if (digitCount <= 6) return 'clamp(4.5rem, 22vw, 17rem)';
  return 'clamp(3.5rem, 18vw, 13rem)';
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
