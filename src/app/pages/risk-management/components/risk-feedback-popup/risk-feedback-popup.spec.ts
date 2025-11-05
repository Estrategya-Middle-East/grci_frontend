import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskFeedbackPopup } from './risk-feedback-popup';

describe('RiskFeedbackPopup', () => {
  let component: RiskFeedbackPopup;
  let fixture: ComponentFixture<RiskFeedbackPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskFeedbackPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskFeedbackPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
