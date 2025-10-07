import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyProcessDetails } from './key-process-details';

describe('KeyProcessDetails', () => {
  let component: KeyProcessDetails;
  let fixture: ComponentFixture<KeyProcessDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyProcessDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyProcessDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
