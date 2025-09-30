import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekEndPopup } from './week-end-popup';

describe('WeekEndPopup', () => {
  let component: WeekEndPopup;
  let fixture: ComponentFixture<WeekEndPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekEndPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekEndPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
