import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDesignDetails } from './control-design-details';

describe('ControlDesignDetails', () => {
  let component: ControlDesignDetails;
  let fixture: ComponentFixture<ControlDesignDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlDesignDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlDesignDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
