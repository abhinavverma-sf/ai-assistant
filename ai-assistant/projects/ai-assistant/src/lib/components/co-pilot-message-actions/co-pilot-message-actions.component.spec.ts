import {Clipboard} from '@angular/cdk/clipboard';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';

import {CoPilotMessageActionsComponent} from './co-pilot-message-actions.component';
import {Integers} from '../../enums/numbers.enum';

describe('CoPilotMessageActionsComponent', () => {
  let component: CoPilotMessageActionsComponent;
  let fixture: ComponentFixture<CoPilotMessageActionsComponent>;
  let clipboard: Clipboard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotMessageActionsComponent],
      imports: [],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotMessageActionsComponent);
    clipboard = TestBed.get(Clipboard);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert simple HTML to plain text', () => {
    const html = '<p>This is a test.</p>';
    const expectedPlainText = 'This is a test.';
    expect(component.convertHtmlToPlainText(html)).toEqual(expectedPlainText);
  });

  it('should handle empty HTML input', () => {
    const html = '';
    const expectedPlainText = '';
    expect(component.convertHtmlToPlainText(html)).toEqual(expectedPlainText);
  });

  it('should handle line break in answer as well', () => {
    const copy = `Hi all how are you all. The vibe ain't good here. <br> <br> Watch web series instead of
    all this`;
    const result = component.convertHtmlToPlainText(copy);
    expect(result).toEqual(`Hi all how are you all. The vibe ain't good here.
Watch web series instead of
    all this`);
  });

  it('should show and hide tooltip after specified duration', fakeAsync(() => {
    spyOn(component.tooltip, 'show');
    spyOn(component.tooltip, 'hide');

    const duration = Integers.OneThousandThreeHundredEighty;
    component.showTooltipForDuration(duration);

    expect(component.tooltip.show).toHaveBeenCalled();
    expect(component.tooltip.hide).not.toHaveBeenCalled();

    tick(duration);
    expect(component.tooltip.hide).toHaveBeenCalled();
  }));

  it('should copy text to clipboard and update flags and messages', () => {
    spyOn(component, 'convertHtmlToPlainText').and.returnValue('Plain text');
    spyOn(clipboard, 'copy');

    component.copyClicked();

    expect(component.isCopied).toBeTrue();
    expect(component.tooltipMessage).toEqual(
      component.localisedStrings['responseCopiedLbl'],
    );
    expect(clipboard.copy).toHaveBeenCalledWith('Plain text');
  });

  it('should set isCopied to false on mouse leave event', () => {
    component.isCopied = true;

    const mockMouseEvent = new MouseEvent('mouseleave');
    component.onMouseLeave(mockMouseEvent);

    expect(component.isCopied).toBeFalse();
  });

  it('should trigger upvoteClicked when upvote icon is clicked', () => {
    spyOn(component, 'upvoteClicked');
    const upvoteIcon = fixture.debugElement.query(By.css('.Like-Outline'));
    upvoteIcon.triggerEventHandler('click', null);
    expect(component.upvoteClicked).toHaveBeenCalled();
  });

  it('should trigger downvoteClicked when downvote icon is clicked', () => {
    spyOn(component, 'downvoteClicked');
    const downvoteIcon = fixture.debugElement.query(By.css('.dislike'));
    downvoteIcon.triggerEventHandler('click', null);
    expect(component.downvoteClicked).toHaveBeenCalled();
  });

  it('should trigger copyClicked when copy icon is clicked', () => {
    spyOn(component, 'copyClicked');
    const copyIcon = fixture.debugElement.query(By.css('.copy-outline'));
    copyIcon.triggerEventHandler('click', null);
    expect(component.copyClicked).toHaveBeenCalled();
  });

  it('should set answerUpvoted to true when upvote icon is clicked initially', () => {
    component.upvoteClicked();
    expect(component.answerUpvoted).toBe(true);
    expect(component.answerDownvoted).toBe(false);
  });

  it('should set answerDownvoted to true when downvote icon is clicked initially', () => {
    component.downvoteClicked();
    expect(component.answerDownvoted).toBe(true);
    expect(component.answerUpvoted).toBe(false);
  });

  it('should toggle answerUpvoted to false when upvote icon is clicked again', () => {
    component.answerUpvoted = true;
    component.upvoteClicked();
    expect(component.answerUpvoted).toBe(false);
  });

  it('should toggle answerDownvoted to false when downvote icon is clicked again', () => {
    component.answerDownvoted = true;
    component.downvoteClicked();
    expect(component.answerDownvoted).toBe(false);
  });

  it('should deactivate answerDownvoted and activate answerUpvoted when upvote icon is clicked while downvote icon is active', () => {
    component.answerDownvoted = true;
    component.upvoteClicked();
    expect(component.answerUpvoted).toBe(true);
    expect(component.answerDownvoted).toBe(false);
  });

  it('should deactivate answerUpvoted and activate answerDownvoted when downvote icon is clicked while upvote icon is active', () => {
    component.answerUpvoted = true;
    component.downvoteClicked();
    expect(component.answerDownvoted).toBe(true);
    expect(component.answerUpvoted).toBe(false);
  });
});
