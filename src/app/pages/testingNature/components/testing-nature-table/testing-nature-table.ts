import { Component, ContentChild, TemplateRef } from "@angular/core";
import { TestingNatureService } from "../../services/testingNatureService/testing-nature-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";

@Component({
  selector: "app-testing-nature-table",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    CustomPaginatorComponent,
    NgbDropdownModule,
  ],
  templateUrl: "./testing-nature-table.html",
  styleUrl: "./testing-nature-table.scss",
})
export class TestingNatureTable {
  @ContentChild("actionTemplate") actionsTemplate!: TemplateRef<any>;
  constructor(public testingNatureService: TestingNatureService) {}

  ngOnInit(): void {}
  loadControls(event: { pageNumber: number; pageSize: number }) {
    this.testingNatureService.pagination.set(event);
  }
}
