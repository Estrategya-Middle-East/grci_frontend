import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ToastModule } from "primeng/toast";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { List } from "../list/list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";

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
      label: "New Audit Plan",
      link: "/audit-plan/add",
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
      label: "Search Audit Plans",
    },
    import: false,
  };

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
