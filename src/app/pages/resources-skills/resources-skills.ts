import { Component, ViewChild, inject } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { tap } from "rxjs";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { lookup } from "../../shared/models/lookup.mdoel";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { ResourcesSkillsPopup } from "./components/resources-skills-popup/resources-skills-popup";
import { ResourceSkillsService } from "./services/resources-skills";
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: "app-resources-skills",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./resources-skills.html",
  styleUrls: ["./resources-skills.scss"],
  providers: [DialogService],
})
export class ResourcesSkills {
  private service = inject(ResourceSkillsService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("skillsList") skillsList!: GeneralList<lookup>;

  // -------- Filteration configs --------
  skillsFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Skills" },
    import: false,
  };

  // -------- Actions configs --------
  skillsActions: ShowActions = {
    add: { show: true, label: "New Skill", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  skillsColumns: { field: keyof lookup | "actions"; header: string }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Skill Name" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  skillsFilters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchSkills = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Handle filters --------
  onFiltersChange(filters: Record<string, any>) {
    this.skillsFilters = { ...filters };
    this.skillsList.loadData(this.skillsList.pagination, this.skillsFilters);
  }

  // -------- Add --------
  onAddSkill() {
    const ref = this.dialogService.open(ResourcesSkillsPopup, {
      header: "Add Skill",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Skill added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditSkill(row: lookup) {
    const ref = this.dialogService.open(ResourcesSkillsPopup, {
      header: "Edit Skill",
      width: "600px",
      modal: true,
      data: row,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Skill updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteSkill(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Skill deleted successfully 🗑️",
        })
      );
  }

  // -------- Archive --------
  onArchiveSkill(id: number) {
    this.service
      .archive(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Skill archived successfully.",
        })
      );
  }

  private reloadList() {
    this.skillsList.loadData(this.skillsList.pagination, this.skillsFilters);
  }
}
