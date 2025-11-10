import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDesignRating } from './control-design-rating';

describe('ControlDesignRating', () => {
  let component: ControlDesignRating;
  let fixture: ComponentFixture<ControlDesignRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlDesignRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlDesignRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
