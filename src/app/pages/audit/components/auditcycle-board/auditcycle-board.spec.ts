import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditcycleBoard } from './auditcycle-board';

describe('AuditcycleBoard', () => {
  let component: AuditcycleBoard;
  let fixture: ComponentFixture<AuditcycleBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditcycleBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditcycleBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
