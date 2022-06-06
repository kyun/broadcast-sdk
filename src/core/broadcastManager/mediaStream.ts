interface GetLocalMediaStreamParams {
  videoDeviceId: string;
  audioDeviceId: string;
}
export const getLocalMediaStream = async ({
  videoDeviceId,
  audioDeviceId,
}: GetLocalMediaStreamParams) => {
  const constraint = {
    // audio: {
    //   deviceId: '', //audioDeviceId ?? null,
    // },
    video: {
      deviceId: undefined, // videoDeviceId ?? null,
      height: { ideal: 640 },
      width: { ideal: 1440 },
    },
  };
  navigator.mediaDevices.ondevicechange = (e) => {
    console.log('device on changed..2');
    console.log(e);
  };
  navigator.mediaDevices.addEventListener('devicechange', (e) => {
    console.log(e);
    console.log('sdf?');
  });
  const supported = navigator.mediaDevices.getSupportedConstraints();
  console.log(supported);
  const stream = await navigator.mediaDevices.getUserMedia(constraint);
  return stream;
};
// export async function getLocalMediaStream(
//   {
//     audioinput,
//     videoinput,
//   }: {
//     audioinput: number;
//     videoinput: number;
//   },
//   cameraOn: boolean
// ): Promise<MediaStream | null> {
//   try {
//     const mediaDevices = await getLocalDevices();
//     console.log(mediaDevices);
//     if (!mediaDevices) throw new Error('no media device');

//     const constraint = cameraOn
//       ? {
//           audio: {
//             deviceId: mediaDevices?.audioinput?.[audioinput].deviceId,
//           },
//           video: {
//             height: { ideal: 640 },
//             width: { ideal: 1440 },
//             deviceId: mediaDevices?.videoinput?.[videoinput].deviceId,
//           },
//         }
//       : {
//           audio: {
//             deviceId: mediaDevices?.audioinput?.[audioinput].deviceId,
//           },
//         };
//     const stream = await navigator.mediaDevices.getUserMedia(constraint);
//     // if (!cameraOn) {
//     //   const videoTrack = stream.getVideoTracks();
//     //   videoTrack.forEach(t => t.enabled = false);
//     // }

//     return stream;
//   } catch (e: any) {
//     // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
//     switch (e.name) {
//       case 'NotAllowedError': {
//         console.log('no permission');
//         break;
//       }
//       case 'AbortError':
//       case 'NotFoundError':
//       case 'NotReadableError':
//       case 'OverconstrainedError':
//       case 'SecurityError':
//       case 'TypeError':
//       default:
//     }

//     return null;
//   }
// }
