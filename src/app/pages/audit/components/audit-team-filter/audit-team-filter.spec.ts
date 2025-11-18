import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTeamFilter } from './audit-team-filter';

describe('AuditTeamFilter', () => {
  let component: AuditTeamFilter;
  let fixture: ComponentFixture<AuditTeamFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditTeamFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTeamFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
