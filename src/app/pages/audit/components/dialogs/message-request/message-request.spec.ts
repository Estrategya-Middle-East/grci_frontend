import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRequest } from './message-request';

describe('MessageRequest', () => {
  let component: MessageRequest;
  let fixture: ComponentFixture<MessageRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
