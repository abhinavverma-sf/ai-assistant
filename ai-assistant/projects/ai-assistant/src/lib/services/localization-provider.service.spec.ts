import {TestBed} from '@angular/core/testing';

import {LocalizationProviderService} from './localization-provider.service';

describe('LocalizationProviderService', () => {
  let service: LocalizationProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizationProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
