import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditItem } from './audit-item';

describe('AuditItem', () => {
  let component: AuditItem;
  let fixture: ComponentFixture<AuditItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
