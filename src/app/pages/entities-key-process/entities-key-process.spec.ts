import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesKeyProcess } from './entities-key-process';

describe('EntitiesKeyProcess', () => {
  let component: EntitiesKeyProcess;
  let fixture: ComponentFixture<EntitiesKeyProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesKeyProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitiesKeyProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
