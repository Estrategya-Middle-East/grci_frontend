import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RistRootCausesPopup } from "./risk-root-causes-popup";

describe("RistRootCausesPopup", () => {
  let component: RistRootCausesPopup;
  let fixture: ComponentFixture<RistRootCausesPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RistRootCausesPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(RistRootCausesPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
