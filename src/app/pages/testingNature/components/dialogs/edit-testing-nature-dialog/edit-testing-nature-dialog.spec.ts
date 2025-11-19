import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestingNatureDialog } from './edit-testing-nature-dialog';

describe('EditTestingNatureDialog', () => {
  let component: EditTestingNatureDialog;
  let fixture: ComponentFixture<EditTestingNatureDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTestingNatureDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestingNatureDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
