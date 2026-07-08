'use client';

import { useEffect, useState } from 'react';

interface NewFollowerPopupProps {
  visible: boolean;
  onClose: () => void;
  username?: string;
}

export default function NewFollowerPopup({
  visible,
  onClose,
  username,
}: NewFollowerPopupProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      setExiting(false);
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setInternalVisible(false);
          onClose();
        }, 300);
      }, 4500);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  if (!visible && !internalVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`bg-[#FAF6EE] rounded-[36px] shadow-2xl px-10 py-7 text-center max-w-md w-[90%] pointer-events-auto ${
          exiting ? 'animate-spring-out' : 'animate-spring-in'
        }`}
        style={{
          boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        <p className="text-[#D63031] text-3xl sm:text-4xl font-black uppercase tracking-tight">
          @{username || 'user name'}
        </p>
        <p className="text-[#0984E3] text-2xl sm:text-3xl font-black uppercase tracking-tight mt-2">
          JUST FOLLOWED!
        </p>
      </div>
    </div>
  );
}
