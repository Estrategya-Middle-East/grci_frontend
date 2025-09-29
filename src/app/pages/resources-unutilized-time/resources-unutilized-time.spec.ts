import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesUnutilizedTime } from './resources-unutilized-time';

describe('ResourcesUnutilizedTime', () => {
  let component: ResourcesUnutilizedTime;
  let fixture: ComponentFixture<ResourcesUnutilizedTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesUnutilizedTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesUnutilizedTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
