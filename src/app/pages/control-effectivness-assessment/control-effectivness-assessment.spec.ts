import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEffectivnessAssessment } from './control-effectivness-assessment';

describe('ControlEffectivnessAssessment', () => {
  let component: ControlEffectivnessAssessment;
  let fixture: ComponentFixture<ControlEffectivnessAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlEffectivnessAssessment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEffectivnessAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
