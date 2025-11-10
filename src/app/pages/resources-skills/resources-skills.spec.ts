import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSkills } from './resources-skills';

describe('ResourcesSkills', () => {
  let component: ResourcesSkills;
  let fixture: ComponentFixture<ResourcesSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
