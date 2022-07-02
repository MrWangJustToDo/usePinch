import { RefObject, useEffect } from 'react';

export const useInitialRef = <T, K>({
  pinchRef,
  coverRef,
  deps = [],
}: {
  pinchRef: RefObject<T>;
  coverRef: RefObject<K>;
  deps?: any[];
}) => {
  useEffect(() => {
    if (!pinchRef.current || !(pinchRef.current instanceof HTMLElement)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('current pinch element not exist');
      }
    } else {
      const ele = pinchRef.current;
      ele.style.transformOrigin = '0 0';
      ele.style.willChange = 'transform';
      ele.setAttribute('draggable', 'false');
      ele.setAttribute('data-pinchTarget', 'true');
    }
    if (!coverRef.current || !(coverRef.current instanceof HTMLElement)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('current cover element not exist');
      }
    } else {
      const ele = coverRef.current;
      ele.style.touchAction = 'none';
      ele.setAttribute('data-pinchCover', 'true');
    }
  }, [pinchRef, coverRef, deps]);
};
