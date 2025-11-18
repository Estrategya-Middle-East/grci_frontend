import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTeamToolbar } from './audit-team-toolbar';

describe('AuditTeamToolbar', () => {
  let component: AuditTeamToolbar;
  let fixture: ComponentFixture<AuditTeamToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditTeamToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTeamToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
