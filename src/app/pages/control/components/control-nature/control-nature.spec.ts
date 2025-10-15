import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNature } from './control-nature';

describe('ControlNature', () => {
  let component: ControlNature;
  let fixture: ComponentFixture<ControlNature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlNature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlNature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
