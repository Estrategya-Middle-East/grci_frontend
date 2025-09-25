import { Component, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { MessageService } from "primeng/api";

import { ResourceService } from "../../services/resource";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { AppRoute, appRoutes } from "../../../../app.routes.enum";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-resource-details",
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
    TableModule,
  ],
  templateUrl: "./resource-details.html",
  styleUrl: "./resource-details.scss",
  providers: [MessageService],
})
export class ResourceDetails {
  private resourceService = inject(ResourceService);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  viewData!: deleteItemInterface & { action: "delete" | "archive" };
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("resourceId")));
  id = toSignal(this.id$, { initialValue: null });

  resource = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.resourceService.getResourceById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute["RESOURCES-MANAGEMENT"]);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute["RESOURCES-MANAGEMENT"]}/edit/${this.resource()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.resource()?.resourceName}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.resource()?.resourceName}”`,
      sendLabel: "Archive",
      sendClose: "Cancel",
      action: "archive",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData.action === "delete") {
      this.resourceService
        .deleteResource(this.resource()?.id as number)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Resource deleted successfully",
            });
            this.router.navigateByUrl(`/${appRoutes["RESOURCES-MANAGEMENT"]}`);
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData.action === "archive") {
      this.resourceService.archive(this.resource()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Resource archived successfully",
          });
          this.router.navigateByUrl(`/${appRoutes["RESOURCES-MANAGEMENT"]}`);
          this.modalService.dismissAll();
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  getSkillsAsString(
    skills: { resourceSkillId: number; name: string }[] | undefined
  ): string {
    return skills?.map((s) => s.name).join(" - ") || "No skills";
  }

  formatTime(time: string | undefined): string {
    if (!time) return "empty";
    const [h, m] = time.split(":").map(Number);
    const date = new Date(1970, 0, 1, h, m);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
}
