import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { List } from "../list/list";
import { Board } from "../board/board";
import { ActivatedRoute } from "@angular/router";
import {
  DropdownList,
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { filterModel } from "../../../../shared/models/filter.model";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { Entity } from "../../services/entity";
import { catchError, forkJoin, of } from "rxjs";

@Component({
  selector: "app-view",
  imports: [List, Board, HeaderComponent],
  templateUrl: "./view.html",
  styleUrl: "./view.scss",
})
export class View implements OnInit {
  private entityService = inject(Entity);
  switchView = true;

  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Entity",
      link: "/entities/add",
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

  dropdownList: DropdownList[] = [
    {
      label: "Dimension Type",
      searchType: "dimensionId",
      optionLabel: "name",
      list: [],
      selected: "",
    },
    {
      label: "Org Chart Level",
      searchType: "orgChartLevelId",
      optionLabel: "name",
      list: [],
      selected: "",
    },
  ];

  filters: Record<string, any> = {};

  ngOnInit(): void {
    this.loadDropdowns();
  }

  switchview(event: boolean) {
    this.switchView = event;
  }

  private loadDropdowns(): void {
    forkJoin({
      dimensions: this.entityService
        .getDimensionsLookUp()
        .pipe(catchError(() => of([]))),
      orgChartLevels: this.entityService
        .getOrgChartLevels()
        .pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.dropdownList[0].list = res.dimensions.map((d) => ({
        name: d.name,
        value: d.id,
      }));

      this.dropdownList[1].list = res.orgChartLevels.map((l) => ({
        name: l.name,
        value: l.id,
      }));
    });
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
}
