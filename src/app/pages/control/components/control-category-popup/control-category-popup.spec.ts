import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCategoryPopup } from './control-category-popup';

describe('ControlCategoryPopup', () => {
  let component: ControlCategoryPopup;
  let fixture: ComponentFixture<ControlCategoryPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlCategoryPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlCategoryPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
