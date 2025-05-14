import { TestBed } from '@angular/core/testing';

import { BibliothequeService } from './bibliotheque.service';

describe('BibliothequeService', () => {
  let service: BibliothequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliothequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
