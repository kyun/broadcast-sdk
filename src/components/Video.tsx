import React from 'react';
import styled from 'styled-components';
import BroadcastManager from '../core/broadcastManager';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 1280px;
  height: 720px;
`;
const VideoEl = styled.video`
  border: 1px solid red;
`;

const Box = styled.div`
  outline: 4000px solid rgba(0, 0, 244, 0.3);
  width: 210px;
  height: 210px;
  position: absolute;
  top: 50%;
  left: 50%;
  transfrom: translate(-50%, -50%);
`;

const bm = new BroadcastManager();
const Video: React.FC = () => {
  const bmId = React.useRef<number>();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    console.log('VIDEO Mounted');
    bmId.current = bm.subscribe(
      ({ mediaStream }: { mediaStream: MediaStream }) => {
        console.log('Video .. something', mediaStream);
        videoRef.current!.srcObject = mediaStream;
        videoRef.current!.play().catch(() => {
          console.error('error!');
        });
        console.log('play');
      }
    );
    videoRef.current!.srcObject = bm.mediaStream;
    console.log(`Video mounted`, bmId.current);

    return () => {
      bm.unsubscribe(bmId.current);
    };
  }, []);
  return (
    <Wrapper>
      <VideoEl autoPlay ref={videoRef} />
      <Box />
    </Wrapper>
  );
};

export default Video;
