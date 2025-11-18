import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTeam } from './audit-team';

describe('AuditTeam', () => {
  let component: AuditTeam;
  let fixture: ComponentFixture<AuditTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
