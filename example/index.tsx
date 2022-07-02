import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import usePinch from '../.';

const App = () => {
  const { pinchRef, coverRef } = usePinch<HTMLDivElement, HTMLDivElement>();
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        ref={coverRef}
      >
        12
        <div
          style={{ width: '200px', height: '100px', border: '1px solid red' }}
          ref={pinchRef}
        >
          34
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
