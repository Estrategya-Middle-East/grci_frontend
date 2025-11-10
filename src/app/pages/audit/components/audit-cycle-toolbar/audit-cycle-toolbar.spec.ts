import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCycleToolbar } from './audit-cycle-toolbar';

describe('AuditCycleToolbar', () => {
  let component: AuditCycleToolbar;
  let fixture: ComponentFixture<AuditCycleToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCycleToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCycleToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
