'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'mzsports_follower_count';

export interface FollowerData {
  count: number;
  previousCount: number | null;
  username: string;
  isPolling: boolean;
  error: string | null;
  isNewFollower: boolean;
  isUnfollow: boolean;
}

export function useFollowerTracker() {
  const [data, setData] = useState<FollowerData>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return {
            count: parsed.count || 0,
            previousCount: null,
            username: '',
            isPolling: false,
            error: null,
            isNewFollower: false,
            isUnfollow: false,
          };
        } catch {}
      }
    }
    return {
      count: 0,
      previousCount: null,
      username: '',
      isPolling: false,
      error: null,
      isNewFollower: false,
      isUnfollow: false,
    };
  });

  const pollingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (data.count > 0 && data.isPolling) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: data.count }));
    }
  }, [data.count, data.isPolling]);

  const startWatching = useCallback((username: string) => {
    pollingRef.current = true;
    setData((prev) => ({
      ...prev,
      username,
      isPolling: true,
    }));

    const poll = async () => {
      if (!pollingRef.current) return;
      try {
        const res = await fetch(
          `/api/followers?username=${encodeURIComponent(username)}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch');

        setData((prev) => {
          const prevCount = prev.count;
          const newCount = json.count;
          const isNew = prevCount > 0 && newCount > prevCount;
          const isUnfollow = prevCount > 0 && newCount < prevCount;

          return {
            ...prev,
            count: newCount,
            previousCount: prevCount > 0 ? prevCount : null,
            error: null,
            isNewFollower: isNew,
            isUnfollow,
          };
        });
      } catch (e) {
        setData((prev) => ({
          ...prev,
          error: e instanceof Error ? e.message : 'Connection error',
        }));
      }
    };

    poll();
    const scheduleNext = (p: () => Promise<void>) => {
      const delay = 1500 + Math.random() * 1500;
      timerRef.current = setTimeout(() => {
        p();
        scheduleNext(p);
      }, delay);
    };
    scheduleNext(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      isUnfollow: false,
    });
  }, []);

  const acknowledgeFollower = useCallback(() => {
    setData((prev) => ({ ...prev, isNewFollower: false, isUnfollow: false }));
  }, []);

  return { ...data, startWatching, stopWatching, acknowledgeFollower };
}
