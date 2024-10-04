import {TestBed} from '@angular/core/testing';

import {DeepChatCommsService} from './deep-chat-comms.service';

describe('DeepChatCommsService', () => {
  let service: DeepChatCommsService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DeepChatCommsService]});
    service = TestBed.inject(DeepChatCommsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
