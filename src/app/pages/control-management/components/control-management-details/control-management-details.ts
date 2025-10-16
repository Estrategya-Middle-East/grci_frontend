import { Component, ViewChild, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { AppRoute, appRoutes } from "../../../../app.routes.enum";
import { ControlManagementService } from "../../services/control-management";

@Component({
  selector: "app-control-management-details",
  standalone: true,
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./control-management-details.html",
  styleUrl: "./control-management-details.scss",
})
export class ControlManagementDetails {
  private controlService = inject(ControlManagementService);
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
        return this.controlService.getControlById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute["CONTROL-MANAGEMENT"]);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute["CONTROL-MANAGEMENT"]}/edit/${this.control()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.control()?.name}”`,
      sendLabel: "Confirm Deletion",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.control()?.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.controlService
        .deleteControl(this.control()?.id as number)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Control deleted successfully",
            });
            this.router.navigateByUrl(`/${appRoutes["CONTROL-MANAGEMENT"]}`);
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete control",
            });
          },
        });
    } else {
      this.controlService.archive(this.control()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Control archived successfully",
          });
          this.modalService.dismissAll();
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to archive control",
          });
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  formatDate(dateStr: string | undefined) {
    if (!dateStr) {
      return "";
    }
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  getRiskNames(): string {
    const risks = this.control()?.risks;
    if (!risks || risks.length === 0) {
      return "—";
    }
    return risks.map((r) => r.name).join(", ");
  }
}
