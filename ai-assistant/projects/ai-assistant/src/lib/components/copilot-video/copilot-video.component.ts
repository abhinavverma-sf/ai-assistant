import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {take} from 'rxjs';

import {CoPilotVideo} from '../../constants';
import {DeepChatCommsService, CoPilotVideoService} from '../../services';
import {LocalizationPipe} from '../../pipes/localization.pipe';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: CoPilotVideo,
  templateUrl: './copilot-video.component.html',
  styleUrls: ['./copilot-video.component.scss'],
  providers: [LocalizationPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CopilotVideoComponent {
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly deepChatComms: DeepChatCommsService,
    private readonly coPilotVideoSvc: CoPilotVideoService,
    private http: HttpClient,
  ) {}

  @Input('videofilekey')
  videofilekey: string;

  safeUrl: SafeUrl;

  blobUrls: string[] = [];

  // need to re replaced
  posterImg;

  fullscreenChangeHandler: () => void;
  playHandler: () => void;
  pauseHandler: () => void;

  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;


  ngAfterViewInit(): void {
    this.createSafeUrl();
    this._addEventListener();
  }

  restoreScrollPosition(container) {
    if (container) {
      const videoScrollTop =
        container?.offsetParent?._elementRef?.firstElementChild
          ?.firstElementChild?.scrollTop;
      if (videoScrollTop) {
        this.deepChatComms.triggerVideoScrollPosition(videoScrollTop);
      }
    }
  }

  private _addEventListener() {
    const videoNativeElement = this.videoElement?.nativeElement;
    if (videoNativeElement) {
      this.fullscreenChangeHandler = () => {
        if (!document.fullscreenElement) {
          // Full-screen mode has been exited
          // Restore scroll position
          this.restoreScrollPosition(videoNativeElement);
        }
      };
      this.playHandler = () => {
        this.coPilotVideoSvc.playVideo(videoNativeElement);
      };
      this.pauseHandler = () => {
        this.coPilotVideoSvc.pauseVideo(videoNativeElement);
      };

      videoNativeElement.addEventListener(
        'fullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.addEventListener(
        'webkitfullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.addEventListener(
        'mozfullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.addEventListener(
        'MSFullscreenChange',
        this.fullscreenChangeHandler,
      );
    }
    videoNativeElement.addEventListener('play', this.playHandler);
    videoNativeElement.addEventListener('pause', this.pauseHandler);
  }

  createSafeUrl() {
    const url = `http://localhost:4007/files/ai/${this.videofilekey}`;
    // write your own download logic
    // this.deepChatFacadeSvc
    //   .downloadAIFile(this.videofilekey)
    //   ?.pipe(take(1))
    //   ?.subscribe({
    //     next: blob => {
    //       const blobUrl = window.URL.createObjectURL(blob);
    //       this.blobUrls.push(blobUrl);
    //       this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl); // NOSONAR
    //       this.videoElement.nativeElement.load();
    //     },
    //   });

    this.http.get(url, {responseType: 'blob'}).subscribe({
      next: blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        this.blobUrls.push(blobUrl);
        this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl); // NOSONAR
        this.videoElement.nativeElement.load();
      },
      error: err => {
        console.error('Download error:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.removeVideoEventListeners();
  }

  removeVideoEventListeners() {
    const videoNativeElement = this.videoElement?.nativeElement;
    if (videoNativeElement) {
      videoNativeElement.removeEventListener(
        'fullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.removeEventListener(
        'webkitfullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.removeEventListener(
        'mozfullscreenchange',
        this.fullscreenChangeHandler,
      );
      videoNativeElement.removeEventListener(
        'MSFullscreenChange',
        this.fullscreenChangeHandler,
      );

      videoNativeElement.removeEventListener('play', this.playHandler);
      videoNativeElement.removeEventListener('pause', this.pauseHandler);
    }
  }
}
