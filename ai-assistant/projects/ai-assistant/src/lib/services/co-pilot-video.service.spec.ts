import {TestBed} from '@angular/core/testing';

import {CoPilotVideoService} from './co-pilot-video.service';

describe('CoPilotVideoService', () => {
  let service: CoPilotVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoPilotVideoService],
    });
    service = TestBed.inject(CoPilotVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
