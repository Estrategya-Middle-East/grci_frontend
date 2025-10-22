import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentPopup } from './risk-assessment-popup';

describe('RiskAssessmentPopup', () => {
  let component: RiskAssessmentPopup;
  let fixture: ComponentFixture<RiskAssessmentPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAssessmentPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAssessmentPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
