import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPerformanceRating } from './resources-performance-rating';

describe('ResourcesPerformanceRating', () => {
  let component: ResourcesPerformanceRating;
  let fixture: ComponentFixture<ResourcesPerformanceRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPerformanceRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesPerformanceRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
