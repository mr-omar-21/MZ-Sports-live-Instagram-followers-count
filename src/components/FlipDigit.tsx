'use client';

import { useEffect, useState } from 'react';

interface FlipDigitProps {
  value: number;
  delay?: number;
}

export default function FlipDigit({ value, delay = 0 }: FlipDigitProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      const t1 = setTimeout(() => {
        setFlipping(true);
        const t2 = setTimeout(() => {
          setDisplayValue(value);
          setFlipping(false);
        }, 350);
        return () => clearTimeout(t2);
      }, delay);
      return () => clearTimeout(t1);
    }
  }, [value, delay, displayValue]);

  return (
    <div className="relative inline-flex items-center justify-center w-[1em] h-[1.35em] bg-[#1E1E1E] rounded-[0.08em] overflow-hidden select-none">
      <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#1E1E1E]/60 z-10" />
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10 z-10" />
      <span
        className={`absolute inset-0 flex items-center justify-center text-white font-bold transition-all duration-[350ms] ease-in-out origin-bottom ${
          flipping
            ? 'opacity-0 -translate-y-1/2 scale-y-0'
            : 'opacity-100 translate-y-0 scale-y-100'
        }`}
        style={{ transformOrigin: 'bottom center' }}
      >
        {displayValue}
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center text-white font-bold transition-all duration-[350ms] ease-out origin-top ${
          flipping
            ? 'opacity-100 translate-y-0 scale-y-100'
            : 'opacity-0 translate-y-1/2 scale-y-0'
        }`}
        style={{ transformOrigin: 'top center' }}
      >
        {value}
      </span>
    </div>
  );
}
