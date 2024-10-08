import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CopilotVideoComponent} from './copilot-video.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {CoPilotVideoService, DeepChatCommsService} from '../../services';

describe('CopilotVideoComponent', () => {
  let component: CopilotVideoComponent;
  let fixture: ComponentFixture<CopilotVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopilotVideoComponent],
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [DeepChatCommsService, CoPilotVideoService],
    }).compileComponents();

    fixture = TestBed.createComponent(CopilotVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute restoreScrollPosition on fullscreenchange', () => {
    const event = new Event('fullscreenchange', {bubbles: true});
    const element = component.videoElement.nativeElement;
    const restoreScrollPositionSpy = spyOn(component, 'restoreScrollPosition');
    element.dispatchEvent(event);
    expect(restoreScrollPositionSpy).toHaveBeenCalled();
  });
});
