export interface MediaDevices {
  audioinput: MediaDeviceInfo[];
  videoinput: MediaDeviceInfo[];
  audiooutput: MediaDeviceInfo[];
}
export const getMediaDevices = async () => {
  try {
    navigator.mediaDevices.ondevicechange = (e) => {
      console.log('device on changed..');
      console.log(e);
    };
    const devices = await navigator.mediaDevices.enumerateDevices();
    const out = devices.reduce<MediaDevices>((prevInfos, currentInfo) => {
      switch (currentInfo.kind) {
        case 'audioinput':
        case 'audiooutput':
        case 'videoinput': {
          const prevInfoList = prevInfos[currentInfo.kind] || [];
          return {
            ...prevInfos,
            [currentInfo.kind]: [...prevInfoList, currentInfo],
          };
        }

        default:
      }
      return prevInfos;
    }, {} as MediaDevices);
    return out;
  } catch (err) {
    //
    console.error(err);
    return null;
  }
};
