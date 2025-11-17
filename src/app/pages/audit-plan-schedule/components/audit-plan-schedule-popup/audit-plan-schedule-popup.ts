import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { MessageService } from "primeng/api";
import { catchError, finalize, of } from "rxjs";

import { AuditPlanScheduleService } from "../../services/audit-plan-schedule-service";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { AuditPlanScheduleInterface } from "../../models/audit-plan-schedule";
import { DatePickerModule } from "primeng/datepicker";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-audit-plan-schedule-popup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    MultiSelectModule,
    TableModule,
  ],
  templateUrl: "./audit-plan-schedule-popup.html",
  styleUrls: ["./audit-plan-schedule-popup.scss"],
})
export class AuditPlanSchedulePopup implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(AuditPlanScheduleService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  isEditMode = false;
  loading = true;

  scheduleId!: number | null;
  auditPlanId!: number | null;

  resourcesOptions = signal<lookup[]>([]); // dropdown options

  ngOnInit(): void {
    const data = this.config.data;
    this.scheduleId = data?.scheduleId ?? null;
    this.auditPlanId = data?.auditPlanId ?? null;
    this.isEditMode = !!this.scheduleId;

    this.initForm();
    this.loadDropdowns();
    this.loadSchedule();
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      title: ["", Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      resources: [[], Validators.required],
      keyActivities: this.fb.array([]),
    });
  }

  get keyActivitiesFormArray() {
    return this.formGroup.get("keyActivities") as FormArray;
  }

  addKeyActivity(): void {
    this.keyActivitiesFormArray.push(
      this.fb.group({
        id: [null],
        activityName: ["", Validators.required],
        description: ["", Validators.required],
      })
    );
  }

  removeKeyActivity(index: number): void {
    this.keyActivitiesFormArray.removeAt(index);
  }

  private loadDropdowns(): void {
    this.service
      .getResourcesLookup()
      .pipe(catchError(() => of([])))
      .subscribe((res) => this.resourcesOptions.set(res));
  }

  private loadSchedule(): void {
    if (!this.isEditMode || !this.scheduleId) return;

    this.service
      .getById(this.scheduleId)
      .pipe(catchError(() => of(null)))
      .subscribe((res) => {
        if (res) {
          this.formGroup.patchValue({
            title: res.title,
            startDate: new Date(res.startDate),
            endDate: new Date(res.endDate),
            resources: res.resources || [],
          });

          // Patch keyActivities
          this.keyActivitiesFormArray.clear();
          (res.keyActivities || []).forEach((activity) => {
            this.keyActivitiesFormArray.push(
              this.fb.group({
                id: [activity.id],
                activityName: [activity.activityName, Validators.required],
                description: [activity.description, Validators.required],
              })
            );
          });
        }
        this.loading = false;
      });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.formGroup.value,
      auditPlanId: this.auditPlanId,
    };

    const request$ = this.isEditMode
      ? this.service.update(this.scheduleId!, payload)
      : this.service.create(payload);

    request$
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save schedule",
          });
          throw err;
        })
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: "success",
          summary: this.isEditMode ? "Updated" : "Saved",
          detail: `Schedule ${
            this.isEditMode ? "updated" : "created"
          } successfully 🎉`,
        });
        this.ref.close(res);
      });
  }

  close(): void {
    this.ref.close(null);
  }
}
