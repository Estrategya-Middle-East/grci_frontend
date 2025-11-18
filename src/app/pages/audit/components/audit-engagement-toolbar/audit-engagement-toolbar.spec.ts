import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEngagementToolbar } from './audit-engagement-toolbar';

describe('AuditEngagementToolbar', () => {
  let component: AuditEngagementToolbar;
  let fixture: ComponentFixture<AuditEngagementToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditEngagementToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditEngagementToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
