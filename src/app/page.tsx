'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import FollowerCounter from '@/components/FollowerCounter';
import NewFollowerPopup from '@/components/NewFollowerPopup';
import PlusOneAnimation from '@/components/PlusOneAnimation';
import Fireworks from '@/components/Fireworks';
import QRCode from '@/components/QRCode';
import { useFollowerTracker } from '@/hooks/useFollowerTracker';

const USERNAME = 'mzsports_tz';

export default function Home() {
  const {
    count,
    previousCount,
    isPolling,
    error,
    isNewFollower,
    username,
    startWatching,
    acknowledgeFollower,
  } = useFollowerTracker();

  const startedRef = useRef(false);

  const [displayCount, setDisplayCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      startWatching(USERNAME);
    }
  }, [startWatching]);

  useEffect(() => {
    if (isNewFollower) {
      setShowPopup(true);
      setShowPlusOne(true);
      setShowFireworks(true);

      const t1 = setTimeout(() => {
        setShowPlusOne(false);
        setShowFireworks(false);
        setDisplayCount(count);
      }, 3000);

      const t2 = setTimeout(() => {
        setShowPopup(false);
        acknowledgeFollower();
      }, 5500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isNewFollower, count, acknowledgeFollower]);

  useEffect(() => {
    if (
      isPolling &&
      !isNewFollower &&
      count > 0
    ) {
      if (previousCount === null || count !== displayCount) {
        setDisplayCount(count);
      }
    }
  }, [count, isPolling, isNewFollower, previousCount, displayCount]);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#e53935] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="bg-[#fdf8f0] rounded-[32px] sm:rounded-[40px] w-full max-w-md flex flex-col items-center py-10 sm:py-12 px-6 sm:px-8"
        style={{ boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.7)' }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
          }}
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m-.1 1.5h1.6c.84 0 1.5.66 1.5 1.5v1.6a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 8.5V7a1 1 0 0 1 1.5-1.5M18 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          </svg>
        </div>

        <div className="flex items-center justify-center w-full mb-4">
          <QRCode username={username || USERNAME} />
        </div>

        <p className="text-[#43a047] text-2xl sm:text-3xl md:text-4xl font-anton uppercase tracking-wider text-center leading-tight mb-6">
          FOLLOW US<br />NOW!
        </p>

        <div className="w-full h-px bg-[#1E1E1E]/20 mb-5" />

        <h1 className="text-[#1E1E1E] text-lg sm:text-xl font-anton tracking-wider uppercase">
          MZ SPORTS
        </h1>

        <h2 className="text-[#e53935] text-xl sm:text-2xl md:text-3xl font-anton uppercase tracking-wider mb-4">
          LIVE FOLLOWERS COUNT
        </h2>

        <div className="w-full flex justify-center mb-4">
          <FollowerCounter value={displayCount} />
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
          <span className="text-[#1E1E1E]/50 text-sm font-medium uppercase tracking-[0.15em] font-anton">
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#1E1E1E] text-sm font-anton uppercase tracking-wider">
            @{username || USERNAME}
          </span>
        </div>

        {error && (
          <p className="text-[#e53935] text-xs font-anton mt-2">{error}</p>
        )}
      </div>

      <NewFollowerPopup visible={showPopup} onClose={handlePopupClose} />
      <PlusOneAnimation visible={showPlusOne} />
      <Fireworks active={showFireworks} />
    </main>
  );
}
