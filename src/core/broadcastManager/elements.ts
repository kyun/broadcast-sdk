export const initVideoElement = () => {
  const videoEl = document.createElement('video');
  videoEl.autoplay = true;

  // videoEl.play().catch()
  return videoEl;
};
