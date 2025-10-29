import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-message-request',
  imports: [],
  templateUrl: './message-request.html',
  styleUrl: './message-request.scss'
})
export class MessageRequest {
itemName: string = 'item selected';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (config.data?.itemName) {
      this.itemName = config.data.itemName;
    }
  }

  onCancel() {
    this.ref.close(false);
  }

  onConfirm() {
    this.ref.close(true);
  }
}
