import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ToastModule } from "primeng/toast";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { List } from "../list/list";

@Component({
  selector: "app-view",
  standalone: true,
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
      label: "New Risk",
      link: "/risk-management/add",
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
      label: "Search Risks",
    },
    import: false,
  };

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
