import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AuditTeamService } from "../../services/auditTeam/audit-team-service";
import { CommonModule } from "@angular/common";
import { distinctUntilChanged, skip } from "rxjs";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-audit-team-filter",
  imports: [SelectModule, ReactiveFormsModule, CommonModule, MultiSelectModule],
  templateUrl: "./audit-team-filter.html",
  styleUrl: "./audit-team-filter.scss",
})
export class AuditTeamFilter implements OnInit {
  public auditService = inject(AuditItemService);
  public auditTeamService = inject(AuditTeamService);
  private messageService = inject(MessageService);
  teamForm!: FormGroup;
  show: boolean = false;
  roleOptions = [
    { label: "Manager", value: "1" },
    { label: "Senior", value: "2" },
    { label: "Auditor", value: "3" },
  ];
  constructor(private fb: FormBuilder) {
    this.initForm();
    this.getLoopups();
  }
  ngOnInit() {
    this.auditTeamService._editFeedback$.pipe(skip(1)).subscribe((feedback) => {
      if (feedback) {
        // Patch the form when editFeedback changes
        this.getAudititemsLookups(feedback.value.auditPlanId?.toString() ?? "");
        this.show = feedback.show;
        this.teamForm.patchValue({
          skills: feedback.value.allSkills?.map((s) => s.id) ?? [],
          role: feedback.value.auditRole ?? null,
          plan: feedback.value.auditPlanId ?? null,
          contribution: feedback.value.contributionPercent,
          auditItemId: feedback.value.auditItemId,
        });
      }
    });
  }
  initForm() {
    this.teamForm = this.fb.group({
      auditItemId: ["", Validators.required],
      plan: ["", Validators.required],
      role: ["", Validators.required],
      contribution: ["", Validators.required],
      skills: ["", Validators.required],
    });
  }
  getLoopups() {
    this.auditTeamService.getLookups().subscribe();
  }
  getAudititemsLookups(id: string) {
    if (id) {
      this.auditTeamService.getAuditItemsbyAuditPlanLookups(id).subscribe({
        next: (res) => {
          this.auditService.auditItemsLookupSignal.set(res);
          if (this.auditTeamService.editFeedback.value.auditItemId) {
            this.teamForm
              .get("auditItemId")
              ?.setValue(this.auditTeamService.editFeedback.value.auditItemId);
          }
        },
      });
    } else {
      this.teamForm.get("plan")?.setValue("");
    }
  }
  onEdit() {
    let editfeedbackDataId =
      this.auditTeamService.editFeedback.value.id?.toString() || "";
    this.auditTeamService
      .updateAuditTeam(editfeedbackDataId, {
        auditItemId: Number(this.teamForm.value.auditItemId),
        auditPlanId: Number(this.teamForm.value.plan),
        auditRole: Number(this.teamForm.value.role),
        contributionPercent: Number(this.teamForm.value.contribution),
        resourceSkillIds: this.teamForm.value.skills,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.auditTeamService.getTableData({}).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: err.error.errors[0],
          });
        },
      });
  }
  onCancel() {
    this.auditTeamService.editFeedback = {
      show: false,
      value: {},
    };
  }
  onApply() {
    this.auditTeamService
      .createAuditTeam({
        auditItemId: Number(this.teamForm.value.auditItemId),
        auditPlanId: Number(this.teamForm.value.plan),
        auditRole: Number(this.teamForm.value.role),
        contributionPercent: Number(this.teamForm.value.contribution),
        resourceSkillIds: this.teamForm.value.skills,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.auditTeamService.getTableData({}).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: err.error.errors[0],
          });
        },
      });
  }
  getauditItems() {
    const auditPlan = this.teamForm.get("plan")?.value;
    this.auditTeamService.getAuditItemsbyAuditPlanLookups(auditPlan).subscribe({
      next: (res: any) => {
        this.auditService.auditItemsLookupSignal.set(res);
      },
    });
  }
  get selectedSkillIds() {
    return (
      this.auditTeamService.editFeedback.value.allSkills?.map((s) => s.id) ?? []
    );
  }
}
