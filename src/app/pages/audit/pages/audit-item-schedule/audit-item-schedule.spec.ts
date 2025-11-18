import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditSchedule } from "./audit-item-schedule";

describe("AuditSchedule", () => {
  let component: AuditSchedule;
  let fixture: ComponentFixture<AuditSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
