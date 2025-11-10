import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { RatingPopup } from "../rating-popup/rating-popup";
import { tap } from "rxjs";
import { RiskRatingInterface } from "../../models/risk-scoring";
import { RatingService } from "../../services/rating-service";

@Component({
  selector: "app-rating",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./rating.html",
  styleUrl: "./rating.scss",
})
export class Rating {
  activeTab = input.required<number>();
  private service = inject(RatingService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("ratingList") ratingList!: GeneralList<RiskRatingInterface>;

  // -------- Filteration configs --------
  ratingFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Ratings" },
    import: false,
  };

  // -------- Actions configs --------
  ratingActions: ShowActions = {
    add: { show: true, label: "New Rating", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  ratingColumns: {
    field: keyof RiskRatingInterface | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "title", header: "Risk Rating Name" },
    { field: "color", header: "Color" },
    { field: "scoreMin", header: "Score Min" },
    { field: "scoreMax", header: "Score Max" },
    { field: "actions", header: "Actions" },
  ];

  ratingFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchRatings = ({
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
    this.ratingFilters = { ...filters };
    this.ratingList.loadData(this.ratingList.pagination, this.ratingFilters);
  }

  // -------- Add --------
  onAddRating() {
    const ref = this.dialogService.open(RatingPopup, {
      header: "Add Rating",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.ratingList.loadData(
          this.ratingList.pagination,
          this.ratingFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Rating added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditRating(rating: RiskRatingInterface) {
    const ref = this.dialogService.open(RatingPopup, {
      header: "Edit Rating",
      width: "600px",
      modal: true,
      data: rating,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.ratingList.loadData(
          this.ratingList.pagination,
          this.ratingFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Rating updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteRating(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.ratingList.loadData(
            this.ratingList.pagination,
            this.ratingFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Rating deleted successfully 🎉",
        })
      );
  }

  // -------- Archive --------
  onArchiveRating(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.ratingList.loadData(
            this.ratingList.pagination,
            this.ratingFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Rating archived successfully.",
        })
      );
  }
}
