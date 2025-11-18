import { Component, Input, OnChanges, ViewChild, inject } from "@angular/core";
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
import { RiskManagementService } from "../../services/risk-management-service";
import { RiskManagementInterface } from "../../models/risk-management";
import { DialogService } from "primeng/dynamicdialog";
import { AssignOwnerPopup } from "../assign-owner-popup/assign-owner-popup";
import { CommonModule } from "@angular/common";
import { appRoutes } from "../../../../app.routes.enum";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    ToastModule,
    CommonModule,
    CustomPaginatorComponent,
  ],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private service = inject(RiskManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);

  @ViewChild("content", { static: false }) content: any;

  selectedRiskId!: number;
  selectedArchiveRiskId!: number;

  columns: any[] = [
    { field: "code", header: "Code" },
    { field: "riskEvent", header: "Risk Event" },
    { field: "riskDriver", header: "Risk Driver" },
    { field: "dimensionName", header: "Dimension" },
    { field: "entityName", header: "Entity" },
    { field: "processName", header: "Key Process" },
    { field: "riskCategoryName", header: "Risk Category" },
    { field: "latestLikelihood", header: "Likelihood (1–5)" },
    { field: "latestImpact", header: "Impact (1–5)" },
    { field: "latestRiskScore", header: "Risk Score" },
    { field: "latestRiskRating", header: "Risk Rating" },
    { field: "riskOwnerName", header: "Risk Owner" },
    { field: "status", header: "Status" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  risks: RiskManagementInterface[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadRisks(this.pagination);
  }

  loadRisks(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };

    this.service.getRisks(filterPayload).subscribe({
      next: (response) => {
        this.risks = response.items.map((risk) => ({
          ...risk,
          latestRiskScore:
            (risk.latestImpact || 0) * (risk.latestLikelihood || 0),
          statusLabel: this.getStatusLabel(risk.status),
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

  getStatusLabel(status: number | undefined) {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Archived";
      case 3:
        return "Closed";
      default:
        return "Draft";
    }
  }

  openDelete(id: number) {
    this.selectedRiskId = id;
    this.viewData = {
      title: "Delete Risk",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(risk: RiskManagementInterface) {
    this.selectedArchiveRiskId = risk.id as number;
    this.viewData = {
      title: `Archive “${risk.riskEvent}”`,
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
        .deleteRisk(this.selectedRiskId)
        .pipe(tap(() => this.loadRisks(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Risk deleted successfully 🎉",
            });
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData?.title?.includes("Archive")) {
      this.service
        .archiveRisk(this.selectedArchiveRiskId)
        .pipe(tap(() => this.loadRisks(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Risk archived successfully.",
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

  assignRiskOwner(row: RiskManagementInterface) {
    const ref = this.dialogService.open(AssignOwnerPopup, {
      header: `Assign Risk Owner for “${row.riskEvent}”`,
      width: "600px",
      modal: true,
      data: {
        riskId: row.id,
        currentOwnerId: row.riskOwnerId || null,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result?.riskOwnerId && result.riskOwnerId !== row.riskOwnerId) {
        this.messageService.add({
          severity: "success",
          summary: "Assigned",
          detail: "Risk owner assigned successfully 🎉",
        });
        this.loadRisks(this.pagination);
      }
    });
  }

  openRiskAssessment(row: RiskManagementInterface) {
    this.router.navigate([row.id, appRoutes["RISK-ASSESSMENTS"]], {
      relativeTo: this.route,
    });
  }
  openRiskFeedback(row: RiskManagementInterface) {
    this.router.navigate([row.id, appRoutes["RISK-FEEDBACK"]], {
      relativeTo: this.route,
    });
  }
}
