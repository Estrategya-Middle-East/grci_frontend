import { Component, inject, OnInit } from "@angular/core";
import { AuditPlanMemorandumServie } from "../../services/audit-plan-memorandum-service";
import { AuditPlanService } from "../../../audit-plan/services/audit-plan-service";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { StepsModule } from "primeng/steps";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [TableModule, ButtonModule, StepsModule, FormsModule],
  templateUrl: "./add-edit.html",
  styleUrls: ["./add-edit.scss"],
})
export class AddEdit implements OnInit {
  private service = inject(AuditPlanMemorandumServie);
  private auditPlanService = inject(AuditPlanService);
  private messageService = inject(MessageService);

  activeIndex: number = 0;

  steps = [
    { label: "Select Audit Plan" },
    { label: "Select Audit Item" },
    { label: "Fill Memorandum" },
  ];

  auditPlans: any[] = [];
  auditItems: any[] = [];

  selectedPlan: any = null;
  selectedItem: any = null;

  memorandumPayload: any = {
    auditPlanId: null,
    auditItemId: null,
    background: "",
    auditObjectives: "",
    auditScope: "",
    excludedFromScope: "",
    announcementLetterSentMilestone: "",
    completionOfPlanningMilestone: "",
    fieldworkMilestone: "",
    reportMilestone: "",
    reporting: "",
    riskAnalyses: [],
  };

  ngOnInit() {
    this.loadAuditPlans();
  }

  loadAuditPlans() {
    this.auditPlanService
      .getList()
      .subscribe((res) => (this.auditPlans = res.items));
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.memorandumPayload.auditPlanId = plan.id;
    this.loadAuditItems(plan.id);
    this.activeIndex = 1;
  }

  loadAuditItems(auditPlanId: number) {
    this.auditPlanService
      .getAuditItemsList(auditPlanId)
      .subscribe((res) => (this.auditItems = res.items));
  }

  selectItem(item: any) {
    this.selectedItem = item;
    this.memorandumPayload.auditItemId = item.id;
    this.activeIndex = 2;
  }

  prevStep() {
    if (this.activeIndex > 0) this.activeIndex--;
  }

  submitMemorandum() {
    this.service.create(this.memorandumPayload).subscribe(() => {
      this.messageService.add({
        severity: "success",
        summary: "Created",
        detail: "Audit plan memorandum created successfully 🎉",
      });
      this.activeIndex = 0;
      this.selectedPlan = null;
      this.selectedItem = null;
      this.memorandumPayload = {
        ...this.memorandumPayload,
        auditPlanId: null,
        auditItemId: null,
      };
    });
  }
}
