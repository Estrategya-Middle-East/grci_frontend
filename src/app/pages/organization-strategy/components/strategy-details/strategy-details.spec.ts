import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetails } from './strategy-details';

describe('StrategyDetails', () => {
  let component: StrategyDetails;
  let fixture: ComponentFixture<StrategyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
