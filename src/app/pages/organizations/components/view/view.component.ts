import { ChangeDetectorRef, Component, effect, inject } from "@angular/core";

import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { OrganizationsService } from "../../services/organizations.service";
import { BoardComponent } from "../board/board.component";
import { ListComponent } from "../list/list.component";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  DropdownList,
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";

@Component({
  selector: "app-view",
  standalone: true,
  imports: [
    HeaderComponent,
    BoardComponent,
    ListComponent,
    ToastModule,
    CustomPaginatorComponent,
  ],
  providers: [MessageService],
  templateUrl: "./view.component.html",
  styleUrl: "./view.component.scss",
})
export class ViewComponent {
  switchView = true;
  isLoading = true;
  organizationsService = inject(OrganizationsService);
  dataOrganizations: any = {};
  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };
  showActions: ShowActions = {
    add: {
      show: true,
      label: "New organization",
      link: "/organizations/add",
    },
    import: {
      show: true,
      label: "Import organizations",
    },
  };
  showFilteration: ShowFilteration = {
    tabeOne: {
      show: true,
      label: "Board View",
    },
    tabeTwo: {
      show: true,
      label: "List View",
    },
    search: {
      show: true,
      label: "Search Organizations",
    },
    import: true,
  };
  dropdownList: DropdownList[] = [
    {
      label: "Organization Type",
      searchType: "Type",
      optionLabel: "name",
      list: [
        { name: "Group", value: 1 },
        { name: "Organization", value: 2 },
      ],
      selected: "",
    },
    {
      label: "Location Type",
      searchType: "LocationType",
      optionLabel: "name",
      list: [
        { name: "Headquarter", value: 1 },
        { name: "NonHeadquarter", value: 2 },
      ],
      selected: "",
    },
  ];
  private messageService = inject(MessageService);

  constructor(private cd: ChangeDetectorRef) {
    effect(() => {
      let getDelete = this.organizationsService.getDeleteSignal();
      let getArchive = this.organizationsService.getArchiveSignal();
      if (getDelete) {
        if (!this.isLoading) {
          this.isLoading = true;
          this.organizationsService.delete(getDelete?.id).subscribe({
            next: (data) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `deleted ${data.message}`,
                key: "bc",
                life: 1000,
              });
              this.getOrganizations(this.pagination, false);
              this.isLoading = false;
            },
            error: (err) => {
              this.messageService.add({
                severity: "error",
                summary: "Success",
                detail: `deleted ${err.message}`,
                key: "bc",
                life: 1000,
              });
              this.isLoading = false;
            },
          });
        }

        this.organizationsService.clear();
      }
      if (getArchive) {
        this.isLoading = true;
        this.organizationsService.archive(getArchive?.id).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: `deleted ${data.message}`,
              key: "bc",
              life: 1000,
            });
            this.getOrganizations(this.pagination, false);
            this.isLoading = false;
            this.organizationsService.clear();
          },
          error: (err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error ? err.error?.title : err.statusText,
              key: "bc",
              life: 1000,
            });
            this.isLoading = false;
          },
        });
      }
    });
  }
  switchview(switchData: any) {
    this.switchView = switchData;
    this.getOrganizations(this.pagination, true);
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.dataOrganizations = {};
    this.getOrganizations(this.pagination, false);
  }
  search(data: any) {
    this.pagination[data.key] = data.value;

    this.getOrganizations(this.pagination, false);
  }
  getOrganizations(pagination: any, isSwitched: boolean) {
    this.organizationsService.listOrganizations(pagination).subscribe({
      next: (res) => {
        this.dataOrganizations = res.data;
        if (isSwitched) {
          this.pagination = {
            pageNumber: 1,
            pageSize: this.pagination.pageSize,
          };
        }
        this.pagination = {
          pageNumber: this.dataOrganizations.pageNumber,
          pageSize: this.dataOrganizations.pageSize,
          totalItems: this.dataOrganizations.totalItems,
          totalPages: this.dataOrganizations.totalPages,
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
}
