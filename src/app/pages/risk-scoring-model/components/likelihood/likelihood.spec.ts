import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Likelihood } from './likelihood';

describe('Likelihood', () => {
  let component: Likelihood;
  let fixture: ComponentFixture<Likelihood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Likelihood]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Likelihood);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
