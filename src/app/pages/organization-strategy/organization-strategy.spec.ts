import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationStrategy } from './organization-strategy';

describe('OrganizationStrategy', () => {
  let component: OrganizationStrategy;
  let fixture: ComponentFixture<OrganizationStrategy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationStrategy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationStrategy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
