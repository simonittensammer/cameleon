import { TestBed } from '@angular/core/testing';

import { CamService } from './cam.service';

describe('CamService', () => {
  let service: CamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
