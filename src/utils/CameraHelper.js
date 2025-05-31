export default class CameraHelper {
  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }

    window.currentStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });

    window.currentStreams = [];
  }

  static registerStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
    }

    window.currentStreams.push(stream);
  }
}
