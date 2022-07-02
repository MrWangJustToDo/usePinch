import PointerTracker from 'pointer-tracker';
import { useEffect } from 'react';
import { UseTouchType } from './type';

export const useTouch: UseTouchType = ({
  coverRef,
  scaleRef,
  enableTouch,
  action,
  deps = [],
}) => {
  useEffect(() => {
    let twoFingers = false;
    if (
      enableTouch &&
      coverRef.current &&
      coverRef.current instanceof HTMLElement
    ) {
      const ele = coverRef.current;
      const tracker = new PointerTracker(ele, {
        start: (_, event) => {
          if (tracker.currentPointers.length === 2) return false;
          event.preventDefault();
          return true;
        },
        move: prevPointers => {
          if (twoFingers || scaleRef.current) {
            action(prevPointers, tracker.currentPointers);
          }
        },
      });

      const touchStart = (e: TouchEvent) => {
        if (e && e.touches.length >= 2) {
          twoFingers = true;
        } else {
          twoFingers = false;
        }
      };
      const touchEnd = () => {
        // tracker.currentPointers = [];
        twoFingers = false;
      };

      ele.addEventListener('touchend', touchEnd);
      ele.addEventListener('touchstart', touchStart);

      return () => {
        tracker.stop();
        ele.removeEventListener('touchend', touchEnd);
        ele.removeEventListener('touchstart', touchStart);
      };
    }
    return;
  }, [coverRef, scaleRef, enableTouch, action, ...deps]);
};
