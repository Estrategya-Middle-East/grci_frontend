import { Component, inject, ViewChild } from "@angular/core";
import { OrganizationsService } from "../../services/organizations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { MessageService } from "primeng/api";
import { map } from "rxjs";

@Component({
  selector: "app-board",
  imports: [
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  private organizationsService = inject(OrganizationsService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  @ViewChild("content", { static: false }) content: any;

  organizationsList: any[] = [];
  selectedOrgId!: number;
  selectedArchivedOrgId!: number;

  viewData: any = { title: "", sendClose: "", sendLabel: "" };
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  ngOnInit() {
    this.loadOrganizations(this.pagination);
  }

  loadOrganizations(pagination: any) {
    this.organizationsService.listOrganizations({ ...pagination }).subscribe({
      next: (response) => {
        this.organizationsList = response.items;
        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        };
      },
    });
  }

  openDelete(id: number) {
    this.selectedOrgId = id;
    this.viewData = {
      title: "Delete Organization",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchived(org: any) {
    this.selectedArchivedOrgId = org.id;
    this.viewData = {
      title: `Archive “${org.title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData.title.includes("Delete")) {
      this.organizationsService.delete(this.selectedOrgId).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Organization deleted successfully 🎉",
          });
          this.loadOrganizations(this.pagination);
          this.modalService.dismissAll();
        },
      });
    } else {
      this.organizationsService.archive(this.selectedArchivedOrgId).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Organization has been archived successfully.",
          });
          this.loadOrganizations(this.pagination);
          this.modalService.dismissAll();
        },
      });
    }
  }

  navigateToEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }

  navigateToView(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  navigateToStrategies(id: number) {
    this.router.navigate([id, "strategies"], { relativeTo: this.route });
  }
}
