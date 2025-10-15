import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNaturePopup } from './control-nature-popup';

describe('ControlNaturePopup', () => {
  let component: ControlNaturePopup;
  let fixture: ComponentFixture<ControlNaturePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlNaturePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlNaturePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
