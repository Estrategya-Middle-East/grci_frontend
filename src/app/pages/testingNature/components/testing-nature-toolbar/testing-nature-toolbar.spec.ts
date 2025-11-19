import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingNatureToolbar } from './testing-nature-toolbar';

describe('TestingNatureToolbar', () => {
  let component: TestingNatureToolbar;
  let fixture: ComponentFixture<TestingNatureToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingNatureToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingNatureToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
