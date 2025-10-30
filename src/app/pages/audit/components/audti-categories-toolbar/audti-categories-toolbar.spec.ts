import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudtiCategoriesToolbar } from './audti-categories-toolbar';

describe('AudtiCategoriesToolbar', () => {
  let component: AudtiCategoriesToolbar;
  let fixture: ComponentFixture<AudtiCategoriesToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudtiCategoriesToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudtiCategoriesToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
