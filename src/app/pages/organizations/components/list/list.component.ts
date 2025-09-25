import { CommonModule } from "@angular/common";
import { Component, inject, Input, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { Select } from "primeng/select";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import {
  LocationType,
  OrganizationType,
} from "../../../../shared/enums/types.enum";
import { OrganizationsService } from "../../services/organizations.service";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomPaginatorComponent,
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
  ],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
})
export class ListComponent {
  @Input() filters: Record<string, any> = {};
  private orgService = inject(OrganizationsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedEntityId!: number;
  selectedArchiveEntityId!: number;

  columns: any[] = [
    { field: "title", header: "Organization Name" },
    { field: "code", header: "Code" },
    { field: "nameOrganizationType", header: "Organization Type" },
    { field: "nameLocationType", header: "Location Type" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = { pageNumber: 1, pageSize: 10 };
  organizationsList: any[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
    this.loadOrganizations(this.pagination);
  }

  loadOrganizations(pagination: any) {
    this.orgService.listOrganizations(pagination).subscribe({
      next: (response) => {
        this.organizationsList = response.items.map((item: any) => ({
          ...item,
          nameOrganizationType: this.getOrganizationTypeName(item.type),
          nameLocationType: this.getLocationTypeName(item.locationType),
        }));
        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        };
      },
    });
  }

  getLocationTypeName(type: number): string {
    return LocationType[type];
  }

  getOrganizationTypeName(type: number): string {
    return OrganizationType[type];
  }

  openDelete(id: number) {
    this.selectedEntityId = id;
    this.viewData = {
      title: "Delete Organization",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(org: any) {
    this.selectedArchiveEntityId = org.id;
    this.viewData = {
      title: `Archive “${org.organizationName}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.orgService.delete(this.selectedEntityId).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Deleted",
            detail: "Organization deleted successfully 🎉",
          });
          this.loadOrganizations(this.pagination);
          this.close();
        },
      });
    } else if (this.viewData?.title?.includes("Archive")) {
      this.orgService.archive(this.selectedArchiveEntityId).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Archived",
            detail: "Organization archived successfully",
          });
          this.loadOrganizations(this.pagination);
          this.close();
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
}
