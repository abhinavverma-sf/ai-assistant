import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotRelatedTopicsComponent} from './co-pilot-related-topics.component';
import {By} from '@angular/platform-browser';
import {DeepChatCommsService} from '../../services';
import {Integers} from '../../enums/numbers.enum';

describe('CoPilotRelatedTopicsComponent', () => {
  let component: CoPilotRelatedTopicsComponent;
  let fixture: ComponentFixture<CoPilotRelatedTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotRelatedTopicsComponent],
      imports: [],
      providers: [DeepChatCommsService],
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
