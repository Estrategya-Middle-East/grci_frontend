import { CommonModule } from "@angular/common";
import { Component, effect, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AuditTable } from "../../components/audit-table/audit-table";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-audit-schedule",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    ToastModule,
    DatePickerModule,
    AuditTable,
    NgbDropdownModule,
  ],
  providers: [DialogService],
  templateUrl: "./audit-item-schedule.html",
  styleUrl: "./audit-item-schedule.scss",
})
export class AuditItemSchedule implements OnInit {
  auditForm!: FormGroup;
  initialized: boolean = false;
  constructor(
    private fb: FormBuilder,
    public auditService: AuditItemService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const pagination = this.auditService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.getTableData(pagination);
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.getTableData(pagination);
    });
  }
  ngOnInit(): void {
    this.initForm();
    this.getAllLookups();
    this.getTableData({});
  }

  initForm() {
    this.auditForm = this.fb.group({
      id: [],
      title: ["", Validators.required],
      auditItemId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      resources: [[], Validators.required],
      keyActivities: this.fb.array([this.createKeyActivity()]),
    });
  }
  createKeyActivity() {
    return this.fb.group({
      activityName: ["", Validators.required],
      description: [""],
    });
  }
  get keyActivities(): FormArray {
    return this.auditForm.get("keyActivities") as FormArray;
  }

  addKeyActivity() {
    this.keyActivities.push(this.createKeyActivity());
  }

  removeKeyActivity(index: number) {
    this.keyActivities.removeAt(index);
  }
  onSave() {
    if (this.auditForm.valid) {
      const formData = this.auditForm.value;
      const data = {
        title: formData.title ?? "",
        auditItemId: formData.auditItemId ?? 0,
        startDate: formData.startDate ?? new Date().toISOString(),
        endDate: formData.endDate ?? new Date().toISOString(),
        keyActivities: (formData.keyActivities || []).map((activity: any) => ({
          activityName: activity.activityName ?? "",
          description: activity.description ?? "",
        })),
        resources: (formData.resources || []).map((res: any) =>
          typeof res === "number" ? res : parseInt(res, 10)
        ),
      };

      this.auditService.addAuditSchedule(data).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getTableData({});
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.error[0],
          });
        },
      });
      // Here you would typically send the data to your backend service
    }
  }
  getAllLookups() {
    this.auditService.getAuditScheduleDropdowns().subscribe();
  }
  getTableData(data: Object) {
    this.auditService.getauditItemsScheduleList(data).subscribe();
  }
  deleteAuditItemSchadule(id: string, title: string) {
    const ref = this.dialogService.open(MessageRequest, {
      header: " ", // Empty space to show the close button, or remove for no header
      width: "600px",
      height: "370px",
      modal: true, // This adds the backdrop
      dismissableMask: false, // Prevents closing when clicking outside
      closable: false, // Remove the X button if you want
      data: {
        itemName: title, // Pass the item name to display
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.auditService.deleteScheduleAuditItem(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.getTableData(this.auditService.pagination());
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
    });
  }
  showEdit: boolean = false;
  setFormData(data: any) {
    this.showEdit = true;
    // Patch normal fields
    this.auditForm.patchValue({
      id: data.id,
      title: data.title,
      auditItemId: data.auditItemId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      resources: data.resources,
    });

    // Clear old form array
    const keyActivitiesArray = this.auditForm.get("keyActivities") as FormArray;
    keyActivitiesArray.clear();
    // Rebuild the form array from data
    data.keyActivities.forEach((activity: any) => {
      keyActivitiesArray.push(
        this.fb.group({
          activityName: [activity.activityName, Validators.required],
          description: [activity.description],
        })
      );
    });
  }

  onEdit() {
    const formData = this.auditForm.value;
    const data = {
      id: formData.id,
      title: formData.title ?? "",
      auditItemId: formData.auditItemId ?? 0,
      startDate: formData.startDate ?? new Date().toISOString(),
      endDate: formData.endDate ?? new Date().toISOString(),
      keyActivities: (formData.keyActivities || []).map(
        (activity: any, index: number) => ({
          activityName: activity.activityName ?? "",
          description: activity.description ?? "",
        })
      ),
      resources: (formData.resources || []).map((res: any) =>
        typeof res === "number" ? res : parseInt(res, 10)
      ),
    };

    this.auditService.EditAuditSchedule(data, data.id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        this.getTableData({});
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
  onCancel() {
    this.auditForm.reset(
      Object.fromEntries(
        Object.keys(this.auditForm.controls).map((key) => [key, ""])
      )
    );

    (this.auditForm.get("keyActivities") as FormArray).clear();
    (this.auditForm.get("keyActivities") as FormArray).push(
      this.createKeyActivity()
    );
    this.showEdit = false;
  }
}
