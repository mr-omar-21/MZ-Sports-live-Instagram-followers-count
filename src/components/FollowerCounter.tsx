'use client';

import { useMemo } from 'react';
import FlipDigit from './FlipDigit';

interface FollowerCounterProps {
  value: number;
}

function getDigitCount(n: number): number {
  return n.toString().length;
}

function getFontSizeClass(digitCount: number): string {
  if (digitCount <= 3) return 'text-[clamp(5rem, 22vw, 14rem)]';
  if (digitCount <= 4) return 'text-[clamp(4rem, 18vw, 11rem)]';
  if (digitCount <= 5) return 'text-[clamp(3.5rem, 15vw, 9rem)]';
  if (digitCount <= 6) return 'text-[clamp(3rem, 12vw, 7.5rem)]';
  return 'text-[clamp(2.5rem, 10vw, 6rem)]';
}

export default function FollowerCounter({ value }: FollowerCounterProps) {
  const digitCount = useMemo(() => getDigitCount(value), [value]);
  const fontSizeClass = useMemo(() => getFontSizeClass(digitCount), [digitCount]);

  const digits = useMemo(() => {
    return value.toString().split('').map(Number);
  }, [value]);

  return (
    <div className="flex items-center gap-[0.06em] justify-center">
      {digits.map((digit, i) => (
        <div key={i} className={fontSizeClass}>
          <FlipDigit value={digit} delay={i * 60} />
        </div>
      ))}
    </div>
  );
}
