import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {AnyAdapter, ApiService} from '@rao/core/api';
import {DownloadService} from '@rao/core/services';
import {AssetDownloadService} from '@rao/shared/services';

import {DeepChatFacadeService} from '../../facades';
import {CoPilotImageComponent} from './co-pilot-image.component';
import {TranslateModule} from '@ngx-translate/core';
import {ImageStoreService} from '../../services/image-store.service';

describe('CoPilotImageComponent', () => {
  let component: CoPilotImageComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CoPilotImageComponent>>;

  let fixture: ComponentFixture<CoPilotImageComponent>;

  let imageStoreSvcSpy: jasmine.SpyObj<ImageStoreService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    imageStoreSvcSpy = jasmine.createSpyObj('ImageStoreService', [
      'updateImage',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CoPilotImageComponent],
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},
        AssetDownloadService,
        DownloadService,
        ApiService,
        AnyAdapter,
        DeepChatFacadeService,
        {provide: ImageStoreService, useValue: imageStoreSvcSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isImageLoading to false and call updateImage with correct parameters', () => {
    component.numquestion = '1';
    component.imagecounter = '10';
    component.filekey = 'sampleFileKey';
    component.safeUrl = 'http://example.com/image.png';
    component.imageLoaded();

    expect(component.isImageLoading).toBeFalse();

    expect(imageStoreSvcSpy.updateImage).toHaveBeenCalledWith(
      1,
      10,
      'sampleFileKey',
      'http://example.com/image.png',
    );
  });
});
