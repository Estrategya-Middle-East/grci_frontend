import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesFunctions } from './resources-functions';

describe('ResourcesFunctions', () => {
  let component: ResourcesFunctions;
  let fixture: ComponentFixture<ResourcesFunctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesFunctions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesFunctions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
