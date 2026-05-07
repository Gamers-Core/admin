'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCounterOptions {
  duration?: number;
  onComplete?: () => void;
}

export const useCounter = ({ duration = 30, onComplete }: UseCounterOptions = {}) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const isActive = count > 0;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    setCount(duration);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clear();
          onCompleteRef.current?.();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [duration, clear]);

  useEffect(() => clear, [clear]);

  return { count, isActive, start };
};
