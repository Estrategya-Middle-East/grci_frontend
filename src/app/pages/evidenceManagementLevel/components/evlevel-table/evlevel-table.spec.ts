import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EVLevelTable } from './evlevel-table';

describe('EVLevelTable', () => {
  let component: EVLevelTable;
  let fixture: ComponentFixture<EVLevelTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EVLevelTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EVLevelTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
