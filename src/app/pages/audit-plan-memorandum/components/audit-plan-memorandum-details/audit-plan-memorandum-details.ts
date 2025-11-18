import { Component, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { MessageService } from "primeng/api";

import { AuditPlanMemorandumServie } from "../../services/audit-plan-memorandum-service";
import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { appRoutes } from "../../../../app.routes.enum";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { AuditPlanMemorandumInterface } from "../../models/audit-plan-memorandum";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-audit-plan-memorandum-details",
  standalone: true,
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
    TableModule,
  ],
  templateUrl: "./audit-plan-memorandum-details.html",
  styleUrls: ["./audit-plan-memorandum-details.scss"],
  providers: [MessageService],
})
export class AuditPlanMemorandumDetails {
  private service = inject(AuditPlanMemorandumServie);
  loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  viewData!: deleteItemInterface & { action: "delete" | "archive" };
  @ViewChild("content", { static: false }) content: any;

  // route id as observable -> signal
  id$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  id = toSignal(this.id$, { initialValue: null });

  // fetch memorandum details as a signal
  memorandum = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        this.loaderService.show();
        return this.service.getById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(appRoutes["AUDIT-PLAN-MEMORANDUM"]);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // audit categories lookup (to display names)
  auditCategoriesOptions: lookup[] = [];
  private loadCategories() {
    this.service.getAuditCategoriesLookup().subscribe({
      next: (res) => (this.auditCategoriesOptions = res || []),
      error: () => (this.auditCategoriesOptions = []),
    });
  }

  constructor() {
    this.loadCategories();
  }

  editItem() {
    const id = this.id();
    if (id) {
      this.router.navigateByUrl(
        `/${appRoutes["AUDIT-PLAN-MEMORANDUM"]}/edit/${id}`
      );
    }
  }

  openDelete() {
    const title = `Delete Memorandum`;
    this.viewData = {
      title,
      sendLabel: "Delete",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    const title = `Archive Memorandum`;
    this.viewData = {
      title,
      sendLabel: "Archive",
      sendClose: "Cancel",
      action: "archive",
    };
    this.modalService.open(this.content);
  }

  send() {
    const id = this.id();
    if (!id) return;

    if (this.viewData.action === "delete") {
      this.service.delete(+id).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Deleted",
            detail: "Memorandum deleted successfully",
          });
          this.router.navigateByUrl(`/${appRoutes["AUDIT-PLAN-MEMORANDUM"]}`);
          this.modalService.dismissAll();
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete memorandum",
          });
        },
      });
    } else if (this.viewData.action === "archive") {
      this.service.archive(+id).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Memorandum archived successfully",
          });
          this.router.navigateByUrl(`/${appRoutes["AUDIT-PLAN-MEMORANDUM"]}`);
          this.modalService.dismissAll();
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to archive memorandum",
          });
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  // helper: format date safely
  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear());
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }

  getAuditCategoryName(id: number | undefined): string {
    if (!id) return "";
    const found = this.auditCategoriesOptions.find((c) => c.id === id);
    return found ? found.name : `#${id}`;
  }

  riskAnalysisIndex(i: number): number {
    return i + 1;
  }

  updateMemoRandumStatus(status: 0 | 1) {
    const id = this.id();
    if (!id) return;
    this.service.updateMemorandumStatus(+id, status).subscribe({
      next: () => {
        console.log("hey");

        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Memorandum status updated successfully",
        });
      },
    });
  }
}
