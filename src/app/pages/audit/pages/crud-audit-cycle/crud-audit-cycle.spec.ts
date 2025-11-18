import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAuditCycle } from './crud-audit-cycle';

describe('CrudAuditCycle', () => {
  let component: CrudAuditCycle;
  let fixture: ComponentFixture<CrudAuditCycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAuditCycle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudAuditCycle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
