import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dimensions } from './dimensions';

describe('Dimensions', () => {
  let component: Dimensions;
  let fixture: ComponentFixture<Dimensions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dimensions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dimensions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
