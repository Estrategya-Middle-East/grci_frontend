import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEngagement } from './audit-engagement';

describe('AuditEngagement', () => {
  let component: AuditEngagement;
  let fixture: ComponentFixture<AuditEngagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditEngagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditEngagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
