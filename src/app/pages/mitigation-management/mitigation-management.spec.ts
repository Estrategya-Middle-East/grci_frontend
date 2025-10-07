import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationManagement } from './mitigation-management';

describe('MitigationManagement', () => {
  let component: MitigationManagement;
  let fixture: ComponentFixture<MitigationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MitigationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MitigationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
