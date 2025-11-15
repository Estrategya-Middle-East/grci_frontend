import { TestBed } from '@angular/core/testing';

import { ControlEffectivnessAssessmentService } from './control-effectivness-assessment-service';

describe('ControlEffectivnessAssessmentService', () => {
  let service: ControlEffectivnessAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlEffectivnessAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
