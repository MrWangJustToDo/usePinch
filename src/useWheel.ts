import { useEffect } from 'react';
import { UseWheelType } from './type';

export const useWheel: UseWheelType = ({
  coverRef,
  action,
  enableWheel,
  deps = [],
}) => {
  useEffect(() => {
    if (
      enableWheel &&
      coverRef.current &&
      coverRef.current instanceof HTMLElement
    ) {
      const ele = coverRef.current;
      ele.addEventListener('wheel', action);
      return () => ele.removeEventListener('wheel', action);
    }
    return;
  }, [coverRef, action, enableWheel, ...deps]);
};
