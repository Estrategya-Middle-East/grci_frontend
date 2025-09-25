import { Component } from "@angular/core";

import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { ListComponent } from "../list/list.component";
import { BoardComponent } from "../board/board.component";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";

@Component({
  selector: "app-view",
  standalone: true,
  imports: [HeaderComponent, BoardComponent, ListComponent, ToastModule],
  providers: [MessageService],
  templateUrl: "./view.component.html",
  styleUrl: "./view.component.scss",
})
export class ViewComponent {
  switchView = true;
  filters: Record<string, any> = {};

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New dimension",
      link: "/dimensions/add",
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
      label: "Search Dimensions",
    },
    import: false,
  };

  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
