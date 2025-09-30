import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactPopup } from './impact-popup';

describe('ImpactPopup', () => {
  let component: ImpactPopup;
  let fixture: ComponentFixture<ImpactPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpactPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
