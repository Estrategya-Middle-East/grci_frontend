import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { DatePickerModule } from "primeng/datepicker";
import { Select } from "primeng/select";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { MessageService } from "primeng/api";
import { catchError, forkJoin, of } from "rxjs";
import { MitigationPlanPayload } from "../../models/mitigation-management";
import { MitigationManagementService } from "../../services/mitigation-management";
import { ResourceService } from "../../../resources-management/services/resource";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    Select,
    HeaderComponent,
  ],
  templateUrl: "./add-edit.html",
  styleUrls: ["./add-edit.scss"],
})
export class AddEdit implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private mitigationService = inject(MitigationManagementService);
  private resourceService = inject(ResourceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  formGroup!: FormGroup;
  mitigationPlanId: number | null = null;

  switchStatus = signal<"draft" | "active">("draft");
  evidencePreviews = signal<{ id?: number; url: string }[]>([]);
  selectedFiles: File[] = [];

  owners = signal<{ id: number; name: string }[]>([]);
  types = signal<{ id: number; name: string }[]>([]);
  categories = signal<{ id: number; name: string }[]>([]);
  automations = signal<{ id: number; name: string }[]>([]);
  natures = signal<{ id: number; name: string }[]>([]);
  risks = signal<{ id: number; name: string }[]>([]);

  ngOnInit(): void {
    this.createForm();
    this.loadDropdownData();
    this.checkIfEditMode();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      name: ["", Validators.required],
      ownerId: ["", Validators.required],
      status: ["draft", Validators.required],
      typeId: ["", Validators.required],
      categoryId: ["", Validators.required],
      automationId: ["", Validators.required],
      natureId: ["", Validators.required],
      validityFrom: ["", Validators.required],
      validityTo: ["", Validators.required],
      riskId: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.mitigationPlanId = +id;
        this.loadMitigationPlan(this.mitigationPlanId);
      }
    });
  }

  private loadMitigationPlan(id: number): void {
    this.mitigationService.getMitigationPlanById(id).subscribe({
      next: (plan) => {
        this.formGroup.patchValue({
          name: plan.name,
          description: plan.description,
          validityFrom: plan.validityFrom ? new Date(plan.validityFrom) : null,
          validityTo: plan.validityTo ? new Date(plan.validityTo) : null,
          ownerId: plan.mitigationPlanOwnerId,
          typeId: plan.mitigationTypeId,
          categoryId: plan.mitigationCategoryId,
          automationId: plan.mitigationAutomationId,
          natureId: plan.mitigationNatureId,
          riskId: plan.risks?.[0]?.id ?? "",
          status: plan.status === 1 ? "active" : "draft",
        });

        this.switchStatus.set(plan.status === 1 ? "active" : "draft");

        if (plan.evidenceAttachments?.length) {
          const urls = plan.evidenceAttachments.map((a) => ({
            id: a.id,
            url: `${environment.baseUrl}${a.fileUrl}`,
          }));
          this.evidencePreviews.set(urls);
        }

        this.formGroup.updateValueAndValidity();
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load mitigation plan",
        });
        this.router.navigateByUrl("/mitigation-management");
      },
    });
  }

  private loadDropdownData(): void {
    forkJoin({
      owners: this.resourceService.getUsersLookUp().pipe(
        catchError((err) => {
          console.error("❌ Failed to load users (owners)", err);
          return of([]);
        })
      ),
      types: this.mitigationService.getMitigationTypesLookup().pipe(
        catchError((err) => {
          console.error("❌ Failed to load mitigation types", err);
          return of([]);
        })
      ),
      categories: this.mitigationService.getMitigationCategoriesLookup().pipe(
        catchError((err) => {
          console.error("❌ Failed to load mitigation categories", err);
          return of([]);
        })
      ),
      automations: this.mitigationService.getMitigationAutomationsLookup().pipe(
        catchError((err) => {
          console.error("❌ Failed to load mitigation automations", err);
          return of([]);
        })
      ),
      natures: this.mitigationService.getMitigationNaturesLookup().pipe(
        catchError((err) => {
          console.error("❌ Failed to load mitigation natures", err);
          return of([]);
        })
      ),
      risks: this.mitigationService.getMitigationRisksLookup().pipe(
        catchError((err) => {
          console.error("❌ Failed to load mitigation natures", err);
          return of([]);
        })
      ),
    }).subscribe((res) => {
      this.owners.set(res.owners);
      this.types.set(res.types);
      this.categories.set(res.categories);
      this.automations.set(res.automations);
      this.natures.set(res.natures);
      this.risks.set(res.risks);
    });
  }

  toggleStatus(value: "draft" | "active"): void {
    this.switchStatus.set(value);
    this.formGroup.patchValue({ status: value });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newFiles = Array.from(input.files ?? []);

    this.selectedFiles = [...this.selectedFiles, ...newFiles];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.evidencePreviews.update((current) => [
          ...current,
          { url: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });

    input.value = "";
  }

  removeEvidence(event: Event, index: number): void {
    event.stopPropagation();
    const current = this.evidencePreviews();
    const evidence = current[index];

    if (this.mitigationPlanId && evidence.id) {
      this.mitigationService
        .removeEvidenceFromMitigationPlan(evidence.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Removed",
              detail: "Evidence removed successfully ✅",
            });
            this.evidencePreviews.update((prev) =>
              prev.filter((_, i) => i !== index)
            );
          },
          error: (err) => {
            console.error("❌ Failed to remove evidence:", err);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to remove evidence 😞",
            });
          },
        });
    } else {
      this.evidencePreviews.update((prev) =>
        prev.filter((_, i) => i !== index)
      );
      this.selectedFiles.splice(index, 1);
    }
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValue = this.formGroup.value;

    const mitigationPlan: MitigationPlanPayload = {
      name: formValue.name,
      description: formValue.description,
      validityFrom: formValue.validityFrom,
      validityTo: formValue.validityTo,
      status: formValue.status === "active" ? 1 : 0,
      riskIds: [formValue.riskId],
      mitigationPlanOwnerId: formValue.ownerId,
      mitigationTypeId: formValue.typeId,
      mitigationCategoryId: formValue.categoryId,
      mitigationAutomationId: formValue.automationId,
      mitigationNatureId: formValue.natureId,
      evidenceAttachments: [],
    };

    const existingEvidence = this.evidencePreviews()
      .filter((e) => e.id)
      .map((e) => ({
        id: e.id!,
        mitigationPlanId: this.mitigationPlanId ?? 0,
        title: e.url.split("/").pop() ?? "existing-file",
        fileType: 1,
        fileUrl: e.url,
      }));

    const newEvidence = this.selectedFiles.map((file) => ({
      id: 0,
      mitigationPlanId: this.mitigationPlanId ?? 0,
      title: file.name,
      fileType: 1,
      fileUrl: "",
      file,
    }));

    mitigationPlan.evidenceAttachments = [...existingEvidence, ...newEvidence];

    const action$ = this.mitigationPlanId
      ? this.mitigationService.updateMitigationPlan(
          this.mitigationPlanId,
          mitigationPlan
        )
      : this.mitigationService.createMitigationPlan(mitigationPlan);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: `Mitigation Plan ${
            this.mitigationPlanId ? "updated" : "created"
          } successfully 🎉`,
        });
        this.router.navigateByUrl("/mitigation-management");
      },
      error: (err) => {
        console.error("❌ Failed to save mitigation plan:", err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save mitigation plan 😞",
        });
      },
    });
  }
}
