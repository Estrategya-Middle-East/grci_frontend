import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";

import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { AuditPlanFeedbackService } from "./services/audit-plan-feedback-service";
import { AuditPlanFeedbackInterface } from "./models/audit-plan-feedback";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { AuditPlanFeedbackPopup } from "./components/audit-plan-feedback-popup/audit-plan-feedback-popup";

@Component({
  selector: "app-audit-plan-feedback",
  imports: [HeaderComponent, GeneralList],
  providers: [DialogService],
  templateUrl: "./audit-plan-feedback.html",
  styleUrl: "./audit-plan-feedback.scss",
})
export class AuditPlanFeedback {
  activeTab = input.required<number>();

  private service = inject(AuditPlanFeedbackService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  @ViewChild("auditPlanFeedbackList")
  auditPlanFeedbackList!: GeneralList<AuditPlanFeedbackInterface>;

  // -------- Route param as signal (audit plan id) --------
  id$ = this.route.paramMap.pipe(map((params) => Number(params.get("id"))));
  auditPlanId = toSignal(this.id$, { initialValue: 0 });

  // -------- Filteration config --------
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Feedback" },
    import: false,
  };

  // -------- Actions config --------
  actions: ShowActions = {
    add: { show: true, label: "New Feedback", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Table Columns --------
  columns: {
    field: keyof AuditPlanFeedbackInterface | "actions";
    header: string;
  }[] = [
    { field: "auditPlanCode", header: "Plan Code" },
    { field: "auditPlanTitle", header: "Plan Title" },
    { field: "statusName", header: "Status" },
    { field: "feedback", header: "Feedback" },
    { field: "reviewedByName", header: "Reviewed By" },
    { field: "reviewedAt", header: "Reviewed Date" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  // -------- Fetch Data Function --------
  fetchData = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) =>
    this.service.getList(this.auditPlanId().toString(), {
      pageNumber,
      pageSize,
      auditPlanId: this.auditPlanId(),
      ...filters,
    });

  // -------- Handle filters update --------
  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.auditPlanFeedbackList.loadData(
      this.auditPlanFeedbackList.pagination,
      this.filters
    );
  }

  // -------- Add --------
  onAdd() {
    const ref = this.dialogService.open(AuditPlanFeedbackPopup, {
      header: "Add Feedback",
      width: "700px",
      modal: true,
      data: { auditPlanId: this.auditPlanId() },
    });

    ref.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Edit --------
  onEdit(row: AuditPlanFeedbackInterface) {
    const ref = this.dialogService.open(AuditPlanFeedbackPopup, {
      header: "Edit Feedback",
      width: "700px",
      modal: true,
      data: { feedbackId: row.id, auditPlanId: this.auditPlanId() },
    });

    ref.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Delete --------
  onDelete(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Feedback deleted successfully 🗑️",
        })
      );
  }

  // -------- Archive --------
  // onArchive(id: number) {
  //   this.service
  //     .archive(id)
  //     .pipe(tap(() => this.reloadList()))
  //     .subscribe(() =>
  //       this.messageService.add({
  //         severity: "info",
  //         summary: "Archived",
  //         detail: "Feedback archived successfully",
  //       })
  //     );
  // }

  private reloadList() {
    this.auditPlanFeedbackList.loadData(
      this.auditPlanFeedbackList.pagination,
      this.filters
    );
  }
}
