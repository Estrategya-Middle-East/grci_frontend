import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nature } from './nature';

describe('Nature', () => {
  let component: Nature;
  let fixture: ComponentFixture<Nature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
