import { initVideoElement } from './elements';
import { getMediaDevices, MediaDevices } from './mediaDevice';
import { getLocalMediaStream } from './mediaStream';

type BroadcastMode = 'AUDIO_ONLY' | 'VIDEO';
class BroadcastManager {
  static _instance: any;

  _mediaStream: null | MediaStream = null;

  _muted: boolean = true;

  _mode: BroadcastMode = 'VIDEO';

  _strict: boolean = false;

  _listener: any[] = [];

  _audioContext: AudioContext = new AudioContext();

  _audioAnalyser: AnalyserNode | null = null;

  _dataArray: any;

  constructor() {
    if (BroadcastManager._instance) {
      // console.error("Singleton classes can't be instantiated more than once.");
      return;
    }
    BroadcastManager._instance = this;
  }

  subscribe(cb: any) {
    this._listener.push(cb);
    const id = this._listener.length - 1;
    return id;
  }

  unsubscribe(id?: number) {
    if (id === undefined || isNaN(id)) return;
    this._listener.splice(id, 1);
  }

  async start(strict: boolean, cb?: any) {
    try {
      this._strict = strict;
      if (this._mediaStream) {
        this.stop();
      }
      let constraint: any = {
        audio: { deviceId: undefined },
      };
      if (this._mode === 'VIDEO') {
        constraint = {
          ...constraint,
          video: {
            deviceId: undefined, // videoDeviceId ?? null,
            height: { ideal: 640 },
            width: { ideal: 1440 },
          },
        };
      }
      this._mediaStream = await getLocalMediaStream(constraint);

      this.setAudioAnalyser();

      const tracks = this._mediaStream.getTracks();
      tracks.forEach((track) => {
        if (track.kind === 'audio') {
          track.enabled = !this._muted;
        }
      });
      this._listener.forEach((cb, i) => {
        cb?.({
          mediaStream: this._mediaStream,
        });
      });
    } catch (err: any) {
      console.log(err);
      //
    }
  }

  setAudioAnalyser() {
    if (!this._mediaStream) return;
    const source = this._audioContext.createMediaStreamSource(
      this._mediaStream
    );
    this._audioAnalyser = this._audioContext.createAnalyser();
    this._audioAnalyser.fftSize = 32;
    source.connect(this._audioAnalyser);
    // const bufferLength = this._audioAnalyser.frequencyBinCount;
    this._dataArray = new Uint8Array(this._audioAnalyser.fftSize);
    this._audioAnalyser?.getByteFrequencyData(this._dataArray);
  }

  getDataArray() {
    // if (!this._audioAnalyser) return;
    this._audioAnalyser?.getByteFrequencyData(this._dataArray);
    return this._dataArray;
    //
    // this._audioAnalyser.getByteTimeDomainData(this._dataArray);
    return this._dataArray;
  }

  // async audio() {
  //   if (!this._mediaStream) return;

  //   const audioCtx = new AudioContext();
  //   const source = audioCtx.createMediaStreamSource(this._mediaStream);
  //   this._audioAnalyseranalyser = audioCtx.createAnalyser();
  //   analyser.fftSize = 32;
  //   source.connect(analyser);

  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   setInterval(() => {
  //     analyser.getByteTimeDomainData(dataArray);
  //     const numArr = Array.from(dataArray);
  //     const max = Math.max(...numArr);
  //     if (max > 130) {
  //       console.log(max);
  //     }
  //   }, 200);
  // }

  stop() {
    try {
      if (!this._mediaStream) {
        // throw new Error('No Media Stream...');
        throw {
          message: 'There is no Media Stream.',
          name: 'ResourceError',
        };
      }
      const tracks = this._mediaStream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });
      this._mediaStream = null;
    } catch (err: any) {
      console.error(err);
      console.log(err?.message);
      console.log(err?.name);
      //
    }
  }

  get mediaStream() {
    return this._mediaStream;
  }

  set mode(_mode: 'VIDEO' | 'AUDIO_ONLY') {
    const prevMode = this._mode;
    if (prevMode === _mode) return;
    this._mode = _mode;
    if (!this._mediaStream) return;
    if (this._strict) {
      console.log('STRICT!!!');
      this.stop();
      this.start(this._strict);
      return;
    }
    const tracks = this._mediaStream.getTracks();
    tracks.forEach((track) => {
      if (track.kind === 'video') {
        // if (this._mode === 'AUDIO_ONLY') {
        //   track.stop();
        // }
        track.enabled = this._mode === 'VIDEO';
      }
    });
  }
  get mode() {
    return this._mode;
  }
  get muted() {
    return this._muted;
  }
  set muted(_muted: boolean) {
    this._muted = _muted;
    if (!this._mediaStream) return;
    const tracks = this._mediaStream.getTracks();
    tracks.forEach((track) => {
      if (track.kind === 'audio') {
        track.enabled = !this._muted;
      }
      if (track.kind === 'video') {
        track.enabled = this._mode === 'VIDEO';
      }
    });
  }
}

export default BroadcastManager;
