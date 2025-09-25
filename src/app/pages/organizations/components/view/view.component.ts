import { Component, effect, inject } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  DropdownList,
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { filterModel } from "../../../../shared/models/filter.model";
import { BoardComponent } from "../board/board.component";
import { ListComponent } from "../list/list.component";
import { map } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-view",
  imports: [HeaderComponent, BoardComponent, ListComponent],
  templateUrl: "./view.component.html",
  styleUrl: "./view.component.scss",
})
export class ViewComponent {
  private route = inject(ActivatedRoute);
  switchView = true;
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });
  filters: Record<string, any> = {};

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Organization",
      link: "/organizations/add",
    },
    import: {
      show: true,
      label: "Import organizations",
    },
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

  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
