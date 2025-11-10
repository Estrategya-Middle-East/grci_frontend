import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCycle } from './audit-cycle';

describe('AuditCycle', () => {
  let component: AuditCycle;
  let fixture: ComponentFixture<AuditCycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCycle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCycle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
