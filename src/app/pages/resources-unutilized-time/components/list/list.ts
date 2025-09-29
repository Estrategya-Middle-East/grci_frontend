import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  ViewChild,
  TemplateRef,
  SimpleChanges,
} from "@angular/core";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastModule } from "primeng/toast";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { Observable } from "rxjs";

@Component({
  selector: "app-list",
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    ToastModule,
    CustomPaginatorComponent,
    DeleteItemSelectedComponent,
  ],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List implements OnChanges {
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);

  @Input() columns: any[] = [];
  @Input() fetchData!: (filterPayload: {
    pageNumber: number;
    pageSize: number;
  }) => Observable<any>;
  @Input() active = false;

  @Output() view = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() archive = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  @ViewChild("content") content!: TemplateRef<any>;

  data: any[] = [];
  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };
  loaded = false;
  viewData: any;

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnChanges() {
    if (this.active && !this.loaded) {
      this.loadData(1);
    }
  }

  loadData(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    if (this.fetchData) {
      this.fetchData(filterPayload).subscribe((res: any) => {
        this.data = res.items || res.data?.items || [];
        this.pagination = {
          pageNumber: res.pageNumber,
          pageSize: res.pageSize,
          totalItems: res.totalItems,
          totalPages: res.totalPages,
        };
        this.loaded = true;
      });
    }
  }

  // === Actions ===
  onView(id: number) {
    this.view.emit(id);
  }

  onEdit(id: number) {
    this.edit.emit(id);
  }

  onArchive(row: any) {
    this.viewData = {
      id: row.id,
      title: `Archive “${row.id}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.openDialog();
  }

  onDelete(id: number) {
    this.viewData = {
      id,
      title: `Delete Item “${id}”`,
      sendLabel: "Confirm Delete",
      sendClose: "Cancel",
    };
    this.openDialog();
  }

  openDialog() {
    this.modalService.open(this.content, { centered: true });
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.delete.emit(this.viewData.id);
    } else if (this.viewData?.title?.includes("Archive")) {
      this.archive.emit(this.viewData.row);
    }
    this.modalService.dismissAll();
  }

  close() {
    this.modalService.dismissAll();
  }
}
