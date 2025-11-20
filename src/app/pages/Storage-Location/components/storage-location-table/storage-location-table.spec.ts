import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationTable } from './storage-location-table';

describe('StorageLocationTable', () => {
  let component: StorageLocationTable;
  let fixture: ComponentFixture<StorageLocationTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLocationTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLocationTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
