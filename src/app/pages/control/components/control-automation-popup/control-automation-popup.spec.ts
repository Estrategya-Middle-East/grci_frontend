import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAutomationPopup } from './control-automation-popup';

describe('ControlAutomationPopup', () => {
  let component: ControlAutomationPopup;
  let fixture: ComponentFixture<ControlAutomationPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlAutomationPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAutomationPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
