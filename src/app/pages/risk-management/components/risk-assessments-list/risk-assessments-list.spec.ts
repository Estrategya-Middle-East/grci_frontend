import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentsList } from './risk-assessments-list';

describe('RiskAssessmentsList', () => {
  let component: RiskAssessmentsList;
  let fixture: ComponentFixture<RiskAssessmentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAssessmentsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAssessmentsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
