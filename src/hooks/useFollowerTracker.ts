'use client';

import { useState, useRef, useCallback } from 'react';

export interface FollowerData {
  count: number;
  previousCount: number | null;
  username: string;
  isPolling: boolean;
  error: string | null;
  isNewFollower: boolean;
}

export function useFollowerTracker() {
  const [data, setData] = useState<FollowerData>({
    count: 0,
    previousCount: null,
    username: '',
    isPolling: false,
    error: null,
    isNewFollower: false,
  });

  const pollingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const startWatching = useCallback((username: string) => {
    pollingRef.current = true;
    setData({
      count: 0,
      previousCount: null,
      username,
      isPolling: true,
      error: null,
      isNewFollower: false,
    });

    const poll = async () => {
      if (!pollingRef.current) return;
      try {
        const res = await fetch(
          `/api/followers?username=${encodeURIComponent(username)}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();

        setData((prev) => {
          const prevCount = prev.count;
          const newCount = json.count;
          const isNew = prevCount > 0 && newCount > prevCount;

          return {
            ...prev,
            count: newCount,
            previousCount: prevCount > 0 ? prevCount : null,
            error: null,
            isNewFollower: isNew,
          };
        });
      } catch {
        setData((prev) => ({ ...prev, error: 'Connection error' }));
      }
    };

    poll();
    scheduleNext(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleNext = (poll: () => Promise<void>) => {
    const delay = 5000 + Math.random() * 5000;
    timerRef.current = setTimeout(() => {
      poll();
      scheduleNext(poll);
    }, delay);
  };

  const stopWatching = useCallback(() => {
    pollingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setData({
      count: 0,
      previousCount: null,
      username: '',
      isPolling: false,
      error: null,
      isNewFollower: false,
    });
  }, []);

  const acknowledgeFollower = useCallback(() => {
    setData((prev) => ({ ...prev, isNewFollower: false }));
  }, []);

  return { ...data, startWatching, stopWatching, acknowledgeFollower };
}
