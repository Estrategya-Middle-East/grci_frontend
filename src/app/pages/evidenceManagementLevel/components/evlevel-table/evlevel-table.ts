import { Component, ContentChild, TemplateRef } from "@angular/core";
import { AuditItemService } from "../../../audit/services/auditItem/audit-item-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { EVManagmentService } from "../../services/EVManagementLevel/evmanagment-service";

@Component({
  selector: "app-evlevel-table",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    CustomPaginatorComponent,
    NgbDropdownModule,
  ],
  templateUrl: "./evlevel-table.html",
  styleUrl: "./evlevel-table.scss",
})
export class EVLevelTable {
  @ContentChild("actionTemplate") actionsTemplate!: TemplateRef<any>;
  constructor(public evLevelsService: EVManagmentService) {}

  ngOnInit(): void {}
  loadControls(event: { pageNumber: number; pageSize: number }) {
    this.evLevelsService.pagination.set(event);
  }
}
