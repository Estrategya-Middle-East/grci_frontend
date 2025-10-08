import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { map, tap } from "rxjs";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ToastModule } from "primeng/toast";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { MessageService } from "primeng/api";
import { MitigationManagementService } from "../../services/mitigation-management";
import { MitigationPlan } from "../../models/mitigation-management";

@Component({
  selector: "app-list",
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    ToastModule,
    CustomPaginatorComponent,
  ],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private service = inject(MitigationManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;
  selectedPlanId!: number;
  selectedArchivePlanId!: number;

  columns: any[] = [
    { field: "name", header: "Mitigation plans Name" },
    { field: "validity", header: "Validity" },
    { field: "status", header: "Status" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  mitigationPlans: MitigationPlan[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadPlans(this.pagination);
  }

  loadPlans(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };

    this.service.getMitigationPlans(filterPayload).subscribe({
      next: (response) => {
        this.mitigationPlans = response.items.map((plan) => ({
          ...plan,
          validity: `${this.formatDate(plan.validityFrom)} - ${this.formatDate(
            plan.validityTo
          )}`,
          statusLabel: plan.status === 1 ? "Active" : "Draft",
        }));

        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        };
      },
    });
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  openDelete(id: number) {
    this.selectedPlanId = id;
    this.viewData = {
      title: "Delete Mitigation Plan",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(plan: MitigationPlan) {
    this.selectedArchivePlanId = plan.id;
    this.viewData = {
      title: `Archive “${plan.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.service
        .deleteMitigationPlan(this.selectedPlanId)
        .pipe(tap(() => this.loadPlans(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Mitigation Plan deleted successfully 🎉",
            });
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData?.title?.includes("Archive")) {
      this.service
        .archive(this.selectedArchivePlanId)
        .pipe(tap(() => this.loadPlans(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Mitigation Plan has been archived successfully.",
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
}
