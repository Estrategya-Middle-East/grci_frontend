import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import {
  DropdownList,
  ShowActions,
  ShowFilteration,
} from "./models/header.interface";
import { DatePickerModule } from "primeng/datepicker";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    SelectModule,
    InputTextModule,
    RouterLink,
    RouterLinkActive,
    DatePickerModule,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<Record<string, any>>();
  @Output() switchView = new EventEmitter<boolean>();

  @Input() isSwitchView = true;
  @Input() title = "";
  @Input() showActions?: ShowActions;
  @Input() showFilteration?: ShowFilteration;
  @Input() dropdownList: DropdownList[] = [];

  searchControl = new FormControl<string>("");
  yearControl = new FormControl<Date | null>(null);

  private filtersSubject = new BehaviorSubject<Record<string, any>>({});
  filters$ = this.filtersSubject.asObservable();

  private dropdownSubject = new BehaviorSubject<{
    index: number;
    value: any;
  } | null>(null);

  ngOnInit(): void {
    // Search input debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => this.updateFilter("search", value));

    // Year input debounce
    this.yearControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        const year = value ? value.getFullYear() : null; // convert to number
        this.updateFilter("year", year);
      });

    // Dropdown changes with debounce
    this.dropdownSubject
      .asObservable()
      .pipe(debounceTime(300))
      .subscribe((data) => {
        if (!data) return;
        const dropdown = this.dropdownList[data.index];
        console.log(dropdown);

        if (!dropdown) return;
        this.updateFilter(
          dropdown.searchType || `filter${data.index}`,
          data.value.value
        );
      });

    // Initialize dropdown filters
    this.dropdownList.forEach((dropdown, index) => {
      if (dropdown.selected) {
        this.updateFilter(
          dropdown.searchType || `filter${index}`,
          dropdown.selected
        );
      }
    });
  }

  private updateFilter(key: string, value: any) {
    const currentFilters = this.filtersSubject.getValue();
    const updatedFilters = { ...currentFilters, [key]: value };
    this.filtersSubject.next(updatedFilters);
    this.filtersChange.emit(updatedFilters);
  }

  onDropdownChange(value: any, index: number): void {
    this.dropdownSubject.next({ index, value });
  }

  onSwitchView(value: boolean) {
    this.switchView.emit(value);
  }
}
