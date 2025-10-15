import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSignificance } from './control-significance';

describe('ControlSignificance', () => {
  let component: ControlSignificance;
  let fixture: ComponentFixture<ControlSignificance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlSignificance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlSignificance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
