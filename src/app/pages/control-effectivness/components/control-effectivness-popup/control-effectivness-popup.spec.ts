import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEffectivnessPopup } from './control-effectivness-popup';

describe('ControlEffectivnessPopup', () => {
  let component: ControlEffectivnessPopup;
  let fixture: ComponentFixture<ControlEffectivnessPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlEffectivnessPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEffectivnessPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
