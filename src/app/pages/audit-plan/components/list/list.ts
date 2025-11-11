import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { tap } from "rxjs";

import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

import { AuditPlanInterface } from "../../models/audit-plan";
import { AuditPlanService } from "../../services/audit-plan-service";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    TableModule,
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

  private service = inject(AuditPlanService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedDeletedId!: number;
  viewData: deleteItemInterface = { title: "", sendLabel: "", sendClose: "" };

  columns = [
    { field: "id", header: "Audit Plan ID" },
    { field: "title", header: "Audit Item" },
    { field: "year", header: "Year" },
    { field: "auditScope", header: "Audit Scope" },
    { field: "auditObjectives", header: "Audit Objectives" },
    { field: "statusName", header: "Status" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = { pageNumber: 1, pageSize: 10 };
  auditPlanList: AuditPlanInterface[] = [];

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

    this.service.getList(filterPayload).subscribe({
      next: (response) => {
        this.auditPlanList = response.items;
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
      title: "Delete Audit Plan",
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
              detail: "Audit Plan deleted successfully 🎉",
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
}
