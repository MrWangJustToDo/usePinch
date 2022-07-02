# usePinch hook

fork from [pinch-zoom](https://github.com/GoogleChromeLabs/pinch-zoom) but use [React](https://github.com/facebook/react)

### install

```shell
yarn add use-pinch-ref
```

### use

```typescript
import usePinch from 'use-pinch-ref';

const App = () => {
  const { pinchRef, coverRef } = usePinch<HTMLDivElement, HTMLDivElement>();

  return (
    <div ref={coverRef}>
      <div ref={pinchRef}>34</div>
    </div>
  );
};
```

### api

```typescript
const {
  pinchRef: RefObject;
  coverRef: RefObject;
  scaleState: boolean;
} =  usePinch({
  maxScale?: number;
  minScale?: number;
  startScale?: () => void;
  endScale?: () => void;
  enableWheel?: boolean;
  enableTouch?: boolean;
  forWardPinchRef?: RefObject;
  forWardCoverRef?: RefObject;
  deps?: any[];
})
```
