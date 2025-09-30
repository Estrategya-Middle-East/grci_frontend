import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikelihoodPopup } from './likelihood-popup';

describe('LikelihoodPopup', () => {
  let component: LikelihoodPopup;
  let fixture: ComponentFixture<LikelihoodPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikelihoodPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikelihoodPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
