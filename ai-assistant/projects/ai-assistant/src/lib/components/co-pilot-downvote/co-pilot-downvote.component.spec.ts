import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotDownvoteComponent} from './co-pilot-downvote.component';

describe('CoPilotDownvoteComponent', () => {
  let component: CoPilotDownvoteComponent;
  let fixture: ComponentFixture<CoPilotDownvoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotDownvoteComponent],
      imports: [],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotDownvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
