import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEffectivness } from './control-effectivness';

describe('ControlEffectivness', () => {
  let component: ControlEffectivness;
  let fixture: ComponentFixture<ControlEffectivness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlEffectivness]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEffectivness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
