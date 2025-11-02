import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudtiFrequanciesToolbar } from './audti-frequancies-toolbar';

describe('AudtiFrequanciesToolbar', () => {
  let component: AudtiFrequanciesToolbar;
  let fixture: ComponentFixture<AudtiFrequanciesToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudtiFrequanciesToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudtiFrequanciesToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
