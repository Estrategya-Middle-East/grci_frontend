import { Component, effect, inject } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { List } from "../list/list";
import { map } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { Hierarchy } from "../hierarchy/hierarchy";

@Component({
  selector: "app-view",
  imports: [HeaderComponent, Hierarchy, List],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View {
  private route = inject(ActivatedRoute);
  switchView = true;
  entityId$ = this.route.paramMap.pipe(map((params) => params.get("entityId")));
  entityId = toSignal(this.entityId$, { initialValue: null });
  filters: Record<string, any> = {};

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Key Process",
    },
    import: {
      show: false,
      label: "",
    },
  };

  showFilteration: ShowFilteration = {
    tabeOne: {
      show: true,
      label: "Hierarchy View",
    },
    tabeTwo: {
      show: true,
      label: "List View",
    },
    search: {
      show: true,
      label: "Search Key Processes",
    },
    year: { show: false, label: "" },
    import: false,
  };

  constructor() {
    effect(() => {
      const id = this.entityId();
      if (id) {
        this.showActions.add.link = `/entities/${id}/key-process/add`;
        console.log(this.showActions);
      }
    });
  }

  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
