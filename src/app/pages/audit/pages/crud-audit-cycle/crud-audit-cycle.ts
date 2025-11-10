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
import { AuditItemService } from "./../../services/auditItem/audit-item-service";
import { finalize } from "rxjs";

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
    this.getAuditCycleById(this.id);
  }

  // Computed signals
  onFromYearChange(date: Date) {
    const year = date.getFullYear();
    this.fromYear.set(year);
  }

  get fromYearAsDate(): Date | null {
    const year = this.fromYear();
    return year !== null ? new Date(year, 0, 1) : null;
  }

  onToYearChange(date: Date) {
    const year = date.getFullYear();
    this.toYear.set(year);
  }

  get toYearAsDate(): Date | null {
    const year = this.toYear();
    return year !== null ? new Date(year, 0, 1) : null;
  }
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
      this.fromYear() !== null &&
      this.toYear() !== null &&
      !!this.objectives()?.trim() &&
      !!this.scope()?.trim() &&
      !!this.strategicFramework()?.trim()
    );
  });
  loading = signal(false);
  fromYearProp!: Date;
  toYearProp!: Date;
  getAuditCycleById(id: string) {
    this.loading.set(true);
    this.auditCycleService.getAuditCycleById(id).subscribe({
      next: (res) => {
        this.code.set(res.data.code);
        this.title.set(res.data.title);
        this.fromYearProp = new Date(res.data.fromYear, 0, 1); // ✅ make sure it’s a number
        this.toYearProp = new Date(res.data.toYear, 0, 1);
        this.strategicFramework.set(res.data.strategicFramework);
        this.scope.set(res.data.auditScope);
        this.objectives.set(res.data.auditObjectives);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: err.error.error[0],
        });
      },
    });
  }
  // Event handlers
  onCodeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.code.set(value);
  }

  onTitleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.title.set(value);
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
        error: (err: HttpErrorResponse) => {
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
        fromYear: this.fromYear(),
        toYear: this.toYear(),
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
        fromYear: this.fromYear(),
        toYear: this.toYear(),
        auditObjectives: this.objectives(),
        auditScope: this.scope(),
        strategicFramework: this.strategicFramework(),
      };
      this.auditCycleService.updateAuditCycle(this.id, formData).subscribe({
        next: (res: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.error[0],
          });
        },
      });
      // Handle save logic here
    }
  }

  onCancel(): void {
    console.log("Cancelled");
    this.router.navigate(["/audit/cycle"]);
    // Handle cancel logic here
  }
}
