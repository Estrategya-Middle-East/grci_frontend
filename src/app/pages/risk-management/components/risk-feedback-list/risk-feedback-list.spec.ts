import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskFeedbackList } from './risk-feedback-list';

describe('RiskFeedbackList', () => {
  let component: RiskFeedbackList;
  let fixture: ComponentFixture<RiskFeedbackList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskFeedbackList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskFeedbackList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
