import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationPopup } from './automation-popup';

describe('AutomationPopup', () => {
  let component: AutomationPopup;
  let fixture: ComponentFixture<AutomationPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomationPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomationPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
