import { CommonModule } from "@angular/common";
import { Component, ContentChild, TemplateRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { StorageLocationService } from "../../services/storageLocation/storage-location-service";

@Component({
  selector: "app-storage-location-table",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    CustomPaginatorComponent,
    NgbDropdownModule,
  ],
  templateUrl: "./storage-location-table.html",
  styleUrl: "./storage-location-table.scss",
})
export class StorageLocationTable {
  @ContentChild("actionTemplate") actionsTemplate!: TemplateRef<any>;
  constructor(public storageLocationService: StorageLocationService) {}

  ngOnInit(): void {}
  loadControls(event: { pageNumber: number; pageSize: number }) {
    this.storageLocationService.pagination.set(event);
  }
}
