import { Pointer } from 'pointer-tracker';
import { RefObject } from 'react';

interface DepsProps {
  deps?: any[];
}

export interface UsePinchProps<PinchRef, CoverRef> extends DepsProps {
  maxScale?: number;
  minScale?: number;
  startScale?: () => void;
  endScale?: () => void;
  enableWheel?: boolean;
  enableTouch?: boolean;
  forWardPinchRef?: RefObject<PinchRef>;
  forWardCoverRef?: RefObject<CoverRef>;
}

export interface UsePinchType {
  <PinchRef extends HTMLElement, CoverRef extends HTMLElement>(
    props?: UsePinchProps<PinchRef, CoverRef>
  ): {
    pinchRef: RefObject<PinchRef>;
    coverRef: RefObject<CoverRef>;
    scaleState: boolean;
  };
}

export interface UseWheelProps extends DepsProps {
  enableWheel: boolean;
  coverRef: RefObject<HTMLElement>;
  action: (event?: WheelEvent) => void;
}

export interface UseWheelType {
  (props: UseWheelProps): void;
}

export interface UseTouchProps extends DepsProps {
  enableTouch: boolean;
  scaleRef: RefObject<boolean>;
  coverRef: RefObject<HTMLElement>;
  action: (prePointers: Pointer[], curePointers: Pointer[]) => void;
}

export interface UseTouchType {
  (props: UseTouchProps): void;
}
