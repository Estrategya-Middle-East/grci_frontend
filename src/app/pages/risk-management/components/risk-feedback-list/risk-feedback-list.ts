import { Component, ViewChild, inject, input } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { RiskManagementService } from "../../services/risk-management-service";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  RiskFeedbackInterface,
  RiskFeedbackStatusEnum,
} from "../../models/risk-management";
import { RiskFeedbackPopup } from "../risk-feedback-popup/risk-feedback-popup";

@Component({
  selector: "app-risk-feedback-list",
  imports: [HeaderComponent, GeneralList],
  providers: [DialogService],
  templateUrl: "./risk-feedback-list.html",
  styleUrl: "./risk-feedback-list.scss",
})
export class RiskFeedbackList {
  activeTab = input.required<number>();
  private service = inject(RiskManagementService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  @ViewChild("feedbackList") feedbackList!: GeneralList<RiskFeedbackInterface>;

  // -------- Route param as signal --------
  id$ = this.route.paramMap.pipe(map((params) => Number(params.get("id"))));
  riskId = toSignal(this.id$, { initialValue: 0 });

  // -------- Filteration configs --------
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Risk Feedback" },
    import: false,
  };

  // -------- Actions configs --------
  actions: ShowActions = {
    add: { show: true, label: "New Feedback", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  columns: {
    field: keyof RiskFeedbackInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "riskId", header: "Risk Id" },
    { field: "status", header: "Status" },
    { field: "feedback", header: "Feedback" },
    { field: "reviewedByName", header: "Reviewed By" },
    { field: "reviewedAt", header: "Reviewed At" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  filters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchData = ({ pageNumber = 1, pageSize = 10, ...filters } = {}) =>
    this.service
      .getRiskFeedbackList(this.riskId(), { pageNumber, pageSize, ...filters })
      .pipe(
        map((response) => {
          return {
            ...response,
            items: response.items.map((item: RiskFeedbackInterface) => ({
              ...item,
              status:
                item.status === RiskFeedbackStatusEnum.Approved
                  ? "Approved"
                  : item.status === RiskFeedbackStatusEnum.Rejected
                  ? "Rejected"
                  : "-",
            })),
          };
        })
      );

  // -------- Handle filter changes --------
  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.feedbackList.loadData(this.feedbackList.pagination, this.filters);
  }

  // -------- Add --------
  onAdd() {
    const ref = this.dialogService.open(RiskFeedbackPopup, {
      header: "Add Risk Feedback",
      width: "700px",
      modal: true,
      data: { riskId: this.riskId() },
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Edit --------
  onEdit(row: RiskFeedbackInterface) {
    const ref = this.dialogService.open(RiskFeedbackPopup, {
      header: "Edit Risk Feedback",
      width: "700px",
      modal: true,
      data: { riskId: this.riskId(), feedbackId: row.id },
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Delete --------
  onDelete(id: number) {
    this.service
      .deleteRiskFeedback(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Risk feedback deleted successfully 🗑️",
        })
      );
  }

  // -------- Archive --------
  onArchive(id: number) {
    this.service
      .archiveRiskFeedback(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Risk feedback archived successfully",
        })
      );
  }

  private reloadList() {
    this.feedbackList.loadData(this.feedbackList.pagination, this.filters);
  }
}
