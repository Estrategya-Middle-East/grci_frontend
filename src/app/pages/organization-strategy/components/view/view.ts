import { Component, effect, inject } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { Board } from "../board/board";
import { List } from "../list/list";
import { map } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-view",
  imports: [HeaderComponent, Board, List],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View {
  private route = inject(ActivatedRoute);
  switchView = true;
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });
  filters: Record<string, any> = {};

  constructor() {
    effect(() => {
      const id = this.orgId();
      if (id) {
        this.showActions.add.link = `/organizations/${id}/strategies/add`;
      }
    });
  }

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Strategy",
      link: "/strategies/add",
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
      label: "Search Strategies",
    },
    year: { show: true, label: "Year" },
    import: false,
  };

  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
