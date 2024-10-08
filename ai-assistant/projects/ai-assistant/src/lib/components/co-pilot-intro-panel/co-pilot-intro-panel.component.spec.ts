import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

import {CoPilotRoles} from '../../enums';
import {CoPilotIntroPanelComponent} from './co-pilot-intro-panel.component';
import {Integers} from '../../enums/numbers.enum';

describe('CoPilotIntroPanelComponent', () => {
  let component: CoPilotIntroPanelComponent;
  let fixture: ComponentFixture<CoPilotIntroPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotIntroPanelComponent],
      imports: [],
      providers: [],
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
