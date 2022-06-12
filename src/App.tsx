import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getMediaDevices } from './core/broadcastManager/mediaDevice';
import BroadcastManager from './core/broadcastManager';
import { getLocalMediaStream } from './core/broadcastManager/mediaStream';
import Video from './components/Video';

const bm = new BroadcastManager();

function App() {
  console.log('<App />');
  const bmId = React.useRef<number>();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const [strictMode, setStrictMode] = React.useState(false);

  const handleStart = () => {
    bm.start(strictMode);
  };
  const handleUnsub = () => {
    console.log('unsubscribe', bmId.current);
    bm.unsubscribe(bmId.current);
  };
  React.useEffect(() => {
    console.log('App Mounted');

    // document.body.appendChild(bm.videoEl);
    // ref.current = bm.videoEl;
    bmId.current = bm.subscribe(
      ({ mediaStream }: { mediaStream: MediaStream }) => {
        console.log('subcribed.. something');
        videoRef.current!.srcObject = mediaStream;
      }
    );
    console.log(`mounted`, bmId.current);

    return () => {
      bm.unsubscribe(bmId.current);
    };
  }, []);

  return (
    <div
      className="App"
      style={
        strictMode ? { border: '4px solid red' } : { border: '4px solid white' }
      }
    >
      <p>
        <button onClick={() => setStrictMode((prev) => !prev)}>
          {strictMode ? 'STRICT_MODE ON' : 'STRICT_MODE OFF'}
        </button>
        <button onClick={handleStart}>Start</button>
        <button onClick={() => bm.stop()}>Stop</button>
        <button onClick={() => (bm.muted = !bm.muted)}>Mute Toggle</button>
        <button onClick={() => (bm.mode = 'VIDEO')}>VIDEO MODE</button>
        <button onClick={() => (bm.mode = 'AUDIO_ONLY')}>
          AUDIO_ONLY MODE
        </button>
        <button onClick={() => handleUnsub()}>Unsubscribe</button>
      </p>

      <video ref={videoRef} autoPlay muted />
      <Video />
    </div>
  );
}

export default App;
