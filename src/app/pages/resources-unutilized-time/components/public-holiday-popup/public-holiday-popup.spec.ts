import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHolidayPopup } from './public-holiday-popup';

describe('PublicHolidayPopup', () => {
  let component: PublicHolidayPopup;
  let fixture: ComponentFixture<PublicHolidayPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHolidayPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicHolidayPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
