import { useEffect, useRef } from 'react';
import { pinchHelper } from './util';

export const useMatrix = () => {
  const matrix = useRef<DOMMatrix>();
  useEffect(() => {
    matrix.current = pinchHelper.createMatrix();
  });

  return matrix;
};
