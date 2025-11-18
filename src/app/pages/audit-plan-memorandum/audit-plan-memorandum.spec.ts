import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanMemorandum } from './audit-plan-memorandum';

describe('AuditPlanMemorandum', () => {
  let component: AuditPlanMemorandum;
  let fixture: ComponentFixture<AuditPlanMemorandum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanMemorandum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanMemorandum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
