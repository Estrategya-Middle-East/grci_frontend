import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
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
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AppRoute } from "../../../../app.routes.enum";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Select,
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
  ],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
})
export class ListComponent {
  @Output() dropdownChange = new EventEmitter<any>();
  @Input() dataOrganizations: any = {};
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns: any[] = [
    {
      field: "organizationName",
      header: "Organization Name",
      filters: {
        searchType: "title",
        type: "search",
      },
    },
    {
      field: "code",
      header: "Code",
      filters: {
        searchType: "code",
        type: "search",
      },
    },
    {
      field: "nameOrganizationType",
      header: "Organization Type",
      filters: {
        searchType: "Type",
        type: "dropdown",
        label: "Organization Type",
        optionLabel: "name",
        list: [
          { name: "Group", value: 1 },
          { name: "Organization", value: 2 },
        ],
        selected: "",
      },
    },
    {
      field: "nameLocationType",
      header: "Location Type",
      filters: {
        searchType: "LocationType",

        type: "dropdown",
        label: "Organization Type",
        optionLabel: "name",
        list: [
          { name: "Headquarter", value: 1 },
          { name: "NonHeadquarter", value: 2 },
        ],
        selected: "",
      },
    },
    { field: "actions", header: "Actions" },
  ];
  organizationsList: any[] = [];
  customers: any[] = [];
  organizationsService = inject(OrganizationsService);
  @ViewChild("content", { static: false }) content: any;
  filters: { [key: string]: string } = {};
  isSearching: { [key: string]: boolean } = {};
  private dataOrig: any = null;
  @Output() search = new EventEmitter();
  searchControl: FormControl<string | any> = new FormControl({
    key: null,
    value: null,
  });

  viewData: any = {};
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = "static";
    config.keyboard = false;
    effect(() => {
      let closeDialog = this.organizationsService.getCloseDialog();
      if (closeDialog) {
        this.close();
      }
    });
  }

  open(content: any) {
    this.modalService.open(content, { size: "xl" });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
  openDelete(data: any) {
    this.viewData = {
      title: `Delete “${data.title}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.dataOrig = data;
    this.modalService.open(this.content);
  }
  openArchived(data: any) {
    this.viewData = {
      title: `Archived “${data.title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.dataOrig = data;
    this.modalService.open(this.content);
  }
  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.organizationsService.triggerDelete(this.dataOrig);
    } else {
      this.organizationsService.triggerArchive(this.dataOrig);
    }
    this.close();
  }
  close() {
    this.modalService.dismissAll();
    this.dataOrig = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes?.["dataOrganizations"]) {
      this.getOrganizationsList(
        changes?.["dataOrganizations"]?.currentValue?.items
      );
    }
  }
  ngOnInit() {
    this.getOrganizationsList(this.dataOrganizations?.items);
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (data) => {
          this.search.emit(data);
        },
        error: (err) => {},
      });
  }
  getOrganizationsList(items: any[]) {
    this.organizationsList = [];
    this.organizationsList = items?.map((item: any) => {
      return {
        organizationName: {
          path: "assets/images/imagCardSmall.png",
          name: item.title,
        },
        code: "static",
        nameOrganizationType: this.getOrganizationTypeName(item.type),
        nameLocationType: this.getLocationTypeName(item.locationType),
        ...item,
      };
    });
    this.customers = this.organizationsList;
  }
  getLocationTypeName(type: number): string {
    return LocationType[type];
  }
  getOrganizationTypeName(type: number): string {
    return OrganizationType[type];
  }
  enableSearch(field: string) {
    this.isSearching[field] = true;
  }

  disableSearch(field: string) {
    this.isSearching[field] = false;
  }

  filterTable(data: any) {
    const searchValue = this.filters[data.field]?.toLowerCase() ?? "";

    this.searchControl.setValue({ key: data.searchType, value: searchValue });
    // this.customers = this.organizationsList.filter((c:any) =>
    //   c[field]?.toLowerCase().includes(searchValue)
    // );
  }
  onDropdownChange(data: any) {
    this.searchControl.setValue({
      key: data.searchType,
      value: data.selected.value,
    });

    // this.dropdownChange.emit(value);
  }

  navigateToEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }

  navigateToView(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  navigateToStrategies(id: number) {
    this.router.navigate([id, `${AppRoute.STRATEGIES}`], {
      relativeTo: this.route,
    });
  }
}
