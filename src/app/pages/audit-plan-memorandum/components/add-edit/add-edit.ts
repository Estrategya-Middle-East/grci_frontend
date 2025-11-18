import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { AuditPlanMemorandumServie } from "../../services/audit-plan-memorandum-service";
import { AuditPlanService } from "../../../audit-plan/services/audit-plan-service";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { StepsModule } from "primeng/steps";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { ActivatedRoute, Router } from "@angular/router";
import { appRoutes } from "../../../../app.routes.enum";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    StepsModule,
    CustomPaginatorComponent,
    HeaderComponent,
    DatePickerModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrls: ["./add-edit.scss"],
})
export class AddEdit implements OnInit {
  @ViewChild("planPaginator") planPaginator!: CustomPaginatorComponent;
  @ViewChild("itemPaginator") itemPaginator!: CustomPaginatorComponent;

  planPagination = { pageNumber: 1, pageSize: 10, totalItems: 0 };
  itemPagination = { pageNumber: 1, pageSize: 10, totalItems: 0 };
  auditCategoriesOptions: lookup[] = [];

  formGroup!: FormGroup;

  editMode: boolean = false;
  memorandumId: number | null = null;

  private service = inject(AuditPlanMemorandumServie);
  private auditPlanService = inject(AuditPlanService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  // Column definitions for dynamic table rendering
  planColumns = [
    { field: "id", header: "Audit Plan ID" },
    { field: "code", header: "Audit Plan Code" },
    { field: "engagementDescription", header: "Engagement" },
    { field: "year", header: "Year" },
    { field: "statusName", header: "Status" },
    { field: "totalAuditItems", header: "# Of Audit Items" },
    // { field: "linkedRisksCount", header: "# Of linked Risks" },
  ];

  itemColumns = [
    { field: "id", header: "Audit Item ID" },
    { field: "code", header: "Audit Item Code" },
    { field: "auditCategoryName", header: "Audit Category" },
    { field: "scope", header: "Scope" },
    { field: "objective", header: "Objectives" },
    { field: "keyFocusAreas", header: "Key Focus Areas" },
    { field: "linkedRiskRatings", header: "Linked Risk Rating" },
    { field: "priorityName", header: "Priority Level" },
    { field: "auditFrequencyName", header: "Audit Frequency" },
    { field: "estimatedEffort", header: "Estimated Effort" },
    { field: "auditOwnerName", header: "Audit Owner" },
    { field: "statusName", header: "Status" },
  ];

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
    this.createForm();
    this.loadAuditCategories();

    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.editMode = true;
        this.memorandumId = +id;
        this.loadMemorandum(this.memorandumId);
      } else {
        this.loadAuditPlans(this.planPagination);
      }
    });
    // this.loadAuditPlans(this.planPagination);
  }

  private loadAuditCategories() {
    this.service.getAuditCategoriesLookup().subscribe({
      next: (res) => {
        this.auditCategoriesOptions = res;
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load audit categories",
        });
      },
    });
  }

  private createForm() {
    this.formGroup = this.fb.group({
      background: ["", Validators.required],
      auditObjectives: ["", Validators.required],
      auditScope: ["", Validators.required],
      excludedFromScope: ["", Validators.required],
      // auditCategories: ["", Validators.required],
      announcementLetterSentMilestone: [null, Validators.required],
      completionOfPlanningMilestone: [null, Validators.required],
      fieldworkMilestone: [null, Validators.required],
      reportMilestone: [null, Validators.required],
      reporting: [null, Validators.required],
      riskAnalyses: this.fb.array([]),
    });

    this.addRiskAnalysesDetail();
  }

  get riskAnalysesFormArray(): FormArray {
    return this.formGroup.get("riskAnalyses") as FormArray;
  }

  addRiskAnalysesDetail() {
    this.riskAnalysesFormArray.push(
      this.fb.group({
        auditCategoryId: ["", Validators.required],
        noOfHours: ["", Validators.required],
        justification: ["", Validators.required],
      })
    );
  }

  removeRiskAnalysesDetail(index: number) {
    this.riskAnalysesFormArray.removeAt(index);
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.memorandumPayload.auditPlanId = plan.id;
    this.activeIndex = 1;
    this.itemPagination.pageNumber = 1;
    this.loadAuditItems(plan.id, this.itemPagination);
  }

  private loadMemorandum(id: number) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.activeIndex = 2;

        this.selectedPlan = { id: res.auditPlanId };
        this.selectedItem = { id: res.auditItemId };

        this.formGroup.patchValue({
          background: res.background,
          auditObjectives: res.auditObjectives,
          auditScope: res.auditScope,
          excludedFromScope: res.excludedFromScope,
          announcementLetterSentMilestone: res.announcementLetterSentMilestone
            ? new Date(res.announcementLetterSentMilestone)
            : null,
          completionOfPlanningMilestone: res.completionOfPlanningMilestone
            ? new Date(res.completionOfPlanningMilestone)
            : null,
          fieldworkMilestone: res.fieldworkMilestone
            ? new Date(res.fieldworkMilestone)
            : null,
          reportMilestone: res.reportMilestone
            ? new Date(res.reportMilestone)
            : null,
          reporting: res.reporting,
        });

        this.riskAnalysesFormArray.clear();
        res.riskAnalyses.forEach((ra: any) => {
          this.riskAnalysesFormArray.push(
            this.fb.group({
              auditCategoryId: [ra.auditCategoryId, Validators.required],
              noOfHours: [ra.noOfHours, Validators.required],
              justification: [ra.justification, Validators.required],
            })
          );
        });
      },
      error: () => {
        this.router.navigateByUrl(appRoutes["AUDIT-PLAN-MEMORANDUM"]);
      },
    });
  }

  loadAuditPlans(pagination: any) {
    const payload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    this.auditPlanService.getList(payload).subscribe((res) => {
      this.auditPlans = res.items.map((p: any) => ({
        ...p,
        linkedRisksCount:
          p.auditItems?.reduce(
            (acc: number, i: any) => acc + (i.linkedRisksCount || 0),
            0
          ) || 0,
        avgRiskRating: "Medium",
      }));
      this.planPagination.totalItems = res.totalItems;
    });
  }

  loadAuditItems(auditPlanId: number, pagination: any) {
    const payload = {
      auditPlanId,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    this.auditPlanService
      .getAuditItemsList(auditPlanId, payload)
      .subscribe((res) => {
        this.auditItems = res.items;
        this.itemPagination.totalItems = res.totalItems;
      });
  }

  prevStep() {
    if (this.editMode) {
      this.router.navigateByUrl(appRoutes["AUDIT-PLAN-MEMORANDUM"]);
      return;
    }
    if (this.activeIndex > 0) this.activeIndex--;
  }

  submitMemorandum() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = {
      auditPlanId: this.selectedPlan?.id,
      auditItemId: this.selectedItem?.id,
      ...this.formGroup.value,
    };

    const action$ =
      this.editMode && this.memorandumId
        ? this.service.update(this.memorandumId, payload)
        : this.service.create(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: `Memorandum ${
            this.editMode ? "updated" : "created"
          } successfully 🎉`,
        });
        this.router.navigateByUrl(appRoutes["AUDIT-PLAN-MEMORANDUM"]);
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: `Failed to ${this.editMode ? "update" : "create"} memorandum`,
        });
      },
    });
  }

  onPlanPageChange(event: any) {
    this.planPagination.pageNumber = event.pageNumber;
    this.planPagination.pageSize = event.pageSize;
    this.loadAuditPlans(this.planPagination);
  }

  onItemPageChange(event: any) {
    this.itemPagination.pageNumber = event.pageNumber;
    this.itemPagination.pageSize = event.pageSize;
    if (this.selectedPlan)
      this.loadAuditItems(this.selectedPlan.id, this.itemPagination);
  }

  selectItem(item: any) {
    this.selectedItem = item;
    this.memorandumPayload.auditItemId = item.id;
    this.activeIndex = 2;
  }
}
