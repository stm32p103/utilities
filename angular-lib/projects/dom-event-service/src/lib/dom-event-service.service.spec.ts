import { TestBed } from '@angular/core/testing';

import { DomEventServiceService } from './dom-event-service.service';

describe('DomEventServiceService', () => {
  let service: DomEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomEventServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
