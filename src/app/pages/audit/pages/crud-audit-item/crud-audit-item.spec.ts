import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAuditItem } from './crud-audit-item';

describe('CrudAuditItem', () => {
  let component: CrudAuditItem;
  let fixture: ComponentFixture<CrudAuditItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAuditItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudAuditItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
