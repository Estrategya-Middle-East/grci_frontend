import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagement } from './risk-management';

describe('RiskManagement', () => {
  let component: RiskManagement;
  let fixture: ComponentFixture<RiskManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
