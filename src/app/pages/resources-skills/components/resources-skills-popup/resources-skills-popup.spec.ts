import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSkillsPopup } from './resources-skills-popup';

describe('ResourcesSkillsPopup', () => {
  let component: ResourcesSkillsPopup;
  let fixture: ComponentFixture<ResourcesSkillsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSkillsPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesSkillsPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
