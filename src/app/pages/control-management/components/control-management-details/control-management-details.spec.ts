import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlManagementDetails } from './control-management-details';

describe('ControlManagementDetails', () => {
  let component: ControlManagementDetails;
  let fixture: ComponentFixture<ControlManagementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlManagementDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlManagementDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
