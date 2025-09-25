import { Component, inject, ViewChild } from "@angular/core";
import { Entity } from "../../services/entity";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { catchError, map, of, switchMap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { AppRoute, appRoutes } from "../../../../app.routes.enum";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { HeaderComponent } from "../../../../shared/components/header/header.component";

@Component({
  selector: "app-entity-details",
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: "./entity-details.html",
  styleUrl: "./entity-details.scss",
})
export class EntityDetails {
  private entityService = inject(Entity);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  viewData!: deleteItemInterface;
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("entityId")));
  id = toSignal(this.id$, { initialValue: null });

  entity = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.entityService.getEntityById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute.ENTITIES);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  viewItem() {
    this.router.navigateByUrl(`/${AppRoute.ENTITIES}/${this.entity()?.id}`);
  }

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute.ENTITIES}/edit/${this.entity()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.entity()?.name}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }
  openArchive() {
    this.viewData = {
      title: `Archive “${this.entity()?.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.entityService.deleteEntity(this.entity()?.id as number).subscribe({
        next: () => {
          this.router.navigateByUrl(`/${appRoutes.ENTITIES}`);
          this.modalService.dismissAll();
        },
      });
    } else {
      this.entityService.archive(this.entity()?.id as number).subscribe({
        next: () => {
          this.modalService.dismissAll();
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }
}
