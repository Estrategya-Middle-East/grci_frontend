import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { AutomationPopup } from "../automation-popup/automation-popup";
import { tap } from "rxjs";
import { AutomationInterface } from "../../models/mitigation";
import { AutomationService } from "../../services/automation";

@Component({
  selector: "app-automation",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./automation.html",
  styleUrl: "./automation.scss",
})
export class Automation {
  activeTab = input.required<number>();
  private service = inject(AutomationService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("automationList")
  automationList!: GeneralList<AutomationInterface>;

  // -------- Filteration configs --------
  automationFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Automations" },
    import: false,
  };

  // -------- Actions configs --------
  automationActions: ShowActions = {
    add: { show: true, label: "New Automation", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  automationColumns: {
    field: keyof AutomationInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "Id" },
    { field: "value", header: "Mitigation Automation Name" },
    { field: "actions", header: "Actions" },
  ];

  automationFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchAutomations = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Filter Change --------
  onFiltersChange(filters: Record<string, any>) {
    this.automationFilters = { ...filters };
    this.automationList.loadData(
      this.automationList.pagination,
      this.automationFilters
    );
  }

  // -------- Add --------
  onAddAutomation() {
    const ref = this.dialogService.open(AutomationPopup, {
      header: "Add Automation",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.automationList.loadData(
          this.automationList.pagination,
          this.automationFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Automation added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditAutomation(automation: AutomationInterface) {
    const ref = this.dialogService.open(AutomationPopup, {
      header: "Edit Automation",
      width: "600px",
      modal: true,
      data: automation,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.automationList.loadData(
          this.automationList.pagination,
          this.automationFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Automation updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteAutomation(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.automationList.loadData(
            this.automationList.pagination,
            this.automationFilters
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

  // -------- Archive --------
  onArchiveAutomation(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.automationList.loadData(
            this.automationList.pagination,
            this.automationFilters
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
