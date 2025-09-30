import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekEnd } from './week-end';

describe('WeekEnd', () => {
  let component: WeekEnd;
  let fixture: ComponentFixture<WeekEnd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekEnd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekEnd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
