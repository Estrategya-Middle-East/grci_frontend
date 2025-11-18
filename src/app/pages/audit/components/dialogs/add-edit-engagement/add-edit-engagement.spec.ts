import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEngagement } from './add-edit-engagement';

describe('AddEditEngagement', () => {
  let component: AddEditEngagement;
  let fixture: ComponentFixture<AddEditEngagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEngagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEngagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
