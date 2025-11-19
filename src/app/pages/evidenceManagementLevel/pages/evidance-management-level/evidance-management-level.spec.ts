import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidanceManagementLevel } from './evidance-management-level';

describe('EvidanceManagementLevel', () => {
  let component: EvidanceManagementLevel;
  let fixture: ComponentFixture<EvidanceManagementLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidanceManagementLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidanceManagementLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
