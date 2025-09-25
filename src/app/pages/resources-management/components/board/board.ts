import { Component, inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { map, tap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { ResourceService } from "../../services/resource";
import { ResourceInterface } from "../../models/resource";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-board",
  imports: [
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./board.html",
  styleUrl: "./board.scss",
})
export class Board {
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  resourcesList: ResourceInterface[] = [];
  selectedResourceId!: number;
  viewData: deleteItemInterface & { action?: "delete" | "archive" } = {
    title: "",
    sendClose: "",
    sendLabel: "",
  };

  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  ngOnInit() {
    this.loadResources(this.pagination);
  }

  loadResources(pagination: any) {
    this.resourceService
      .getResources({ ...pagination, organizationId: this.orgId() })
      .subscribe({
        next: (response) => {
          this.resourcesList = response.items;
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
    this.selectedResourceId = id;
    this.viewData = {
      title: "Delete Resource",
      sendLabel: "Delete",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(id: number) {
    this.selectedResourceId = id;
    this.viewData = {
      title: "Archive Resource",
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
      action: "archive",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData.action === "delete") {
      this.resourceService
        .deleteResource(this.selectedResourceId)
        .pipe(tap(() => this.loadResources(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Resource deleted successfully",
            });
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete resource",
            });
          },
        });
    } else if (this.viewData.action === "archive") {
      this.resourceService
        .archive(this.selectedResourceId)
        .pipe(tap(() => this.loadResources(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Resource archived successfully",
            });
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to archive resource",
            });
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

  getSkills(resource: ResourceInterface): string {
    return resource.skills?.map((s) => s.name).join(" - ") || "No skills";
  }

  getExperiences(resource: ResourceInterface): string {
    return (
      resource.experiences?.map((e) => e.experienceName).join(" - ") ||
      "No experiences"
    );
  }

  formatTime(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const date = new Date(1970, 0, 1, h, m);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
}
