import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAutomation } from './control-automation';

describe('ControlAutomation', () => {
  let component: ControlAutomation;
  let fixture: ComponentFixture<ControlAutomation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlAutomation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAutomation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
