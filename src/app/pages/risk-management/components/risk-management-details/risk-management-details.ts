import { Component, ViewChild, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";

import { LoaderService } from "../../../../shared/components/loader/loader.service";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { appRoutes, AppRoute } from "../../../../app.routes.enum";
import { RiskManagementService } from "../../services/risk-management-service";
import {
  RiskMitigationStatusEnum,
  RiskStatusEnum,
} from "../../models/risk-management";

@Component({
  selector: "app-risk-management-details",
  standalone: true,
  imports: [
    HeaderComponent,
    DeleteItemSelectedComponent,
    ButtonModule,
    ToastModule,
    TableModule,
  ],
  templateUrl: "./risk-management-details.html",
  styleUrl: "./risk-management-details.scss",
  providers: [MessageService],
})
export class RiskManagementDetails {
  private service = inject(RiskManagementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);
  loaderService = inject(LoaderService);
  RiskStatusEnum = RiskStatusEnum;
  RiskMitigationStatusEnum = RiskMitigationStatusEnum;
  // RiskStateEnum = RiskStateEnum;

  @ViewChild("content", { static: false }) content: any;
  viewData!: deleteItemInterface & { action: "delete" | "archive" };

  id$ = this.route.paramMap.pipe(map((p) => p.get("id")));
  id = toSignal(this.id$, { initialValue: null });

  risk = toSignal(
    this.id$.pipe(
      switchMap((id) => {
        if (!id) return of(null);
        return this.service.getRiskById(+id).pipe(
          catchError(() => {
            this.router.navigateByUrl(`/${appRoutes["RISK-MANAGEMENT"]}`);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  editItem() {
    this.router.navigateByUrl(
      `/${appRoutes["RISK-MANAGEMENT"]}/edit/${this.risk()?.id}`
    );
  }

  openDelete() {
    this.viewData = {
      title: `Delete “${this.risk()?.riskEvent}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content);
  }

  openArchive() {
    this.viewData = {
      title: `Archive “${this.risk()?.riskEvent}”`,
      sendLabel: "Archive",
      sendClose: "Cancel",
      action: "archive",
    };
    this.modalService.open(this.content);
  }

  send() {
    if (this.viewData.action === "delete") {
      this.service.deleteRisk(this.risk()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Deleted",
            detail: "Risk deleted successfully",
          });
          this.router.navigateByUrl(`/${appRoutes["RISK-MANAGEMENT"]}`);
          this.modalService.dismissAll();
        },
      });
    } else {
      this.service.archiveRisk(this.risk()?.id as number).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Risk archived successfully",
          });
          this.router.navigateByUrl(`/${appRoutes["RISK-MANAGEMENT"]}`);
          this.modalService.dismissAll();
        },
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  getKRIsAsString(kris: { keyRiskIndicator: string }[] | undefined): string {
    return kris?.map((k) => k.keyRiskIndicator).join(" - ") || "No KRIs";
  }
}
