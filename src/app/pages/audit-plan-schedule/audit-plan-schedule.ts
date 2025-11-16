import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

import { HeaderComponent } from "../../shared/components/header/header.component";
import { GeneralList } from "../../shared/components/general-list/general-list";

import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { AuditPlanSchedulePopup } from "./components/audit-plan-schedule-popup/audit-plan-schedule-popup";
import { AuditPlanScheduleService } from "./services/audit-plan-schedule-service";
import { AuditPlanScheduleInterface } from "./models/audit-plan-schedule";

@Component({
  selector: "app-audit-plan-schedule",
  imports: [HeaderComponent, GeneralList],
  providers: [DialogService],
  templateUrl: "./audit-plan-schedule.html",
  styleUrl: "./audit-plan-schedule.scss",
})
export class AuditPlanSchedule {
  activeTab = input.required<number>();

  private service = inject(AuditPlanScheduleService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  @ViewChild("auditPlanScheduleList")
  auditPlanScheduleList!: GeneralList<AuditPlanScheduleInterface>;

  // -------- Route param (audit plan id) --------
  id$ = this.route.paramMap.pipe(map((params) => Number(params.get("id"))));
  auditPlanId = toSignal(this.id$, { initialValue: 0 });

  // -------- Filteration --------
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Schedule" },
    import: false,
  };

  // -------- Actions --------
  actions: ShowActions = {
    add: { show: true, label: "New Schedule", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Table Columns --------
  columns: {
    field:
      | keyof AuditPlanScheduleInterface
      | "keyActivitiesCount"
      | "resourcesCount"
      | "actions";
    header: string;
  }[] = [
    { field: "title", header: "Title" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
    { field: "keyActivitiesCount", header: "Key Activities" },
    { field: "resourcesCount", header: "Resources" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  // -------- Fetch Data --------
  fetchData = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) =>
    this.service
      .getList(this.auditPlanId().toString(), {
        pageNumber,
        pageSize,
        auditPlanId: this.auditPlanId(),
        ...filters,
      })
      .pipe(
        map((pagedResult) => ({
          ...pagedResult,
          items: pagedResult.items.map((item) => ({
            ...item,
            keyActivitiesCount: item.keyActivities?.length || 0,
            resourcesCount: item.resources?.length || 0,
          })),
        }))
      );

  // -------- Filters Change --------
  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.auditPlanScheduleList.loadData(
      this.auditPlanScheduleList.pagination,
      this.filters
    );
  }

  // -------- Add --------
  onAdd() {
    const ref = this.dialogService.open(AuditPlanSchedulePopup, {
      header: "Add Schedule",
      width: "700px",
      modal: true,
      data: { auditPlanId: this.auditPlanId() },
    });

    ref.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Edit --------
  onEdit(row: AuditPlanScheduleInterface) {
    const ref = this.dialogService.open(AuditPlanSchedulePopup, {
      header: "Edit Schedule",
      width: "700px",
      modal: true,
      data: { scheduleId: row.id, auditPlanId: this.auditPlanId() },
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
          detail: "Schedule deleted successfully 🗑️",
        })
      );
  }

  private reloadList() {
    this.auditPlanScheduleList.loadData(
      this.auditPlanScheduleList.pagination,
      this.filters
    );
  }
}
