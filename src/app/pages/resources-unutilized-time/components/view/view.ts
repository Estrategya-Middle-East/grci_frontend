import { Component, inject, ViewChild } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { List } from "../list/list";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { tap } from "rxjs";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-view",
  imports: [TabsModule, List, HeaderComponent],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View {
  private service = inject(ResourcesUnutilizedTime);
  private messageService = inject(MessageService);

  activeTab = 0;

  // ✅ References to child lists
  @ViewChild("weekEndList") weekEndList!: List;
  @ViewChild("holidayList") holidayList!: List;
  @ViewChild("leaveDaysList") leaveDaysList!: List;

  // -------- Filteration configs --------
  weekEndFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Week Ends" },
    import: false,
  };

  holidayFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Public Holidays" },
    import: false,
  };

  leaveDaysFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Leave Days" },
    import: false,
  };

  // -------- Actions configs --------
  weekEndActions: ShowActions = {
    add: { show: true, label: "New Weekend Day", isLink: false },
    import: { show: false, label: "" },
  };

  holidayActions: ShowActions = {
    add: { show: true, label: "New Holiday", isLink: false },
    import: { show: false, label: "" },
  };

  leaveDaysActions: ShowActions = {
    add: { show: true, label: "New Leave Day", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  weekEndColumns = [
    { field: "code", header: "Code" },
    { field: "day", header: "Day" },
    { field: "actions", header: "Actions" },
  ];

  publicHolidayColumns = [
    { field: "code", header: "Code" },
    { field: "title", header: "Holiday Name" },
    { field: "date", header: "Date" },
    { field: "actions", header: "Actions" },
  ];

  leaveDaysColumns = [
    { field: "code", header: "Code" },
    { field: "year", header: "Year" },
    { field: "annualLeaves", header: "Annual Leave" },
    { field: "sickLeaves", header: "Sick Leaves" },
    { field: "training", header: "Training" },
    { field: "managerialTasks", header: "Managerial Tasks" },
    { field: "otherActivities", header: "Other Activities" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Fetch functions --------
  fetchWeekends = ({ pageNumber = 1, pageSize = 10 }) =>
    this.service.getWeekEnds({ pageNumber, pageSize });

  fetchHolidays = ({ pageNumber = 1, pageSize = 10 }) =>
    this.service.getPublicHolidays({
      pageNumber,
      pageSize,
    });

  fetchLeaveDays = ({ pageNumber = 1, pageSize = 10 }) =>
    this.service.getLeaveDays({
      pageNumber,
      pageSize,
    });

  // -------- Add actions --------
  onAddWeekend() {
    console.log("Open Weekend popup");
  }
  onAddLeaveDays() {
    console.log("Open Leave Day popup");
  }
  onAddPublicHolidays() {
    console.log("Open Public Holidays popup");
  }

  // -------- View / Edit actions --------
  onViewWeekend(id: number) {
    console.log("View Weekend", id);
  }
  onEditWeekend(id: number) {
    console.log("Edit Weekend", id);
  }

  onViewHoliday(id: number) {
    console.log("View Holiday", id);
  }
  onEditHoliday(id: number) {
    console.log("Edit Holiday", id);
  }

  onViewLeaveDay(id: number) {
    console.log("View Leave Day", id);
  }
  onEditLeaveDay(id: number) {
    console.log("Edit Leave Day", id);
  }

  // -------- Delete actions --------
  onDeleteWeekend(id: number) {
    this.service
      .deleteWeekEnd(id)
      .pipe(tap(() => this.weekEndList?.loadData(this.weekEndList.pagination)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Weekend deleted successfully 🎉",
          });
        },
      });
  }

  onDeleteHoliday(id: number) {
    this.service
      .deletePublicHoliday(id)
      .pipe(tap(() => this.holidayList?.loadData(this.holidayList.pagination)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Public Holiday deleted successfully 🎉",
          });
        },
      });
  }

  onDeleteLeaveDay(id: number) {
    this.service
      .deleteLeaveDay(id)
      .pipe(
        tap(() => this.leaveDaysList?.loadData(this.leaveDaysList.pagination))
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Leave Day deleted successfully 🎉",
          });
        },
      });
  }

  // -------- Archive actions --------
  onArchiveWeekend(id: number) {
    this.service
      .archiveWeekEnd(id)
      .pipe(tap(() => this.weekEndList?.loadData(this.weekEndList.pagination)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Weekend archived successfully.",
          });
        },
      });
  }

  onArchiveHoliday(id: number) {
    this.service
      .archivePublicHoliday(id)
      .pipe(tap(() => this.holidayList?.loadData(this.holidayList.pagination)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Holiday archived successfully.",
          });
        },
      });
  }

  onArchiveLeaveDay(id: number) {
    this.service
      .archiveLeaveDay(id)
      .pipe(
        tap(() => this.leaveDaysList?.loadData(this.leaveDaysList.pagination))
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Leave Day archived successfully.",
          });
        },
      });
  }
}
