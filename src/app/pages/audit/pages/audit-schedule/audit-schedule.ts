import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
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
  templateUrl: "./audit-schedule.html",
  styleUrl: "./audit-schedule.scss",
})
export class AuditSchedule implements OnInit {
  auditForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auditService: AuditItemService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}
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
      activityName: [],
      description: [""],
      resources: [[], Validators.required],
    });
  }

  onSave() {
    if (this.auditForm.valid) {
      const formData = this.auditForm.value;
      let data = {
        title: formData.title,
        auditItemId: formData.auditItemId,
        keyActivities: [
          {
            activityName: formData.activityName,
            description: formData.description,
          },
        ],
        startDate: formData.startDate,
        endDate: formData.endDate,
        resources: formData.resources,
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

    ref.onClose.subscribe((result) => {
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
  EditAuditItemSchadule(row: any) {
    this.auditForm.patchValue({
      ...row,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
    });
    this.showEdit = true;
  }
  onEdit() {
    const formData = this.auditForm.value;
    let data = {
      id: formData.id,
      title: formData.title,
      auditItemId: formData.auditItemId,
      keyActivities: [
        {
          activityName: formData.activityName,
          description: formData.description,
        },
      ],
      startDate: formData.startDate,
      endDate: formData.endDate,
      resources: formData.resources,
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
    this.showEdit = false;
    this.auditForm.reset(
      Object.fromEntries(
        Object.keys(this.auditForm.controls).map((key) => [key, ""])
      )
    );
  }
}
