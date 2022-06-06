import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getMediaDevices } from './core/broadcastManager/mediaDevice';
import BroadcastManager from './core/broadcastManager';
import { getLocalMediaStream } from './core/broadcastManager/mediaStream';

const bm = new BroadcastManager();

function App() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = React.useState(false);

  const handleStart = () => {
    bm.start((stream: MediaStream) => {
      setStarted(true);
      videoRef.current!.srcObject = stream;
    });
  };
  React.useEffect(() => {
    // document.body.appendChild(bm.videoEl);
    // ref.current = bm.videoEl;
  }, []);
  return (
    <div className="App">
      <p>
        <button onClick={handleStart}>Start</button>
        <button onClick={() => bm.stop()}>Stop</button>
      </p>
      <p>
        audioinput :
        <select>
          {bm.localDevices?.audioinput.map((v, i) => (
            <option key={i}>{v.deviceId}</option>
          ))}
        </select>
      </p>
      <p>
        videoinput :
        <select>
          {bm.localDevices?.videoinput.map((v, i) => (
            <option key={i}>{v.deviceId}</option>
          ))}
        </select>
      </p>
      <video ref={videoRef} autoPlay />
    </div>
  );
}

export default App;
