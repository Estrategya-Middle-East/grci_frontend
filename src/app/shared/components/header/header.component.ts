import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectionStrategy,
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
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private filtersSubject = new BehaviorSubject<Record<string, any>>({});
  filters$ = this.filtersSubject.asObservable();

  // New BehaviorSubject for dropdown changes
  private dropdownSubject = new BehaviorSubject<{
    index: number;
    value: any;
  } | null>(null);

  ngOnInit(): void {
    // Search input with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => this.updateFilter("search", value));

    // Dropdown changes with debounce
    this.dropdownSubject
      .asObservable()
      .pipe(
        debounceTime(300) // wait 300ms after last change
      )
      .subscribe((data) => {
        if (!data) return;
        const dropdown = this.dropdownList[data.index];
        if (!dropdown) return;
        this.updateFilter(
          dropdown.searchType || `filter${data.index}`,
          data.value.value
        );
      });

    // Initialize dropdown values as filters
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
    this.dropdownSubject.next({ index, value }); // emit to subject instead of direct update
  }

  onSwitchView(value: boolean) {
    this.switchView.emit(value);
  }
}
