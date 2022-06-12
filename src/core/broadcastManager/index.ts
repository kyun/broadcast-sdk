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

  constructor() {
    if (BroadcastManager._instance) {
      console.error("Singleton classes can't be instantiated more than once.");
      return BroadcastManager._instance;
    }
    BroadcastManager._instance = this;
  }

  subscribe(cb: any) {
    console.log(this._listener);
    this._listener.push(cb);
    console.log(this._listener);
    const id = this._listener.length - 1;
    console.log('subscribed callback', this._listener, id, Date.now());

    return id;
  }

  unsubscribe(id?: number) {
    console.log('unsubs');
    if (id === undefined || isNaN(id)) return;
    this._listener.splice(id, 1);
  }

  async start(strict: boolean, cb?: any) {
    console.log(this._listener);
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
