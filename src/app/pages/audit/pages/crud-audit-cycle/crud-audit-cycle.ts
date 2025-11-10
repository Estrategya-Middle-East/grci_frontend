import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { NgbDropdown, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DatePickerModule } from "primeng/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { AuditCycleService } from "../../services/auditCycle/audit-cycle";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AuditItemService } from "./../../services/auditItem/audit-item-service";

interface YearOption {
  label: string;
  value: number;
}
@Component({
  selector: "app-crud-audit-cycle",
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    TextareaModule,
  ],
  providers: [DialogService],
  templateUrl: "./crud-audit-cycle.html",
  styleUrl: "./crud-audit-cycle.scss",
})
export class CrudAuditCycle implements OnInit {
  private auditCycleService = inject(AuditCycleService);
  private AuditItemService = inject(AuditItemService);
  code = signal<string>("");
  title = signal<string>("");
  fromYear = signal<number | null>(null);
  toYear = signal<number | null>(null);
  objectives = signal<string>("");
  scope = signal<string>("");
  strategicFramework = signal<string>("");
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
  public messageService = inject(MessageService);
  // Year options
  id: string = "";

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParamMap.get("id") || "";
    this.code.set(this.activatedRoute.snapshot.queryParamMap.get("code") || "");
  }
  yearOptions = signal<YearOption[]>(this.generateYearOptions());

  // Computed signals
  yearRangeValid = computed(() => {
    const from = this.fromYear();
    const to = this.toYear();
    return from !== null && to !== null && from <= to;
  });
  yearRangeText = computed(() => {
    const from = this.fromYear();
    const to = this.toYear();

    if (from && to) {
      const years = to - from + 1;

      if (years === 3) {
        return `Covers ${years} consecutive years`;
      } else {
        return `Please select exactly 3 consecutive years (currently ${years})`;
      }
    }

    return "Please select a year range";
  });

  isFormValid = computed(() => {
    return (
      !!this.title()?.trim() &&
      this.fromYearProp !== null &&
      this.toYearProp !== null &&
      !!this.objectives()?.trim() &&
      !!this.scope()?.trim() &&
      !!this.strategicFramework()?.trim()
    );
  });

  // Event handlers
  onCodeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.code.set(value);
  }

  onTitleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.title.set(value);
  }
  fromYearProp: number = 0;
  onFromYearChange(value: Date): void {
    const year = value.getFullYear();
    this.fromYearProp = year;
  }
  toYearProp: number = 10;
  onToYearChange(value: Date): void {
    const year = value.getFullYear();
    this.toYearProp = year;
  }

  onObjectivesChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.objectives.set(value);
  }

  onScopeChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.scope.set(value);
  }

  onFrameworkChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.strategicFramework.set(value);
  }
  loadAuditCycles() {
    this.auditCycleService
      .getAuditCycles({
        pageNumber: this.AuditItemService.pagination().pageNumber,
        pageSize: this.AuditItemService.pagination().pageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.auditCycleService.auditCycles.set(res.data.items);
          this.auditCycleService.totalRecords.set(res.data.totalItems);
          const totalItems = res.data.totalItems ?? 0;
          const current = this.AuditItemService.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.AuditItemService.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data.items ?? []).map((item: any) => ({
            ...item,
            YearsRange: item.startDate + " - " + item.endDate,
            action: true,
          }));

          this.AuditItemService.auditItemsSignal.set(items);
          this.AuditItemService.auditHeaderSignal.set([
            { header: "Code", field: "code" },
            { header: "Title", field: "title" },
            { header: "Years Range", field: "yearRange" },
            { header: "Objectives", field: "auditObjectives" },
            { header: "Scope", field: "auditScope" },
            { header: "Strategic Framework", field: "strategicFramework" },
            { header: "Action", field: "action" },
          ]);
        },
        error: (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.error[0],
          });
        },
      });
  }
  onSave(): void {
    if (this.isFormValid()) {
      const formData = {
        title: this.title(),
        fromYear: this.fromYearProp,
        toYear: this.toYearProp,
        auditObjectives: this.objectives(),
        auditScope: this.scope(),
        strategicFramework: this.strategicFramework(),
      };
      this.auditCycleService.createAuditCycle(formData).subscribe({
        next: (res) => {},
        error: (err: HttpErrorResponse) => {},
      });
      // Handle save logic here
    }
  }
  onEdit(): void {
    if (this.isFormValid()) {
      const formData = {
        code: this.code(),
        title: this.title(),
        fromYear: this.fromYearProp,
        toYear: this.toYearProp,
        auditObjectives: this.objectives(),
        auditScope: this.scope(),
        strategicFramework: this.strategicFramework(),
      };
      this.auditCycleService.updateAuditCycle(this.id, formData).subscribe({
        next: (res) => {},
        error: (err: HttpErrorResponse) => {},
      });
      // Handle save logic here
    }
  }

  onCancel(): void {
    console.log("Cancelled");
    this.router.navigate(["/audit/cycle"]);
    // Handle cancel logic here
  }

  private generateYearOptions(): YearOption[] {
    const currentYear = new Date().getFullYear();
    const years: YearOption[] = [];

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push({ label: i.toString(), value: i });
    }

    return years;
  }
}
