import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCategory } from './audit-category';

describe('AuditCategory', () => {
  let component: AuditCategory;
  let fixture: ComponentFixture<AuditCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
