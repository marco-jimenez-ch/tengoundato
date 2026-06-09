import { TestBed } from '@angular/core/testing';

import { Tecnicos } from './tecnicos';

describe('Tecnicos', () => {
  let service: Tecnicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tecnicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
