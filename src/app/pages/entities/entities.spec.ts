import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entities } from './entities';

describe('Entities', () => {
  let component: Entities;
  let fixture: ComponentFixture<Entities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
