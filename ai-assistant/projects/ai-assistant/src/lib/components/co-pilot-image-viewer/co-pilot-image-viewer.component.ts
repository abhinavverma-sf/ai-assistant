import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  LEFT_RIGHT_MARGIN_TOTAL,
  TOP_BOTTOM_MARGIN_TOTAL,
} from '../../constants';
import {Integers} from '../../enums/numbers.enum';
@Component({
  selector: 'rpms-co-pilot-image-viewer',
  templateUrl: './co-pilot-image-viewer.component.html',
  styleUrls: [
    './co-pilot-image-viewer.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class CoPilotImageViewerComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<CoPilotImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  @ViewChild('imageElement') imageElement: ElementRef<HTMLImageElement>;

  currentIndex = 0;

  zoomPercentage = Integers.OneHundred;

  scale = 1.0;

  isLoading = true;

  safeUrl;

  blobUrls = [];

  currentFileKey = '';

  gallery = [];

  ngOnInit(): void {
    this.gallery = this.data?.images;
    this.currentIndex = this.data?.currentImageNumber;
    this.createSafeUrl();
  }

  createSafeUrl() {
    const currentImage = this.gallery?.find(
      g => g.imageNum === this.currentIndex,
    );
    if (currentImage) {
      this.currentFileKey = currentImage.fileKey;
      this.safeUrl = currentImage.safeUrl;
    }
  }

  goBack() {
    this.dialogRef.close();
  }

  nextImage() {
    this.isLoading = true;
    this.defaultZoomScale();
    if (this.currentIndex < this.gallery.length - 1) {
      this.currentIndex++;
      this.createSafeUrl();
    }
  }

  previousImage() {
    this.isLoading = true;
    this.defaultZoomScale();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.createSafeUrl();
    }
  }

  downloadImage() {
    // write your own download logic
  }

  imageLoaded() {
    const screenHeight = window.innerHeight - TOP_BOTTOM_MARGIN_TOTAL;
    const screenWidth = window.innerWidth - LEFT_RIGHT_MARGIN_TOTAL;

    const imageHeight = this.imageElement.nativeElement.naturalHeight;
    const imageWidth = this.imageElement.nativeElement.naturalWidth;

    const aspectRatio = imageWidth / imageHeight;

    // Calculate the width and height of the image while maintaining aspect ratio
    let newImageWidth = screenWidth;
    let newImageHeight = newImageWidth / aspectRatio;

    if (newImageHeight > screenHeight) {
      newImageHeight = screenHeight;
      newImageWidth = newImageHeight * aspectRatio;
    }

    // Set the new dimensions and styles
    this.imageElement.nativeElement.style.width = `${newImageWidth}px`;
    this.imageElement.nativeElement.style.height = `${newImageHeight}px`;
    this.imageElement.nativeElement.style.maxWidth = '100%';

    // Calculate and set left and right margins to center the image horizontally
    const horizontalMargin = (screenWidth - newImageWidth) / 2;
    this.imageElement.nativeElement.style.marginLeft = `${horizontalMargin}px`;
    this.imageElement.nativeElement.style.marginRight = `${horizontalMargin}px`;

    // Calculate and set top and bottom margins to center the image vertically
    const verticalMargin = (screenHeight - newImageHeight) / 2;
    this.imageElement.nativeElement.style.marginTop = `${verticalMargin}px`;
    this.imageElement.nativeElement.style.marginBottom = `${verticalMargin}px`;

    this.isLoading = false;
  }

  calcScale() {
    this.scale = this.zoomPercentage / 100.0;
  }

  zoomIn() {
    this.zoomPercentage = this.zoomPercentage + Integers.Ten;
    this.calcScale();
  }

  zoomOut() {
    this.zoomPercentage = Math.max(
      Integers.Zero,
      this.zoomPercentage - Integers.Ten,
    );
    this.calcScale();
  }

  defaultZoomScale() {
    this.zoomPercentage = Integers.OneHundred;
    this.scale = 1.0;
  }

  ngOnDestroy(): void {
    this.revokeAllBlobUrls();
  }

  revokeAllBlobUrls() {
    for (const blobUrl of this.blobUrls) {
      window.URL.revokeObjectURL(blobUrl);
    }
  }
}
