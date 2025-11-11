import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEffectivnessAssessmentPopup } from './control-effectivness-assessment-popup';

describe('ControlEffectivnessAssessmentPopup', () => {
  let component: ControlEffectivnessAssessmentPopup;
  let fixture: ComponentFixture<ControlEffectivnessAssessmentPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlEffectivnessAssessmentPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEffectivnessAssessmentPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
