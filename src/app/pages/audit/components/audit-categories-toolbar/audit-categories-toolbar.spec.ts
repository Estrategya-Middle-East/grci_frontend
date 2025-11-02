import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCategoriesToolbar } from './audit-categories-toolbar';

describe('AuditCategoriesToolbar', () => {
  let component: AuditCategoriesToolbar;
  let fixture: ComponentFixture<AuditCategoriesToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCategoriesToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCategoriesToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
