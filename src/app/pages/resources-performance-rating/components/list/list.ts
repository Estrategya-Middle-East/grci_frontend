import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, tap } from "rxjs";

import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

import { ResourcePerformanceInterface } from "../../models/resources-performance-rating";
import { ResourcesPerformanceService } from "../../services/resources-performance-service";
import { appRoutes } from "../../../../app.routes.enum";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    ToastModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private service = inject(ResourcesPerformanceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedDeletedId!: number;
  selectedArchivedId!: number;

  columns = [
    { field: "id", header: "ID" },
    { field: "resourceName", header: "Resource Name" },
    { field: "workingPaperTitle", header: "Working Paper" },
    { field: "ratingDate", header: "Rating Date" },
    { field: "finalEvaluation", header: "Final Evaluation" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  performanceList: ResourcePerformanceInterface[] = [];
  viewData: deleteItemInterface = { title: "", sendLabel: "", sendClose: "" };

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadList(this.pagination);
  }

  loadList(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };

    this.service.getList({ ...filterPayload }).subscribe({
      next: (response) => {
        this.performanceList = response.items;
        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        };
      },
    });
  }

  openDelete(id: number) {
    this.selectedDeletedId = id;
    this.viewData = {
      title: "Delete Resource Performance",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData.title.includes("Delete")) {
      this.service
        .delete(this.selectedDeletedId)
        .pipe(tap(() => this.loadList(this.pagination)))
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Resource Performance deleted successfully 🎉",
            });
          },
        });
    }
  }

  navigateToEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }

  navigateToView(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
