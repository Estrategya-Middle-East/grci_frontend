import { Component, ViewChild, inject, input } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { ControlNaturePopup } from "../control-nature-popup/control-nature-popup";
import { tap } from "rxjs";
import { ControlNatureService } from "../../services/control-nature";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-control-nature",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-nature.html",
  styleUrl: "./control-nature.scss",
})
export class ControlNature {
  activeTab = input.required<number>();
  private service = inject(ControlNatureService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("natureList") natureList!: GeneralList<lookup>;

  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Control Natures" },
    import: false,
  };

  actions: ShowActions = {
    add: { show: true, label: "New Control Nature", isLink: false },
    import: { show: false, label: "" },
  };

  columns: {
    field: keyof lookup | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Control Nature Name" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  fetchNatures = ({
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
    this.natureList.loadData(this.natureList.pagination, this.filters);
  }

  onAddNature() {
    const ref = this.dialogService.open(ControlNaturePopup, {
      header: "Add Control Nature",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.natureList.loadData(this.natureList.pagination, this.filters);
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Nature added successfully 🎉",
        });
      }
    });
  }

  onEditNature(item: lookup) {
    const ref = this.dialogService.open(ControlNaturePopup, {
      header: "Edit Control Nature",
      width: "600px",
      modal: true,
      data: item,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.natureList.loadData(this.natureList.pagination, this.filters);
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Nature updated successfully 🎉",
        });
      }
    });
  }

  onDeleteNature(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.natureList.loadData(this.natureList.pagination, this.filters)
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

  onArchiveNature(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.natureList.loadData(this.natureList.pagination, this.filters)
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
