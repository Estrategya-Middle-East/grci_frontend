import { Component, inject, ViewChild } from "@angular/core";
import { ResourceService } from "../../services/resource";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ResourceInterface } from "../../models/resource";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { tap } from "rxjs";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-list",
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    ToastModule,
    CustomPaginatorComponent,
  ],
  providers: [MessageService],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List {
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;
  selectedResourceId!: number;

  columns: any[] = [
    { field: "code", header: "Code" },
    { field: "resourceName", header: "Resource Name" },
    { field: "resourceFunctionName", header: "Function" },
    { field: "workingHours", header: "Working Hours" },
    { field: "skills", header: "Skills" },
    { field: "experiences", header: "Experience" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  resourcesList: ResourceInterface[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
    this.loadResources(this.pagination);
  }

  loadResources(pagination: any) {
    this.resourceService.getResources(pagination).subscribe({
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

  getSkillsAsString(
    skills: { resourceSkillId: number; name: string }[]
  ): string {
    return skills?.map((s) => s.name).join(" - ") ?? "";
  }

  getExperiences(
    experiences: { id: number; experienceName: string; numberOfYears: number }[]
  ): string {
    return (
      experiences
        ?.map((e) => e.experienceName + " (" + e.numberOfYears + " years)")
        .join(" - ") || "No experiences"
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
