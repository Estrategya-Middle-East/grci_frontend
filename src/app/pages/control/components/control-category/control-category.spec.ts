import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCategory } from './control-category';

describe('ControlCategory', () => {
  let component: ControlCategory;
  let fixture: ComponentFixture<ControlCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
