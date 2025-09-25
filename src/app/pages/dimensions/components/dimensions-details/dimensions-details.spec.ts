import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionsDetails } from './dimensions-details';

describe('DimensionsDetails', () => {
  let component: DimensionsDetails;
  let fixture: ComponentFixture<DimensionsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimensionsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensionsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
