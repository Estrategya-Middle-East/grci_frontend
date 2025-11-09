import { Component, ViewChild, inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { AppRoute, appRoutes } from "../../../../app.routes.enum";
import { ControlDesignRatingService } from "../../services/control-design-rating";

@Component({
  selector: "app-control-design-details",
  standalone: true,
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./control-design-details.html",
  styleUrl: "./control-design-details.scss",
})
export class ControlDesignDetails {
  private controlDesignService = inject(ControlDesignRatingService);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  viewData!: deleteItemInterface;
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  id = toSignal(this.id$, { initialValue: null });

  control = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.controlDesignService.getById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute["CONTROL-DESIGN-RATING"]);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute["CONTROL-DESIGN-RATING"]}/edit/${this.control()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.control()?.controlName}”`,
      sendLabel: "Confirm Deletion",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.control()?.controlName}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.controlDesignService.delete(this.control()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Deleted",
            detail: "Control Design deleted successfully",
          });
          this.router.navigateByUrl(`/${AppRoute["CONTROL-DESIGN-RATING"]}`);
          this.modalService.dismissAll();
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete Control Design",
          });
        },
      });
    } else {
      this.controlDesignService
        .archive(this.control()?.id as number)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Control Design archived successfully",
            });
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to archive Control Design",
            });
          },
        });
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  formatDate(dateStr: string | undefined) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day}/${month}/${year}  ${hour12}:${minutes} ${ampm}`;
  }
}
