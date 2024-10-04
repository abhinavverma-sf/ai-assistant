import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Integers} from '@rao/core/enums';
import {LanguageTranslateService} from '@rao/core/localization';
import {PipesModule} from '@rao/theme/tools/pipes/pipes.module';
import {AssetResolverService} from 'apps/project-mgmt/src/app/initializers';
import {PmsAssetResolverPipe} from 'apps/project-mgmt/src/app/initializers/pms-asset-resolver.pipe';
import {of} from 'rxjs';

import {CoPilotRoles} from '../../enums';
import {CoPilotIntroPanelComponent} from './co-pilot-intro-panel.component';

describe('CoPilotIntroPanelComponent', () => {
  let component: CoPilotIntroPanelComponent;
  let fixture: ComponentFixture<CoPilotIntroPanelComponent>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);
    translateServiceSpy.get.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [CoPilotIntroPanelComponent],
      imports: [TranslateModule.forRoot(), PipesModule],
      providers: [
        {provide: LanguageTranslateService, useValue: {}},
        {
          provide: PmsAssetResolverPipe,
          useValue: {transform: () => ''},
        },
        {
          provide: AssetResolverService,
          useValue: {getAssetsUrl: () => {}},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotIntroPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when suggestion is clicked', () => {
    const suggestionContent = 'Test suggestion';
    const expectedMessage = {
      role: CoPilotRoles.USER,
      text: suggestionContent,
    };
    spyOn(component.sendMessage, 'emit');

    const mockEvent = {
      target: {
        textContent: suggestionContent,
      } as HTMLElement,
    } as unknown as MouseEvent;

    component.onSuggestionClick(mockEvent);

    expect(component.sendMessage.emit).toHaveBeenCalledWith(expectedMessage);
  });

  it('should initialize panels array with correct values', () => {
    expect(component.introQuestionPanels.length).toBe(Integers.Three);
    expect(component.introQuestionPanels[Integers.Zero].translationKey).toBe(
      'introPanelAIOne',
    );
  });

  it('should not emit message when target textContent is undefined', () => {
    spyOn(component.sendMessage, 'emit');

    const mockEvent = {
      target: {
        textContent: undefined,
      } as HTMLElement,
    } as unknown as MouseEvent;

    component.onSuggestionClick(mockEvent);

    expect(component.sendMessage.emit).not.toHaveBeenCalled();
  });
});
