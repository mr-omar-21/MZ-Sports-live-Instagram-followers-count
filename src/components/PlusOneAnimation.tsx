'use client';

import { useEffect, useState } from 'react';

interface PlusOneAnimationProps {
  visible: boolean;
}

export default function PlusOneAnimation({ visible }: PlusOneAnimationProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (visible) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 2500);
      return () => clearTimeout(t);
    } else {
      setActive(false);
    }
  }, [visible]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <span
        className="animate-plus-one font-anton"
        style={{
          fontSize: 'clamp(6rem, 25vw, 15rem)',
          background: 'linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 40px rgba(253,29,29,0.6)) drop-shadow(0 0 80px rgba(131,58,180,0.4))',
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        +1
      </span>
    </div>
  );
}
