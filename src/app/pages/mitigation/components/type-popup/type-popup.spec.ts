import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePopup } from './type-popup';

describe('TypePopup', () => {
  let component: TypePopup;
  let fixture: ComponentFixture<TypePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
