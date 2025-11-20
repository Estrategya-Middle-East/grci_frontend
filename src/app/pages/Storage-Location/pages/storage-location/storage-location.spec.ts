import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocation } from './storage-location';

describe('StorageLocation', () => {
  let component: StorageLocation;
  let fixture: ComponentFixture<StorageLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
