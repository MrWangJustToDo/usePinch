import { useRef } from 'react';
import { Pointer } from 'pointer-tracker';
import { pinchHelper } from './util';
import { useBool } from './useBool';
import { useWheel } from './useWheel';
import { useTouch } from './useTouch';
import { useMatrix } from './useMatrix';
import { useInitialRef } from './useInitial';
import { useCallbackRef } from './useCallbackRef';
import type { UsePinchProps, UsePinchType } from './type';

interface SetTransformOpts {
  scale?: number;
  x?: number;
  y?: number;
}

interface ApplyChangeOpts {
  panX?: number;
  panY?: number;
  scaleDiff?: number;
  originX?: number;
  originY?: number;
}

export const usePinch: UsePinchType = <PinchRef extends HTMLElement, CoverRef extends HTMLElement>(props: UsePinchProps<PinchRef, CoverRef> = {}) => {
  const {maxScale = 8, minScale = 1, startScale, endScale, enableTouch = true, enableWheel = true, forWardPinchRef, forWardCoverRef, deps} = props;
  const {bool: scaleState, onEnable: show, onDisable: hide} = useBool(false)
  const pinchRef = useRef<PinchRef>(null);
  const coverRef = useRef<CoverRef>(null);
  const scaleRef = useRef<boolean>(false);

  const targetPinchRef = forWardPinchRef || pinchRef;
  const targetCoverRef = forWardCoverRef || coverRef;

  const matrix = useMatrix();

  const updateTransform = useCallbackRef((scale: number, x: number, y: number) => {
    const { current: item } = targetPinchRef;
      if (!item) return;

      if (scale > maxScale) return;

      item.dataset.scale = scale.toString();

      if (matrix.current) {
        const target = matrix.current;
        if (scale === target.a && x === target.e && y === target.f) return;
        if (scale <= minScale) {
          if (scaleRef.current) {
            target.e = 0;
            target.f = 0;
            target.a = 1;
            target.d = 1;
            hide();
            scaleRef.current = false;
            if (endScale) endScale();
          }
          item.style.transform = 'translate(0px, 0px) scale(1)';
        } else {
          if (!scaleRef.current) {
            scaleRef.current = true;
            show();
            if (startScale) startScale();
          }
          target.e = x;
          target.f = y;
          target.a = scale;
          target.d = scale;
          item.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        }
      }
  })

  const setTransform = useCallbackRef(
    (opts: SetTransformOpts = {}) => {
      if (matrix.current) {
        const target = matrix.current;
        const { scale = target.a } = opts;
        let { x = target.e, y = target.f } = opts;
        const { current: item } = targetPinchRef;
        const { current: cover } = targetCoverRef;

        // If we don't have an element to position, just set the value as given.
        // We'll check bounds later.
        if (!item || !cover) {
          updateTransform(scale, x, y);
          return;
        } else if (cover && item) {
          // Get current layout
          const thisBounds = cover.getBoundingClientRect();
          const positioningElBounds = item.getBoundingClientRect();

          // Not displayed. May be disconnected or display:none.
          // Just take the values, and we'll check bounds later.
          if (!thisBounds.width || !thisBounds.height) {
            updateTransform(scale, x, y);
            return;
          }

          // Create points for _positioningEl.
          let topLeft = pinchHelper.createPoint();
          topLeft.x = positioningElBounds.left - thisBounds.left;
          topLeft.y = positioningElBounds.top - thisBounds.top;
          let bottomRight = pinchHelper.createPoint();
          bottomRight.x = positioningElBounds.width + topLeft.x;
          bottomRight.y = positioningElBounds.height + topLeft.y;

          // Calculate the intended position of _positioningEl.
          const newMatrix = pinchHelper
            .createMatrix()
            .translate(x, y)
            .scale(scale)
            // Undo current transform
            .multiply(target.inverse());

          topLeft = topLeft.matrixTransform(newMatrix);
          bottomRight = bottomRight.matrixTransform(newMatrix);

          // Ensure _positioningEl can't move beyond out-of-bounds.
          // Correct for x
          if (topLeft.x > thisBounds.width) {
            x += thisBounds.width - topLeft.x;
          } else if (bottomRight.x < 0) {
            x += -bottomRight.x;
          }

          // Correct for y
          if (topLeft.y > thisBounds.height) {
            y += thisBounds.height - topLeft.y;
          } else if (bottomRight.y < 0) {
            y += -bottomRight.y;
          }
          updateTransform(scale, x, y);
        }
      }
    }
  );

  const applyChange = useCallbackRef(
    (opts: ApplyChangeOpts = {}) => {
      const {
        panX = 0,
        panY = 0,
        originX = 0,
        originY = 0,
        scaleDiff = 1,
      } = opts;
      if (matrix.current) {
        const newMatrix = pinchHelper
          .createMatrix()
          // Translate according to panning.
          .translate(panX, panY)
          // Scale about the origin.
          .translate(originX, originY)
          // Apply current translate
          .translate(matrix.current.e, matrix.current.f)
          .scale(scaleDiff)
          .translate(-originX, -originY)
          // Apply current scale.
          .scale(matrix.current.a);

        // Convert the transform into basic translate & scale.
        setTransform({
          scale: newMatrix.a,
          x: newMatrix.e,
          y: newMatrix.f,
        });
      }
    }
  );

  const onWheel = useCallbackRef(
    (event?: WheelEvent) => {
      const { current: item } = targetPinchRef;

      if (!item || !event) return;

      event.preventDefault();

      const currentRect = item.getBoundingClientRect();
      let { deltaY } = event;
      const { ctrlKey, deltaMode } = event;

      if (deltaMode === 1) {
        // 1 is "lines", 0 is "pixels"
        // Firefox uses "lines" for some types of mouse
        deltaY *= 15;
      }

      // ctrlKey is true when pinch-zooming on a trackpad.
      const divisor = ctrlKey ? 100 : 300;
      const scaleDiff = 1 - deltaY / divisor;

      applyChange({
        scaleDiff,
        originX: event.clientX - currentRect.left,
        originY: event.clientY - currentRect.top,
      });
    },
  );

  const onPointerMove = useCallbackRef(
    (previousPointers: Pointer[], currentPointers: Pointer[]) => {
      const { current: item } = targetPinchRef;
      if (!item) return;

      // Combine next points with previous points
      const currentRect = item.getBoundingClientRect();

      // For calculating panning movement
      const prevMidpoint = pinchHelper.getMidpoint(
        previousPointers[0],
        previousPointers[1]
      );
      const newMidpoint = pinchHelper.getMidpoint(
        currentPointers[0],
        currentPointers[1]
      );

      // Midpoint within the element
      const originX = prevMidpoint.clientX - currentRect.left;
      const originY = prevMidpoint.clientY - currentRect.top;

      // Calculate the desired change in scale
      const prevDistance = pinchHelper.getDistance(
        previousPointers[0],
        previousPointers[1]
      );
      const newDistance = pinchHelper.getDistance(
        currentPointers[0],
        currentPointers[1]
      );
      const scaleDiff = prevDistance ? newDistance / prevDistance : 1;

      applyChange({
        originX,
        originY,
        scaleDiff,
        panX: newMidpoint.clientX - prevMidpoint.clientX,
        panY: newMidpoint.clientY - prevMidpoint.clientY,
      });
    },
  );

  useInitialRef<PinchRef, CoverRef>({pinchRef, coverRef, deps})

  useWheel({coverRef: targetCoverRef, action: onWheel, enableWheel, deps})

  useTouch({coverRef: targetCoverRef, action: onPointerMove, scaleRef, enableTouch, deps})

  return {pinchRef, coverRef, scaleState};
};
