'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import FollowerCounter from '@/components/FollowerCounter';
import NewFollowerPopup from '@/components/NewFollowerPopup';
import PlusOneAnimation from '@/components/PlusOneAnimation';
import Fireworks from '@/components/Fireworks';
import QRCode from '@/components/QRCode';
import TypewriterText from '@/components/TypewriterText';
import { useFollowerTracker } from '@/hooks/useFollowerTracker';

const USERNAME = 'mzsports_tz';

export default function Home() {
  const {
    count,
    previousCount,
    isPolling,
    error,
    isNewFollower,
    isUnfollow,
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
    if (isUnfollow) {
      setDisplayCount(count);
      const t = setTimeout(() => acknowledgeFollower(), 300);
      return () => clearTimeout(t);
    }
  }, [isUnfollow, count, acknowledgeFollower]);

  useEffect(() => {
    if (isPolling && !isNewFollower && !isUnfollow && count > 0) {
      if (previousCount === null || count !== displayCount) {
        setDisplayCount(count);
      }
    }
  }, [count, isPolling, isNewFollower, isUnfollow, previousCount, displayCount]);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <main className="min-h-screen animate-gradient-bg flex items-center justify-center p-3 sm:p-6 lg:p-10">
      <div
        className="bg-white rounded-[16px] sm:rounded-[24px] w-full sm:w-[95%] lg:w-[88%] max-w-[1800px] flex flex-col lg:flex-row overflow-hidden min-h-screen sm:min-h-[70vh] lg:min-h-[75vh]"
        style={{ boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Mobile: stacked column. Desktop: left panel (40%) */}
        <div className="lg:w-[40%] flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12">
          <img
            src="/instagram-logo.png"
            alt="Instagram"
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3 sm:mb-4 lg:mb-5 object-contain"
          />

          <div className="flex items-center justify-center w-full max-w-[300px] sm:max-w-none">
            <QRCode username={username || USERNAME} />
          </div>

          <TypewriterText
            text="FOLLOW US NOW!"
            tag="p"
            speed={60}
            loopDelay={10000}
            cursor={false}
            className="text-[#43a047] font-anton uppercase tracking-wider text-center leading-tight mt-4 sm:mt-5 lg:mt-6"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 4.2rem)' }}
          />
        </div>

        <div className="w-px bg-black/20 hidden lg:block" />

        {/* Mobile: stacked column. Desktop: right panel (60%) */}
        <div className="lg:w-[60%] flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12 min-h-[300px] sm:min-h-[400px]">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <img
              src="/mz-logo.png"
              alt="MZ Sports"
              className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain shrink-0"
            />
            <h1 className="text-[#1E1E1E] font-anton tracking-wider uppercase"
              style={{ fontSize: 'clamp(1rem, 3vw, 2.2rem)' }}
            >
              MZ SPORTS
            </h1>
          </div>

          <TypewriterText
            text="LIVE FOLLOWERS COUNT"
            tag="h2"
            speed={50}
            loopDelay={10000}
            cursor={false}
            className="text-[#e53935] font-anton uppercase tracking-wider text-center mt-1 sm:mt-2 mb-4 sm:mb-6"
            style={{ fontSize: 'clamp(1.2rem, 5vw, 4.2rem)' }}
          />

          <div className="w-full flex justify-center mb-4 sm:mb-6 overflow-x-auto">
            <FollowerCounter value={displayCount} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-dot-pulse" />
            <span className="text-[#1E1E1E]/50 font-anton uppercase tracking-[0.15em]"
              style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1.1rem)' }}
            >
              LIVE
            </span>
          </div>

          <span className="text-[#1E1E1E] font-anton uppercase tracking-wider"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 1.1rem)' }}
          >
            @{username || USERNAME}
          </span>

          {error && (
            <p className="text-[#e53935] font-anton mt-3" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.9rem)' }}>{error}</p>
          )}
        </div>
      </div>

      <NewFollowerPopup visible={showPopup} onClose={handlePopupClose} />
      <PlusOneAnimation visible={showPlusOne} />
      <Fireworks active={showFireworks} />
    </main>
  );
}
