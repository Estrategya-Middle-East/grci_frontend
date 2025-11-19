import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingNature } from './testing-nature';

describe('TestingNature', () => {
  let component: TestingNature;
  let fixture: ComponentFixture<TestingNature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingNature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingNature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
