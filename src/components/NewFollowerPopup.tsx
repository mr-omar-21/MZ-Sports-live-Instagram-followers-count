'use client';

import { useEffect, useState } from 'react';

interface NewFollowerPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewFollowerPopup({
  visible,
  onClose,
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
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <div
        className={`bg-[#fdf8f0] rounded-[36px] px-8 py-5 text-center max-w-xs pointer-events-auto ${
          exiting ? 'animate-slide-out-left' : 'animate-slide-in-left'
        }`}
        style={{
          boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        <p className="text-[#005fb6] text-2xl font-anton uppercase tracking-tight">
          NEW FOLLOWER!
        </p>
      </div>
    </div>
  );
}
