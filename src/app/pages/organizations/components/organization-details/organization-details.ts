import { Component, effect, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrganizationsService } from "../../services/organizations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppRoute } from "../../../../app.routes.enum";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, switchMap, catchError, of } from "rxjs";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { environment } from "../../../../../environments/environment";
import { ButtonModule } from "primeng/button";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-organization-details",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    DeleteItemSelectedComponent,
    ToastModule,
  ],
  templateUrl: "./organization-details.html",
  styleUrls: ["./organization-details.scss"],
})
export class OrganizationDetails {
  readonly imgUrl = environment.baseUrl;
  private orgService = inject(OrganizationsService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loaderService = inject(LoaderService);
  viewData!: deleteItemInterface;
  private modalService = inject(NgbModal);
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  id = toSignal(this.id$, { initialValue: null });

  organization = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.orgService.getOrganizationById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(AppRoute.ORGANIZATIONS);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      let getDelete = this.orgService.getDeleteSignal();
      let getArchive = this.orgService.getArchiveSignal();
      if (getDelete) {
        this.orgService.delete(getDelete?.id).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: `deleted ${data.message}`,
              key: "bc",
              life: 1000,
            });
            this.router.navigateByUrl(`/${AppRoute.ORGANIZATIONS}`);
          },
        });
        this.orgService.clear();
      }
      if (getArchive) {
        this.orgService.archive(getArchive?.id).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Organization has been archived successfully.",
            });
            this.orgService.clear();
          },
        });
      }
    });
  }

  formatTime(time: string | undefined): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 === 0 ? 12 : hours % 12;
    return `${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  editItem() {
    this.router.navigateByUrl(
      `/${AppRoute.ORGANIZATIONS}/edit/${this.organization()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.organization()?.title}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  openArchived() {
    this.viewData = {
      title: `Archived “${this.organization()?.title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.orgService.triggerDelete(this.organization());
    } else {
      this.orgService.triggerArchive(this.organization());
    }
    this.close();
  }

  close() {
    this.modalService.dismissAll();
  }

  // archiveItem() {
  //   this.orgService.archive(this.organization()?.id as number).subscribe(() => {
  //     this.messageService.add({
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Organization archived successfully 🎉",
  //     });
  //   });
  // }
}
