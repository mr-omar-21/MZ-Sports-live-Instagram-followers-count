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
    <main className="min-h-screen animate-gradient-bg flex items-center justify-center p-6 sm:p-10">
      <div
        className="bg-white rounded-[24px] w-[95%] sm:w-[92%] lg:w-[88%] max-w-[1800px] flex flex-col lg:flex-row overflow-hidden min-h-[70vh] lg:min-h-[75vh]"
        style={{ boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.5)' }}
      >
        <div className="lg:w-[40%] flex flex-col items-center justify-center py-12 sm:py-16 px-8 sm:px-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
            }}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m-.1 1.5h1.6c.84 0 1.5.66 1.5 1.5v1.6a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 8.5V7a1 1 0 0 1 1.5-1.5M18 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>

          <div className="flex items-center justify-center w-full">
            <QRCode username={username || USERNAME} />
          </div>

          <TypewriterText
            text="FOLLOW US NOW!"
            tag="p"
            speed={60}
            loopDelay={10000}
            cursor={false}
            className="text-[#43a047] font-anton uppercase tracking-wider text-center leading-tight mt-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)' }}
          />
        </div>

        <div className="w-px bg-black/20 hidden lg:block" />

        <div className="lg:w-[60%] flex flex-col items-center justify-center py-12 sm:py-16 px-8 sm:px-12 min-h-[400px]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E1E1E] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl sm:text-2xl leading-none">MZ</span>
            </div>
            <h1 className="text-[#1E1E1E] font-anton tracking-wider uppercase"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
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
            className="text-[#e53935] font-anton uppercase tracking-wider text-center mt-2 mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)' }}
          />

          <div className="w-full flex justify-center mb-6">
            <FollowerCounter value={displayCount} />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-dot-pulse" />
            <span className="text-[#1E1E1E]/50 font-anton uppercase tracking-[0.15em]"
              style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)' }}
            >
              LIVE
            </span>
          </div>

          <span className="text-[#1E1E1E] font-anton uppercase tracking-wider"
            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)' }}
          >
            @{username || USERNAME}
          </span>

          {error && (
            <p className="text-[#e53935] font-anton mt-3" style={{ fontSize: 'clamp(0.7rem, 1vw, 0.9rem)' }}>{error}</p>
          )}
        </div>
      </div>

      <NewFollowerPopup visible={showPopup} onClose={handlePopupClose} />
      <PlusOneAnimation visible={showPlusOne} />
      <Fireworks active={showFireworks} />
    </main>
  );
}
