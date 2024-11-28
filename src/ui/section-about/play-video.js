const videoTrigger = document.querySelector('.video-trigger');
const videoContainer = document.querySelector('.video-container');
const video = videoContainer.querySelector('video');

videoTrigger.addEventListener('click', () => {
  videoContainer.style.display = 'block';
  video.requestFullscreen();
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    video.play();
  } else {
    video.pause();
    video.currentTime = 0;
    videoContainer.style.display = 'none';
  }
});
