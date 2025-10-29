import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import {
  RiskAssessmentInterface,
  RiskAssessmentPayloadInterface,
} from "../../models/risk-management";
import { RiskAssessmentPopup } from "../risk-assessment-popup/risk-assessment-popup";
import { RiskManagementService } from "../../services/risk-management-service";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-risk-assessments",
  imports: [HeaderComponent, GeneralList],
  providers: [DialogService],
  templateUrl: "./risk-assessments-list.html",
  styleUrl: "./risk-assessments-list.scss",
})
export class RiskAssessmentsList {
  activeTab = input.required<number>();
  private service = inject(RiskManagementService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  @ViewChild("riskAssessmentsList")
  riskAssessmentsList!: GeneralList<RiskAssessmentInterface>;

  // -------- Route param as signal --------
  id$ = this.route.paramMap.pipe(map((params) => Number(params.get("id"))));
  riskId = toSignal(this.id$, { initialValue: 0 });

  // -------- Filteration configs --------
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Risk Assessments" },
    import: false,
  };

  // -------- Actions configs --------
  actions: ShowActions = {
    add: { show: true, label: "New Assessment", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  columns: {
    field: keyof RiskAssessmentInterface | "actions";
    header: string;
  }[] = [
    { field: "impactTitle", header: "Risk Impact" },
    { field: "likelihoodTitle", header: "Risk Likelihood" },
    // { field: "assessmentDate", header: "Validity" },
    { field: "score", header: "Risk Score" },
    { field: "ratingTitle", header: "Risk Rating" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  filters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchData = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) =>
    this.service.getRiskAssesmentList(this.riskId(), {
      pageNumber,
      pageSize,
      ...filters,
    });

  // -------- Handle filter changes --------
  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.riskAssessmentsList.loadData(
      this.riskAssessmentsList.pagination,
      this.filters
    );
  }

  // -------- Add --------
  onAdd() {
    const ref = this.dialogService.open(RiskAssessmentPopup, {
      header: "Add Risk Assessment",
      width: "700px",
      modal: true,
      data: { riskId: this.riskId() },
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
      }
    });
  }

  // -------- Edit --------
  onEdit(row: RiskAssessmentInterface) {
    const ref = this.dialogService.open(RiskAssessmentPopup, {
      header: "Edit Risk Assessment",
      width: "700px",
      modal: true,
      data: { riskId: this.riskId(), assessmentId: row.id },
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
      }
    });
  }

  // -------- Delete --------
  onDelete(id: number) {
    this.service
      .deleteRiskAssessment(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Risk assessment deleted successfully 🗑️",
        })
      );
  }

  private reloadList() {
    this.riskAssessmentsList.loadData(
      this.riskAssessmentsList.pagination,
      this.filters
    );
  }
}
