import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditFrequencyDialog } from './add-audit-frequency-dialog';

describe('AddAuditFrequencyDialog', () => {
  let component: AddAuditFrequencyDialog;
  let fixture: ComponentFixture<AddAuditFrequencyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAuditFrequencyDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAuditFrequencyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
