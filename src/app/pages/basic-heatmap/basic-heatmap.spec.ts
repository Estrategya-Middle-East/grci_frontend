import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicHeatmap } from './basic-heatmap';

describe('BasicHeatmap', () => {
  let component: BasicHeatmap;
  let fixture: ComponentFixture<BasicHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
