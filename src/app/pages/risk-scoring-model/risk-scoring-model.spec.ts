import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskScoringModel } from './risk-scoring-model';

describe('RiskScoringModel', () => {
  let component: RiskScoringModel;
  let fixture: ComponentFixture<RiskScoringModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskScoringModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskScoringModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
