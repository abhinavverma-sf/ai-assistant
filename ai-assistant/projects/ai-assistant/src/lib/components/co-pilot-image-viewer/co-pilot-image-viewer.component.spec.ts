import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {AnyAdapter, ApiService} from '@rao/core/api';
import {Integers} from '@rao/core/enums';
import {DownloadService} from '@rao/core/services';
import {AssetDownloadService} from '@rao/shared/services';

import {DeepChatFacadeService} from '../../facades';
import {CoPilotImageViewerComponent} from './co-pilot-image-viewer.component';

describe('CoPilotImageViewerComponent', () => {
  let component: CoPilotImageViewerComponent;
  let fixture: ComponentFixture<CoPilotImageViewerComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CoPilotImageViewerComponent>>;
  let downloadServiceSpy: jasmine.SpyObj<DownloadService>;
  let assetDownloadServiceSpy: jasmine.SpyObj<AssetDownloadService>;
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    downloadServiceSpy = jasmine.createSpyObj('DownloadService', [
      'downloadByBlob',
    ]);
    assetDownloadServiceSpy = jasmine.createSpyObj('AssetDownloadService', [
      'download',
    ]);
    await TestBed.configureTestingModule({
      declarations: [CoPilotImageViewerComponent],
      imports: [MatDialogModule, HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},
        AssetDownloadService,
        DownloadService,
        ApiService,
        AnyAdapter,
        DeepChatFacadeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotImageViewerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with valid data', () => {
    const mockData = {
      images: [
        {src: 'image1.jpg', fileKey: 'image1'},
        {src: 'image2.jpg', fileKey: 'image2'},
      ],
      currentImageNumber: Integers.One,
    };

    component = new CoPilotImageViewerComponent(
      dialogRefSpy,
      mockData,
      assetDownloadServiceSpy,
      downloadServiceSpy,
    );
    component.ngOnInit();

    expect(component.gallery).toEqual(mockData.images);
    expect(component.currentIndex).toBe(mockData.currentImageNumber);
  });

  it('should close the dialog when goBack is called', () => {
    component.goBack();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should move to the next image when nextImage is called', () => {
    component.currentIndex = Integers.Zero;
    component.gallery = [
      {src: 'image6.jpg', fileKey: 'image6'},
      {src: 'image7.jpg', fileKey: 'image7'},
      {src: 'image8.jpg', fileKey: 'image8'},
    ];
    component.nextImage();

    expect(component.currentIndex).toBe(Integers.One);
  });

  it('should move to the previous image when previousImage is called', () => {
    component.currentIndex = Integers.Two;

    component.previousImage();

    expect(component.currentIndex).toBe(Integers.One);
  });
});