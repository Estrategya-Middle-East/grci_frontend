import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStorageLocation } from './add-edit-storage-location';

describe('AddEditStorageLocation', () => {
  let component: AddEditStorageLocation;
  let fixture: ComponentFixture<AddEditStorageLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditStorageLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditStorageLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
