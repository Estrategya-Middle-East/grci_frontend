import { Component, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { EntitiesKeyProcessService } from "../../services/entities-key-process-service";
import { ProcessType } from "../../models/key-process/key-process";

@Component({
  selector: "app-key-process-details",
  standalone: true,
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: "./key-process-details.html",
  styleUrl: "./key-process-details.scss",
})
export class KeyProcessDetails {
  private service = inject(EntitiesKeyProcessService);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  processTypeLabels: Record<ProcessType, string> = {
    [ProcessType.ProcessGroup]: "Process Group",
    [ProcessType.Process]: "Process",
    [ProcessType.Activity]: "Activity",
    [ProcessType.Task]: "Task",
  };

  viewData!: deleteItemInterface;
  @ViewChild("content", { static: false }) content: any;

  id$ = this.route.paramMap.pipe(map((params) => params.get("processId")));
  id = toSignal(this.id$, { initialValue: null });

  keyProcess = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.service.getProcessManagementById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl("/key-processes");
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  editItem() {
    const entityIdValue = this.keyProcess()?.entityId;
    const processId = this.keyProcess()?.id;
    if (!entityIdValue || !processId) return;

    this.router.navigateByUrl(
      `/entities/${entityIdValue}/key-process/edit/${processId}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.keyProcess()?.name}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.keyProcess()?.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  getProcessTypeLabel(type: number | undefined) {
    if (!type) {
      return;
    }
    return this.processTypeLabels[type as ProcessType] || "Unknown";
  }

  send() {
    const entityIdValue = this.keyProcess()?.entityId;

    if (this.viewData?.title?.includes("Delete")) {
      this.service
        .deleteProcessManagement(this.keyProcess()?.id as number)
        .subscribe({
          next: () => {
            this.router.navigateByUrl(`/entities/${entityIdValue}/key-process`);
            this.modalService.dismissAll();
          },
        });
    } else {
      this.service.archive(this.keyProcess()?.id as number).subscribe({
        next: () => {
          this.router.navigateByUrl(`/entities/${entityIdValue}/key-process`);

          this.modalService.dismissAll();
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }
}
