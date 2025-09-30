import { Component, inject, input, ViewChild } from "@angular/core";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { LeaveDayInterface } from "../../models/resources-unutilized-time";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";
import { LeaveDaysPopup } from "../leave-days-popup/leave-days-popup";
import { tap } from "rxjs";
import { HeaderComponent } from "../../../../shared/components/header/header.component";

@Component({
  selector: "app-leave-days",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./leave-days.html",
  styleUrl: "./leave-days.scss",
})
export class LeaveDays {
  activeTab = input.required<number>();
  private service = inject(ResourcesUnutilizedTime);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  // References to child lists
  @ViewChild("leaveDaysList") leaveDaysList!: GeneralList<LeaveDayInterface>;

  // -------- Filteration configs --------
  leaveDaysFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Leave Days" },
    import: false,
  };

  // -------- Actions configs --------
  leaveDaysActions: ShowActions = {
    add: { show: true, label: "New Leave Day", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  leaveDaysColumns: {
    field: keyof LeaveDayInterface | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "year", header: "Year" },
    { field: "annualLeaves", header: "Annual Leave" },
    { field: "sickLeaves", header: "Sick Leaves" },
    { field: "training", header: "Training" },
    { field: "managerialTasks", header: "Managerial Tasks" },
    { field: "otherActivities", header: "Other Activities" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  leaveDaysFilters: Record<string, any> = {};

  // -------- Fetch functions (typed) --------
  fetchLeaveDays = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<ResourcesUnutilizedTime["getLeaveDays"]> =>
    this.service.getLeaveDays({ pageNumber, pageSize, ...filters });

  // -------- Handle filter changes from header --------
  onFiltersChange(filters: Record<string, any>) {
    this.leaveDaysFilters = { ...filters };
    this.leaveDaysList.loadData(
      this.leaveDaysList.pagination,
      this.leaveDaysFilters
    );
  }

  // -------- Add actions --------
  onAddLeaveDays() {
    const ref = this.dialogService.open(LeaveDaysPopup, {
      header: "Add Leave Days",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.leaveDaysList.loadData(
          this.leaveDaysList.pagination,
          this.leaveDaysFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Leave Days added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit actions -------
  onEditLeaveDay(row: LeaveDayInterface) {
    const ref = this.dialogService.open(LeaveDaysPopup, {
      header: "Edit Leave Days",
      width: "600px",
      modal: true,
      data: row,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.leaveDaysList.loadData(
          this.leaveDaysList.pagination,
          this.leaveDaysFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Leave Days updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete actions --------
  onDeleteLeaveDay(id: number) {
    this.service
      .deleteLeaveDay(id)
      .pipe(
        tap(() =>
          this.leaveDaysList.loadData(
            this.leaveDaysList.pagination,
            this.leaveDaysFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Leave Day deleted successfully 🎉",
        })
      );
  }

  // -------- Archive actions --------
  onArchiveLeaveDay(id: number) {
    this.service
      .archiveLeaveDay(id)
      .pipe(
        tap(() =>
          this.leaveDaysList.loadData(
            this.leaveDaysList.pagination,
            this.leaveDaysFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Leave Day archived successfully.",
        })
      );
  }
}
