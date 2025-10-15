import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSignificancePopup } from './control-significance-popup';

describe('ControlSignificancePopup', () => {
  let component: ControlSignificancePopup;
  let fixture: ComponentFixture<ControlSignificancePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlSignificancePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlSignificancePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
