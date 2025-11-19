import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEvidenceDialog } from './edit-evidence-dialog';

describe('EditEvidenceDialog', () => {
  let component: EditEvidenceDialog;
  let fixture: ComponentFixture<EditEvidenceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEvidenceDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEvidenceDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
