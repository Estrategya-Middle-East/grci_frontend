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
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { PagedResult } from "../../models/api.mode";
import { DeleteItemSelectedComponent } from "../delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../custom-paginator/custom-paginator.component";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-general-list",
  templateUrl: "./general-list.html",
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    ToastModule,
    CustomPaginatorComponent,
    DeleteItemSelectedComponent,
  ],
  styleUrls: ["./general-list.scss"],
})
export class GeneralList<T = any> implements OnChanges {
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);

  @Input() columns: { field: keyof T | "actions"; header: string }[] = [];
  @Input() isViewAction = false;
  @Input() fetchData!: (filterPayload: {
    pageNumber: number;
    pageSize: number;
    filterField?: string[];
    filterValue?: any[];
  }) => Observable<PagedResult<T>>;
  @Input() active = false;

  @Output() view = new EventEmitter<number>();
  @Output() edit = new EventEmitter<T>();
  @Output() archive = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  @ViewChild("content") content!: TemplateRef<any>;

  data: T[] = [];
  pagination = {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };
  viewData: {
    id: number | null;
    title: string;
    sendLabel: string;
    sendClose: string;
  } = {
    id: null,
    title: "",
    sendClose: "",
    sendLabel: "",
  };

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.active) {
      if (
        changes["filters"] ||
        (changes["active"] && changes["active"].currentValue)
      ) {
        this.pagination.pageNumber = 1;
        this.loadData(this.pagination);
      }
    }
  }

  loadData(pagination: any, filters?: Record<string, any>) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: filters ? Object.keys(filters) : undefined,
      filterValue: filters ? Object.values(filters) : undefined,
    };

    if (this.fetchData) {
      this.fetchData(filterPayload).subscribe((res) => {
        this.data = res.items;
        this.pagination = {
          pageNumber: res.pageNumber,
          pageSize: res.pageSize,
          totalItems: res.totalItems,
          totalPages: res.totalPages,
        };
      });
    }
  }

  onView(id: number) {
    this.view.emit(id);
  }

  onEdit(row: T) {
    this.edit.emit(row);
  }

  onArchive(row: T) {
    this.viewData = {
      id: (row as any).id,
      title: `Archive “${(row as any).id}”`,
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
    if (!this.viewData) return;

    if (this.viewData.title.includes("Delete")) {
      this.delete.emit(this.viewData.id as number);
    } else if (this.viewData.title.includes("Archive")) {
      this.archive.emit(this.viewData.id as number);
    }

    this.modalService.dismissAll();
  }

  close() {
    this.modalService.dismissAll();
  }
}
