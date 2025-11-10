import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, tap } from "rxjs";

import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { ControlDesignRatingService } from "../../services/control-design-rating";
import { ControlRiskRating } from "../../models/control-design-rating";

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

  private service = inject(ControlDesignRatingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedDeletedId!: number;
  selectedArchivedId!: number;

  columns = [
    { field: "id", header: "ID" },
    { field: "controlName", header: "Control Name" },
    { field: "riskEvent", header: "Risk Event" },
    { field: "sensitivity", header: "Sensitivity" },
    { field: "sensitivityWeight", header: "Sensitivity Weight" },
    { field: "reliability", header: "Reliability" },
    { field: "reliabilityWeight", header: "Reliability Weight" },
    { field: "override", header: "Override" },
    { field: "overrideWeight", header: "Override Weight" },
    { field: "correction", header: "Correction" },
    { field: "competence", header: "Competence" },
    { field: "competenceWeight", header: "Competence Weight" },
    { field: "rating", header: "Rating" },
    { field: "remarks", header: "Remark" },
    { field: "ratingDate", header: "Rating Date" },
    { field: "totalWeight", header: "Total Weight" },
    { field: "createdBy", header: "Created By" },
    { field: "createdDate", header: "Created Date" },
    { field: "updatedBy", header: "Updated By" },
    { field: "updatedDate", header: "Updated Date" },
    { field: "isArchived", header: "Is Archived" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  performanceList: ControlRiskRating[] = [];
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
      title: "Delete Control Design Rating",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(id: number) {
    this.selectedArchivedId = id;
    this.viewData = {
      title: `Archive Control Design Rating”`,
      sendLabel: "Confirm Archive",
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
              detail: "Control rating deleted successfully 🎉",
            });
          },
        });
    } else if (this.viewData?.title?.includes("Archive")) {
      this.service
        .archive(this.selectedArchivedId)
        .pipe(tap(() => this.loadList(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Control design rating archived successfully.",
            });
            this.modalService.dismissAll();
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
