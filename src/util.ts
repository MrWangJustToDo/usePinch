interface Point {
  clientX: number;
  clientY: number;
}

let cachedSVGElement: SVGSVGElement;

export const pinchHelper = {
  getSVG: (): SVGSVGElement => {
    cachedSVGElement =
      cachedSVGElement ||
      document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    return cachedSVGElement;
  },
  isPointerEvent: (event: any): event is PointerEvent =>
    self.PointerEvent && event instanceof PointerEvent,
  getDistance: (a: Point, b?: Point): number => {
    if (!b) return 0;
    return Math.sqrt(
      (b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2
    );
  },
  getMidpoint: (a: Point, b?: Point): Point => {
    if (!b) return a;
    return {
      clientX: (a.clientX + b.clientX) / 2,
      clientY: (a.clientY + b.clientY) / 2,
    };
  },
  getAbsoluteValue: (value: string | number, max: number): number => {
    if (typeof value === 'number') return value;

    if (value.trimEnd().endsWith('%')) {
      return (max * parseFloat(value)) / 100;
    }
    return parseFloat(value);
  },
  createMatrix: () => {
    if (typeof DOMMatrix === 'undefined') {
      return pinchHelper.getSVG().createSVGMatrix();
    } else {
      return new DOMMatrix();
    }
  },
  createPoint: () => {
    if (typeof DOMPoint === 'undefined') {
      return pinchHelper.getSVG().createSVGPoint();
    } else {
      return new DOMPoint();
    }
  },
};
