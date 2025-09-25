import { Component, inject, ViewChild } from "@angular/core";
import { AppRoute, appRoutes } from "../../../../app.routes.enum";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { DimensionsService } from "../../services/dimensions.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-dimensions-details",
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./dimensions-details.html",
  styleUrl: "./dimensions-details.scss",
})
export class DimensionsDetails {
  private dimService = inject(DimensionsService);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  viewData!: deleteItemInterface;
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  id = toSignal(this.id$, { initialValue: null });

  dimension = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.dimService.getDimensionById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute.DIMENSIONS);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  viewItem() {
    this.router.navigateByUrl(
      `/${AppRoute.DIMENSIONS}/${this.dimension()?.id}`
    );
  }

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute.DIMENSIONS}/edit/${this.dimension()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.dimension()?.title}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.dimension()?.title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.dimService
        .deleteDimension(this.dimension()?.id as number)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Dimension deleted successfully",
            });
            this.router.navigateByUrl(`/${appRoutes.DIMENSIONS}`);
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete dimension",
            });
          },
        });
    } else {
      this.dimService.archive(this.dimension()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Dimension archived successfully",
          });
          this.modalService.dismissAll();
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to archive dimension",
          });
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }
}
