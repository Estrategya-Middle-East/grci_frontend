import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EVLevelToolbar } from './evlevel-toolbar';

describe('EVLevelToolbar', () => {
  let component: EVLevelToolbar;
  let fixture: ComponentFixture<EVLevelToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EVLevelToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EVLevelToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
