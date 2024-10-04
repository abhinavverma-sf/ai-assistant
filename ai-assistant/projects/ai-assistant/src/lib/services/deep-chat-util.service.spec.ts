import {TestBed} from '@angular/core/testing';

import {DeepChatUtilService} from './deep-chat-util.service';

describe('DeepChatUtilService', () => {
  let service: DeepChatUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DeepChatUtilService]});
    service = TestBed.inject(DeepChatUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
