import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MititgationManagementDetails } from './mititgation-management-details';

describe('MititgationManagementDetails', () => {
  let component: MititgationManagementDetails;
  let fixture: ComponentFixture<MititgationManagementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MititgationManagementDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MititgationManagementDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
