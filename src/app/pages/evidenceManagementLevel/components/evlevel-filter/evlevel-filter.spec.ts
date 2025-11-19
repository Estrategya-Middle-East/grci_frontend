import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EVLevelFilter } from './evlevel-filter';

describe('EVLevelFilter', () => {
  let component: EVLevelFilter;
  let fixture: ComponentFixture<EVLevelFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EVLevelFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EVLevelFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
