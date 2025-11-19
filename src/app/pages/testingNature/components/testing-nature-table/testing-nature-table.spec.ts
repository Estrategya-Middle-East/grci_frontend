import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingNatureTable } from './testing-nature-table';

describe('TestingNatureTable', () => {
  let component: TestingNatureTable;
  let fixture: ComponentFixture<TestingNatureTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingNatureTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingNatureTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
