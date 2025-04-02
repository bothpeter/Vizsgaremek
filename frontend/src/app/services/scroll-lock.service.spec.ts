import { TestBed } from '@angular/core/testing';

import { ScrollLockService } from './scroll-lock.service';

describe('ScrollLockService', () => {
  let service: ScrollLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
