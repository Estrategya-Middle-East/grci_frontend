import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOwnerPopup } from './assign-owner-popup';

describe('AssignOwnerPopup', () => {
  let component: AssignOwnerPopup;
  let fixture: ComponentFixture<AssignOwnerPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignOwnerPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOwnerPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
