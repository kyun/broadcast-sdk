import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getMediaDevices } from './core/broadcastManager/mediaDevice';
import BroadcastManager from './core/broadcastManager';
import { getLocalMediaStream } from './core/broadcastManager/mediaStream';

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

  const handleAudio = () => {
    // const audioContext = new AudioContext();
    // const source = audioContext.createMediaStreamSource(
    //   bm.mediaStream as MediaStream
    // );
    // const analyser = audioContext.createAnalyser();
    // source.connect(analyser);

    // const dataArray = new Uint8Array(32);
    setInterval(() => {
      // analyser.getByteFrequencyData(dataArray);
      const dataArray: Uint16Array = bm.getDataArray();
      const numArr = Array.from(dataArray);
      const max = Math.max(...numArr);
      const sum = numArr.reduce((a, b) => a + b * b, 0);
      var rms = Math.sqrt(sum / numArr.length);
      console.log(max, numArr);

      // if (max > 130) {
      // }
    }, 200);
  };
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
        <button onClick={handleAudio}>Audio</button>
      </p>

      <video ref={videoRef} autoPlay muted />
    </div>
  );
}

export default App;
