import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotHeaderComponent} from './co-pilot-header.component';
import {PmsAssetResolverPipe} from 'apps/project-mgmt/src/app/initializers/pms-asset-resolver.pipe';
import {PipesModule} from '@rao/theme/tools/pipes/pipes.module';
import {AssetResolverService} from 'apps/project-mgmt/src/app/initializers';
import {UserSessionStoreService} from '@rao/core/store';
import {InMemoryStorageService} from 'ngx-webstorage-service';
import {
  APPLICATION_STORE,
  APP_SESSION_STORE,
} from '@rao/core/store/store.interface';
import {TranslateModule} from '@ngx-translate/core';

describe('CoPilotHeaderComponent', () => {
  let component: CoPilotHeaderComponent;
  let fixture: ComponentFixture<CoPilotHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule, TranslateModule.forRoot()],
      declarations: [CoPilotHeaderComponent],
      providers: [
        {
          provide: PmsAssetResolverPipe,
          useValue: {transform: () => ''},
        },
        {
          provide: AssetResolverService,
          useValue: {getAssetsUrl: () => {}},
        },
        UserSessionStoreService,
        InMemoryStorageService,
        {provide: APPLICATION_STORE, useValue: {}},
        {provide: APP_SESSION_STORE, useValue: {}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeDialog event when onClose method is called', () => {
    spyOn(component.closeDialog, 'emit');

    component.onClose();

    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should emit resetChatEmit event when resetChat method is called', () => {
    spyOn(component.resetChatEmit, 'emit');

    component.resetChat();

    expect(component.resetChatEmit.emit).toHaveBeenCalled();
  });

  it('should emit openHistoryComp event when openHistory method is called', () => {
    spyOn(component.openHistoryComp, 'emit');

    component.openHistory();

    expect(component.openHistoryComp.emit).toHaveBeenCalled();
  });

  it('should have cdk drag boundary to stay within constraints', () => {
    const containerElement: HTMLElement = fixture.nativeElement.querySelector(
      '.co-pilot-header-sub-header',
    );
    const boundary = containerElement.getAttribute('cdkDragBoundary');
    expect(boundary).toBe('.cdk-overlay-container');
  });
});
