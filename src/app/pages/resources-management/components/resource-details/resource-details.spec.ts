import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetails } from './resource-details';

describe('ResourceDetails', () => {
  let component: ResourceDetails;
  let fixture: ComponentFixture<ResourceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
