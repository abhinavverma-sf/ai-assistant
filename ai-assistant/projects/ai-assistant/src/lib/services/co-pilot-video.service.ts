import {Injectable} from '@angular/core';

@Injectable()
export class CoPilotVideoService {
  private _currentlyPlayingVideo: HTMLVideoElement | null = null;

  constructor() {}

  playVideo(videoElement: HTMLVideoElement) {
    if (
      this._currentlyPlayingVideo &&
      this._currentlyPlayingVideo !== videoElement
    ) {
      this._currentlyPlayingVideo.pause();
    }
    this._currentlyPlayingVideo = videoElement;
    videoElement.play();
  }

  pauseVideo(videoElement: HTMLVideoElement) {
    if (this._currentlyPlayingVideo === videoElement) {
      this._currentlyPlayingVideo.pause();
      this._currentlyPlayingVideo = null;
    }
  }
}
