import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mitigation } from './mitigation';

describe('Mitigation', () => {
  let component: Mitigation;
  let fixture: ComponentFixture<Mitigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mitigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mitigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
