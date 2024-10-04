import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageTranslateService} from '@rao/core/localization';
import {ThemeModule} from '@rao/theme/theme.module';

import {CoPilotRelatedTopicsComponent} from './co-pilot-related-topics.component';
import {By} from '@angular/platform-browser';
import {PmsAssetResolverPipe} from 'apps/project-mgmt/src/app/initializers/pms-asset-resolver.pipe';
import {Integers} from '@rao/core/enums';
import {DeepChatCommsService} from '../../services';

describe('CoPilotRelatedTopicsComponent', () => {
  let component: CoPilotRelatedTopicsComponent;
  let fixture: ComponentFixture<CoPilotRelatedTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotRelatedTopicsComponent],
      imports: [TranslateModule.forRoot(), ThemeModule],
      providers: [
        LanguageTranslateService,
        {
          provide: PmsAssetResolverPipe,
          useValue: {transform: () => ''},
        },
        DeepChatCommsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotRelatedTopicsComponent);

    component = fixture.componentInstance;
    component.items =
      '[{"name":"recommend-1","link":"x"},{"name":"recommend-2","link":"y"}]';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have same length of related topics divs as get from response', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.query(By.css('.related-topics'))
      .nativeElement.childNodes;
    expect(elements.length).toEqual(Integers.Two);
  });
});
