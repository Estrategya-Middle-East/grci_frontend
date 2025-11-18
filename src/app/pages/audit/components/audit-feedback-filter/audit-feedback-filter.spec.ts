import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFeedbackFilter } from './audit-feedback-filter';

describe('AuditFeedbackFilter', () => {
  let component: AuditFeedbackFilter;
  let fixture: ComponentFixture<AuditFeedbackFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFeedbackFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditFeedbackFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
