import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { LikelihoodPopup } from "../likelihood-popup/likelihood-popup";
import { tap } from "rxjs";
import { LikelihoodService } from "../../services/likelihood-service";
import { LikelihoodInterface } from "../../models/risk-scoring";

@Component({
  selector: "app-likelihood",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./likelihood.html",
  styleUrl: "./likelihood.scss",
})
export class Likelihood {
  activeTab = input.required<number>();
  private service = inject(LikelihoodService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("likelihoodList")
  likelihoodList!: GeneralList<LikelihoodInterface>;

  // -------- Filteration configs --------
  likelihoodFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Likelihoods" },
    import: false,
  };

  // -------- Actions configs --------
  likelihoodActions: ShowActions = {
    add: { show: true, label: "New Likelihood", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  likelihoodColumns: {
    field: keyof LikelihoodInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "title", header: "Likelihood Name" },
    { field: "value", header: "Value" },
    { field: "actions", header: "Actions" },
  ];

  likelihoodFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchLikelihoods = ({
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
    this.likelihoodFilters = { ...filters };
    this.likelihoodList.loadData(
      this.likelihoodList.pagination,
      this.likelihoodFilters
    );
  }

  // -------- Add --------
  onAddLikelihood() {
    const ref = this.dialogService.open(LikelihoodPopup, {
      header: "Add Likelihood",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.likelihoodList.loadData(
          this.likelihoodList.pagination,
          this.likelihoodFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Likelihood added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditLikelihood(likelihood: LikelihoodInterface) {
    const ref = this.dialogService.open(LikelihoodPopup, {
      header: "Edit Likelihood",
      width: "600px",
      modal: true,
      data: likelihood,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.likelihoodList.loadData(
          this.likelihoodList.pagination,
          this.likelihoodFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Likelihood updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteLikelihood(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.likelihoodList.loadData(
            this.likelihoodList.pagination,
            this.likelihoodFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Likelihood deleted successfully 🎉",
        })
      );
  }

  // -------- Archive --------
  onArchiveLikelihood(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.likelihoodList.loadData(
            this.likelihoodList.pagination,
            this.likelihoodFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Likelihood archived successfully.",
        })
      );
  }
}
