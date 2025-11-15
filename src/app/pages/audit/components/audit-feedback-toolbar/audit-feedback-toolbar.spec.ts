import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFeedbackToolbar } from './audit-feedback-toolbar';

describe('AuditFeedbackToolbar', () => {
  let component: AuditFeedbackToolbar;
  let fixture: ComponentFixture<AuditFeedbackToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFeedbackToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditFeedbackToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
