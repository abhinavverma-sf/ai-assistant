import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {take} from 'rxjs';

import {CoPilotImage} from '../../constants';
import {CoPilotImageViewerComponent} from '../co-pilot-image-viewer/co-pilot-image-viewer.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageStoreService} from '../../services/image-store.service';
import {LocalizationPipe} from '../../pipes/localization.pipe';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: CoPilotImage,
  templateUrl: './co-pilot-image.component.html',
  styleUrls: ['./co-pilot-image.component.scss'],
  providers: [LocalizationPipe],

  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CoPilotImageComponent {
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
    private readonly imageStoreSvc: ImageStoreService,
    private http: HttpClient,
  ) {}

  safeUrl;

  @Input('filekey')
  filekey;

  isImageLoading = true;

  blobUrls = [];

  dialogRef: MatDialogRef<CoPilotImageViewerComponent>;

  imagesArr = [];

  @Input('imagecounter')
  imagecounter;

  @Input('numquestion')
  numquestion;

  ngAfterViewInit() {
    if (this.filekey) {
      this.createSafeUrl();
    }
  }

  createSafeUrl() {
    // write your own image download logic
    this.isImageLoading = false;
  }

  imageLoaded() {
    this.isImageLoading = false;

    const questionNum = parseInt(this.numquestion);

    this.imageStoreSvc.updateImage(
      questionNum,
      parseInt(this.imagecounter),
      this.filekey,
      this.safeUrl,
    );
  }

  closePreviousDialogIfOpen() {
    if (this.dialogRef?.componentInstance) {
      // Close the previous dialog if it's open
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  openDialog(questionNumber, imageNumber) {
    this.closePreviousDialogIfOpen();

    this.dialogRef = this.dialog.open(CoPilotImageViewerComponent, {
      data: {
        images: this.imageStoreSvc.getImagesOfQuestion(
          parseInt(questionNumber),
        ),
        currentQuestionNumber: parseInt(questionNumber),
        currentImageNumber: parseInt(imageNumber),
      },

      height: '100%',
      width: '100%',
      maxWidth: '100vw',
      panelClass: 'co-pilot-image-viewer-pc',
    });
  }
}
