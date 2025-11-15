import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFeedback } from './audit-feedback';

describe('AuditFeedback', () => {
  let component: AuditFeedback;
  let fixture: ComponentFixture<AuditFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
