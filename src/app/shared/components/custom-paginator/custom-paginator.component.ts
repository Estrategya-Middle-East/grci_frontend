import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PaginatorModule } from "primeng/paginator";
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: "app-custom-paginator",
  standalone: true,
  imports: [PaginatorModule],
  templateUrl: "./custom-paginator.component.html",
  styleUrl: "./custom-paginator.component.scss",
})
export class CustomPaginatorComponent {
  @Input() first: number = 0;
  @Input() pagination: any = {};
  @Input() rows: number = 10;
  @Output() pageNumber = new EventEmitter<any>();

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;

    const pageNumber = event.page;
    const pageSizeChanged = this.pagination.pageSize !== event.rows;

    // Update pagination
    this.pagination.pageSize = event.rows;

    const pagination = {
      pageNumber: pageSizeChanged ? 1 : pageNumber + 1, // reset to first page if pageSize changes
      pageSize: this.pagination.pageSize,
    };

    // Emit updated pagination
    this.pageNumber.emit(pagination);
  }

  ngOnInit(): void {}
}
