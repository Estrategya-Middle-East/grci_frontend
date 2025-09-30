import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-delete-item-selected",
  standalone: true,
  imports: [],
  templateUrl: "./delete-item-selected.component.html",
  styleUrl: "./delete-item-selected.component.scss",
})
export class DeleteItemSelectedComponent {
  @Output() closeOfDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendOfDialog: EventEmitter<any> = new EventEmitter<any>();
  @Input() viewData: {
    id?: any;
    title: string;
    sendLabel: string;
    sendClose: string;
  } = {
    id: null,
    title: "",
    sendLabel: "",
    sendClose: "",
  };
}
