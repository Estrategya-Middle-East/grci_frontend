import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditToolbar } from './audit-toolbar';

describe('AuditToolbar', () => {
  let component: AuditToolbar;
  let fixture: ComponentFixture<AuditToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
