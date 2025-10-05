import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { NaturePopup } from "../nature-popup/nature-popup";
import { tap } from "rxjs";
import { NatureInterface } from "../../models/mitigation";
import { NatureService } from "../../services/nature";

@Component({
  selector: "app-nature",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./nature.html",
  styleUrl: "./nature.scss",
})
export class Nature {
  activeTab = input.required<number>();
  private service = inject(NatureService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("natureList") natureList!: GeneralList<NatureInterface>;

  // -------- Filteration configs --------
  natureFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Natures" },
    import: false,
  };

  // -------- Actions configs --------
  natureActions: ShowActions = {
    add: { show: true, label: "New Nature", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  natureColumns: {
    field: keyof NatureInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "Id" },
    { field: "value", header: "Mitigation Nature Name" },
    { field: "actions", header: "Actions" },
  ];

  natureFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchNatures = ({
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
    this.natureFilters = { ...filters };
    this.natureList.loadData(this.natureList.pagination, this.natureFilters);
  }

  // -------- Add --------
  onAddNature() {
    const ref = this.dialogService.open(NaturePopup, {
      header: "Add Nature",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.natureList.loadData(
          this.natureList.pagination,
          this.natureFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Nature added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditNature(nature: NatureInterface) {
    const ref = this.dialogService.open(NaturePopup, {
      header: "Edit Nature",
      width: "600px",
      modal: true,
      data: nature,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.natureList.loadData(
          this.natureList.pagination,
          this.natureFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Nature updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteNature(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.natureList.loadData(
            this.natureList.pagination,
            this.natureFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Nature deleted successfully 🎉",
        })
      );
  }

  // -------- Archive --------
  onArchiveNature(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.natureList.loadData(
            this.natureList.pagination,
            this.natureFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Nature archived successfully.",
        })
      );
  }
}
