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
    if (isPolling && !isNewFollower && count > 0) {
      if (previousCount === null || count !== displayCount) {
        setDisplayCount(count);
      }
    }
  }, [count, isPolling, isNewFollower, previousCount, displayCount]);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#e53935] flex items-center justify-center p-4 sm:p-8">
      <div
        className="bg-white rounded-[24px] w-full max-w-[1100px] flex flex-col lg:flex-row overflow-hidden"
        style={{ boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.5)' }}
      >
        <div className="lg:w-[42%] flex flex-col items-center justify-center py-10 sm:py-14 px-6 sm:px-8">
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
            }}
          >
            <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m-.1 1.5h1.6c.84 0 1.5.66 1.5 1.5v1.6a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 8.5V7a1 1 0 0 1 1.5-1.5M18 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>

          <div className="flex items-center justify-center w-full">
            <QRCode username={username || USERNAME} />
          </div>

          <p className="text-[#43a047] text-2xl sm:text-3xl lg:text-4xl font-anton uppercase tracking-wider text-center leading-tight mt-5">
            FOLLOW US<br />NOW!
          </p>
        </div>

        <div className="w-px bg-black/20 hidden lg:block" />

        <div className="lg:w-[58%] flex flex-col items-center justify-center py-10 sm:py-14 px-6 sm:px-8 min-h-[350px]">
          <h1 className="text-[#1E1E1E] text-xl sm:text-2xl font-anton tracking-wider uppercase">
            MZ SPORTS
          </h1>

          <h2 className="text-[#e53935] text-2xl sm:text-3xl lg:text-4xl font-anton uppercase tracking-wider text-center mt-1 mb-5">
            LIVE FOLLOWERS COUNT
          </h2>

          <div className="w-full flex justify-center mb-5">
            <FollowerCounter value={displayCount} />
          </div>

          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-dot-pulse" />
            <span className="text-[#1E1E1E]/50 text-sm sm:text-base font-anton uppercase tracking-[0.15em]">
              LIVE
            </span>
          </div>

          <span className="text-[#1E1E1E] text-sm sm:text-base font-anton uppercase tracking-wider">
            @{username || USERNAME}
          </span>

          {error && (
            <p className="text-[#e53935] text-xs font-anton mt-2">{error}</p>
          )}
        </div>
      </div>

      <NewFollowerPopup visible={showPopup} onClose={handlePopupClose} />
      <PlusOneAnimation visible={showPlusOne} />
      <Fireworks active={showFireworks} />
    </main>
  );
}
