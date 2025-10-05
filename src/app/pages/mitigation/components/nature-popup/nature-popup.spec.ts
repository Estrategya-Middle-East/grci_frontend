import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturePopup } from './nature-popup';

describe('NaturePopup', () => {
  let component: NaturePopup;
  let fixture: ComponentFixture<NaturePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
