import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPopup } from './rating-popup';

describe('RatingPopup', () => {
  let component: RatingPopup;
  let fixture: ComponentFixture<RatingPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
