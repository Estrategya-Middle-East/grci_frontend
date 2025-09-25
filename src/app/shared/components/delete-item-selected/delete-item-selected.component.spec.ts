import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemSelectedComponent } from './delete-item-selected.component';

describe('DeleteItemSelectedComponent', () => {
  let component: DeleteItemSelectedComponent;
  let fixture: ComponentFixture<DeleteItemSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteItemSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteItemSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
