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
  const [celebrationPhase, setCelebrationPhase] = useState<
    'idle' | 'celebrating' | 'flipping' | 'done'
  >('idle');

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      startWatching(USERNAME);
    }
  }, [startWatching]);

  useEffect(() => {
    if (isNewFollower) {
      setCelebrationPhase('celebrating');
      setShowPopup(true);
      setShowPlusOne(true);
      setShowFireworks(true);

      const t1 = setTimeout(() => {
        setShowPlusOne(false);
        setShowFireworks(false);
        setCelebrationPhase('flipping');
        setDisplayCount(count);
      }, 3000);

      const t2 = setTimeout(() => {
        setCelebrationPhase('done');
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
      count > 0 &&
      celebrationPhase === 'idle'
    ) {
      if (previousCount === null || count < previousCount || count === previousCount) {
        setDisplayCount(count);
      }
    }
  }, [count, isPolling, isNewFollower, previousCount, celebrationPhase]);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  if (!isPolling) {
    return (
      <main className="min-h-screen bg-[#D63031] flex items-center justify-center">
        <div className="bg-[#FAF6EE] rounded-[40px] px-8 py-10 text-center" style={{ boxShadow: '0px 10px 20px rgba(0,0,0,0.25)' }}>
          <p className="text-[#1E1E1E] text-xl font-semibold">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#D63031] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-stretch gap-5 sm:gap-6">
        <div
          className="bg-[#FAF6EE] rounded-[32px] sm:rounded-[40px] flex-1 lg:max-w-[42%] flex flex-col items-center py-8 sm:py-10 px-5 sm:px-6"
          style={{ boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)' }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
            }}
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m-.1 1.5h1.6c.84 0 1.5.66 1.5 1.5v1.6a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 8.5V7a1 1 0 0 1 1.5-1.5M18 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </div>

          <div className="w-12 h-[2px] bg-[#1E1E1E] mb-4" />

          <p className="text-[#2ECC71] text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-center leading-tight">
            FOLLOW US<br />NOW!
          </p>

          <div className="mt-5 sm:mt-6 flex-1 flex items-center justify-center w-full">
            <QRCode username={username || USERNAME} />
          </div>
        </div>

        <div
          className="bg-[#FAF6EE] rounded-[32px] sm:rounded-[40px] flex-1 lg:max-w-[58%] flex flex-col items-center justify-center py-8 sm:py-10 px-5 sm:px-8 gap-5 sm:gap-6 min-h-[320px]"
          style={{ boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1E1E1E] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">MZ</span>
            </div>
          <h1 className="text-[#1E1E1E] text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            MZ SPORTS
          </h1>
        </div>

        <h2 className="text-[#D63031] text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          LIVE FOLLOWERS COUNT
        </h2>

          <div className="animate-fade-in-up w-full flex justify-center">
            <FollowerCounter value={displayCount} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
            <span className="text-[#1E1E1E]/50 text-sm font-medium uppercase tracking-[0.15em]">
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#1E1E1E] font-bold text-base uppercase tracking-wider">
              @{username || USERNAME}
            </span>
          </div>

          {error && (
            <p className="text-[#D63031] text-sm font-semibold">{error}</p>
          )}
        </div>
      </div>

      <NewFollowerPopup visible={showPopup} onClose={handlePopupClose} username={username || USERNAME} />
      <PlusOneAnimation visible={showPlusOne} />
      <Fireworks active={showFireworks} />
    </main>
  );
}
