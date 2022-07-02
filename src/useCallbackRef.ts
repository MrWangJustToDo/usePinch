import { useCallback, useRef } from 'react';

export const useCallbackRef = <T extends any[] = any[], K = any>(fn: (...args: T) => K) => {
  const callbackRef = useRef(fn);
  callbackRef.current = fn;
  return useCallback(
    (...args: T) => callbackRef.current.call(null, ...args),
    []
  );
};
