import { TestBed } from '@angular/core/testing';

import { EVManagmentService } from './evmanagment-service';

describe('EVManagmentService', () => {
  let service: EVManagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EVManagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
