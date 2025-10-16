import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlManagement } from './control-management';

describe('ControlManagement', () => {
  let component: ControlManagement;
  let fixture: ComponentFixture<ControlManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
