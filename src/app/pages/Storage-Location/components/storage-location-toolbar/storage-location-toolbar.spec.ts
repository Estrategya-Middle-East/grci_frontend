import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationToolbar } from './storage-location-toolbar';

describe('StorageLocationToolbar', () => {
  let component: StorageLocationToolbar;
  let fixture: ComponentFixture<StorageLocationToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLocationToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLocationToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
