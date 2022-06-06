import { initVideoElement } from './elements';
import { getMediaDevices, MediaDevices } from './mediaDevice';
import { getLocalMediaStream } from './mediaStream';

class BroadcastManager {
  static _instance: any;

  _mediaStream: null | MediaStream = null;

  _muted: boolean = true;

  _mode: 'video' | 'audio' = 'video';

  _localDevices: MediaDevices | null = null;

  constructor() {
    if (BroadcastManager._instance) {
      console.error("Singleton classes can't be instantiated more than once.");
    }
    BroadcastManager._instance = this;
    navigator.mediaDevices.ondevicechange = async () => {
      this._localDevices = await getMediaDevices();
      console.log(this._localDevices);
    };
    (async () => {
      this._localDevices = await getMediaDevices();
      console.log(this._localDevices);
    })();
    // ... your rest of the constructor code goes after this
  }

  async start(cb?: any) {
    if (!this._localDevices) {
      return;
    }
    this._mediaStream = await getLocalMediaStream({
      audioDeviceId: this._localDevices?.audioinput[0].deviceId,
      videoDeviceId: this._localDevices?.videoinput[0].deviceId,
    });
    cb?.(this._mediaStream);
  }

  stop() {
    if (!this._mediaStream) return;
    const tracks = this._mediaStream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });
  }

  get mediaStream() {
    return this._mediaStream;
  }

  get localDevices() {
    return this._localDevices;
  }

  set mode(_mode: 'video' | 'audio') {
    this._mode = _mode;
  }
}

export default BroadcastManager;
