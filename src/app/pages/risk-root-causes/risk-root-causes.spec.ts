import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRootCauses } from './risk-root-causes';

describe('RiskRootCauses', () => {
  let component: RiskRootCauses;
  let fixture: ComponentFixture<RiskRootCauses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskRootCauses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskRootCauses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
