import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesFunctionsPopup } from './resources-functions-popup';

describe('ResourcesFunctionsPopup', () => {
  let component: ResourcesFunctionsPopup;
  let fixture: ComponentFixture<ResourcesFunctionsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesFunctionsPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesFunctionsPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
