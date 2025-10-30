import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFrequency } from './audit-frequency';

describe('AuditFrequency', () => {
  let component: AuditFrequency;
  let fixture: ComponentFixture<AuditFrequency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFrequency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditFrequency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
