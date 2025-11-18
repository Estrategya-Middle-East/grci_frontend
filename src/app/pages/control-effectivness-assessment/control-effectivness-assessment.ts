import { Component, ViewChild, inject } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { HeaderComponent } from "../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { ControlEffectivnessAssessmentPopup } from "./components/control-effectivness-assessment-popup/control-effectivness-assessment-popup";
import { ControlEffectivnessAssessmentInterface } from "./models/control-effectivness-assessment";
import { ControlEffectivnessAssessmentService } from "./services/control-effectivness-assessment-service";

@Component({
  selector: "app-control-effectivness-assessment",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-effectivness-assessment.html",
  styleUrls: ["./control-effectivness-assessment.scss"],
  providers: [DialogService],
})
export class ControlEffectivnessAssessment {
  private service = inject(ControlEffectivnessAssessmentService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("assessmentList")
  assessmentList!: GeneralList<ControlEffectivnessAssessmentInterface>;

  // -------- Filteration configs --------
  assessmentFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Assessments" },
    import: false,
  };

  // -------- Actions configs --------
  assessmentActions: ShowActions = {
    add: { show: true, label: "New Assessment", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  assessmentColumns: {
    field: keyof ControlEffectivnessAssessmentInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "riskEvent", header: "Risk Event" },
    { field: "controlName", header: "Control Name" },
    { field: "effectivenessPercentage", header: "Effectiveness" },
    { field: "effectivenessLevelName", header: "Effectiveness Level" },
    { field: "assessmentDate", header: "Assessment Date" },
    { field: "assessedByName", header: "Assessed By" },
    { field: "comments", header: "Comments" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  assessmentFilters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchAssessments = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) =>
    this.service.getList({ pageNumber, pageSize, ...filters }).pipe(
      map((result) => ({
        ...result,
        items: result.items.map((item) => ({
          ...item,
          assessmentDate: this.formatDate(item.assessmentDate),
        })),
      }))
    );

  // -------- Handle filters --------
  onFiltersChange(filters: Record<string, any>) {
    this.assessmentFilters = { ...filters };
    this.assessmentList.loadData(
      this.assessmentList.pagination,
      this.assessmentFilters
    );
  }

  // -------- Add --------
  onAddAssessment() {
    const ref = this.dialogService.open(ControlEffectivnessAssessmentPopup, {
      header: "Add Assessment",
      width: "700px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Assessment added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditAssessment(row: ControlEffectivnessAssessmentInterface) {
    const ref = this.dialogService.open(ControlEffectivnessAssessmentPopup, {
      header: "Edit Assessment",
      width: "700px",
      modal: true,
      data: row,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Assessment updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteAssessment(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Assessment deleted successfully 🗑️",
        })
      );
  }

  private reloadList() {
    this.assessmentList.loadData(
      this.assessmentList.pagination,
      this.assessmentFilters
    );
  }

  formatDate(dateStr: string | undefined) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day}/${month}/${year}  ${hour12}:${minutes} ${ampm}`;
  }
}
