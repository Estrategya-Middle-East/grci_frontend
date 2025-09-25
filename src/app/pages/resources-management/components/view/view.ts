import { Component } from "@angular/core";
import { List } from "../list/list";
import { Board } from "../board/board";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { filterModel } from "../../../../shared/models/filter.model";

@Component({
  selector: "app-view",
  imports: [List, Board, HeaderComponent],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View {
  switchView = true;

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Resource",
      link: "/resources-management/add",
    },
    import: {
      show: false,
      label: "",
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
      label: "Search Entities",
    },
    import: false,
  };

  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: any) {
    console.log(filters);
  }
}
