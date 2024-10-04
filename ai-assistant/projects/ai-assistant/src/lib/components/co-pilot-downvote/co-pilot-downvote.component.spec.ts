import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotDownvoteComponent} from './co-pilot-downvote.component';
import {LanguageTranslateService} from '@rao/core/localization';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('CoPilotDownvoteComponent', () => {
  let component: CoPilotDownvoteComponent;
  let fixture: ComponentFixture<CoPilotDownvoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotDownvoteComponent],
      imports: [TranslateModule.forRoot()],
      providers: [LanguageTranslateService, TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotDownvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
