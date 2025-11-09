import { Component } from "@angular/core";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { ToastModule } from "primeng/toast";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { List } from "../list/list";
import { HeaderComponent } from "../../../../shared/components/header/header.component";

@Component({
  selector: "app-view",
  imports: [HeaderComponent, List, ToastModule],
  providers: [DialogService, MessageService],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View {
  switchView = true;
  filters: Record<string, any> = {};

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Rating",
      link: "/control-design-rating/add",
    },
    import: {
      show: false,
      label: "",
    },
  };

  showFilteration: ShowFilteration = {
    tabeOne: {
      show: false,
      label: "Board View",
    },
    tabeTwo: {
      show: false,
      label: "List View",
    },
    search: {
      show: true,
      label: "Search Control",
    },
    import: false,
  };

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
