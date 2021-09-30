const mediaStreamConstraints = {
  audio: true,
  video: false,
};
let Stream = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    return console.warn("getUserMedia is not supported");
  //navigator.mediaDevices
    //.getUserMedia(mediaStreamConstraints)
    //.then((stream) => (Stream = stream));
});

function record() {
  if (Stream == null) return console.warn("Stream is null");
  const recorder = new Recorder(
    new AudioContext().createMediaStreamSource(Stream)
  );

  recorder.record();
  const audio = document.getElementById("assistant-sounds");
  audio.src = "./sounds/app_res_pingStart.mp3";
  audio.play();
  // stop recording
  setTimeout(() => {
    audio.src = "./sounds/app_res_pingStop.mp3";
    audio.play();
    recorder.stop();

    recorder.exportWAV((blob) => {
      stt(blob);
    });
  }, 2000);
}
