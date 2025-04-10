import { TestBed } from '@angular/core/testing';

import { EmargementService } from './emargement.service';

describe('EmargementService', () => {
  let service: EmargementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmargementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
