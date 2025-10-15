// path: src/app/features/control/components/control-automation/control-automation.component.ts

import { Component, ViewChild, inject, input } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { ControlAutomationPopup } from "../control-automation-popup/control-automation-popup";
import { tap } from "rxjs";
import { ControlAutomationService } from "../../services/control-automation";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-control-automation",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-automation.html",
  styleUrl: "./control-automation.scss",
})
export class ControlAutomation {
  activeTab = input.required<number>();
  private service = inject(ControlAutomationService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("automationList") automationList!: GeneralList<lookup>;

  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Control Automations" },
    import: false,
  };

  actions: ShowActions = {
    add: { show: true, label: "New Control Automation", isLink: false },
    import: { show: false, label: "" },
  };

  columns: {
    field: keyof lookup | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Control Automation Name" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  fetchAutomations = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.automationList.loadData(this.automationList.pagination, this.filters);
  }

  onAddAutomation() {
    const ref = this.dialogService.open(ControlAutomationPopup, {
      header: "Add Control Automation",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.automationList.loadData(
          this.automationList.pagination,
          this.filters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Automation added successfully 🎉",
        });
      }
    });
  }

  onEditAutomation(item: lookup) {
    const ref = this.dialogService.open(ControlAutomationPopup, {
      header: "Edit Control Automation",
      width: "600px",
      modal: true,
      data: item,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.automationList.loadData(
          this.automationList.pagination,
          this.filters
        );
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Automation updated successfully 🎉",
        });
      }
    });
  }

  onDeleteAutomation(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.automationList.loadData(
            this.automationList.pagination,
            this.filters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Automation deleted successfully 🎉",
        })
      );
  }

  onArchiveAutomation(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.automationList.loadData(
            this.automationList.pagination,
            this.filters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Automation archived successfully.",
        })
      );
  }
}
