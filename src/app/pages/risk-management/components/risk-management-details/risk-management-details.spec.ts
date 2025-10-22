import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagementDetails } from './risk-management-details';

describe('RiskManagementDetails', () => {
  let component: RiskManagementDetails;
  let fixture: ComponentFixture<RiskManagementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskManagementDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskManagementDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
