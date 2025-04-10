import { TestBed } from '@angular/core/testing';

import { EmploisDuTempsService } from './emplois-du-temps.service';

describe('EmploisDuTempsService', () => {
  let service: EmploisDuTempsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploisDuTempsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
