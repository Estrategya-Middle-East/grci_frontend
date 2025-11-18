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

import { AuditPlanMemorandumListInterface } from "../../models/audit-plan-memorandum";
import { AuditPlanMemorandumServie } from "../../services/audit-plan-memorandum-service";

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

  private service = inject(AuditPlanMemorandumServie);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedDeletedId!: number;
  selectedArchivedId!: number;
  viewData: deleteItemInterface = { title: "", sendLabel: "", sendClose: "" };

  // Columns for the Memorandum Table
  columns = [
    { field: "memorandumCode", header: "Memorandum Code" },
    { field: "auditPlanCode", header: "Audit Plan Code" },
    { field: "engagementName", header: "Engagement" },
    { field: "auditScope", header: "Audit Scope" },
    { field: "auditItemName", header: "Audit Item" },
    { field: "objectives", header: "Objectives" },
    { field: "auditApproach", header: "Audit Approach" },
    { field: "keyRisksAddressed", header: "Key Risks Addressed" },
    { field: "approvalRemarks", header: "Approval Remarks" },
    { field: "approvalDate", header: "Approval Date" },
    { field: "statusName", header: "Status" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = { pageNumber: 1, pageSize: 10 };
  memorandumList: AuditPlanMemorandumListInterface[] = [];

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
        this.memorandumList = response.items;
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
      title: "Delete Audit Plan Memorandum",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(id: number) {
    this.selectedArchivedId = id;
    this.viewData = {
      title: "Archive Audit Plan Memorandum",
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
              detail: "Audit plan memorandum deleted successfully 🎉",
            });
          },
        });

      return;
    }

    if (this.viewData.title.includes("Archive")) {
      this.service
        .archive(this.selectedArchivedId)
        .pipe(tap(() => this.loadList(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Audit plan memorandum archived successfully.",
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
