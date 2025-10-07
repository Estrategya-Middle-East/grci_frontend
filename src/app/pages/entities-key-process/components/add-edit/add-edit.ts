import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, of } from "rxjs";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { MessageService } from "primeng/api";
import { EntitiesKeyProcessService } from "../../services/entities-key-process-service";
import {
  ProcessManagement,
  ProcessType,
} from "../../models/key-process/key-process";
import { ResourceService } from "../../../resources-management/services/resource";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { SelectModule } from "primeng/select";
import { appRoutes } from "../../../../app.routes.enum";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    HeaderComponent,
    SelectModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private keyProcessService = inject(EntitiesKeyProcessService);
  private resourceService = inject(ResourceService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  processId: number | null = null;
  entityId: string | null = null;

  accounts: any[] = [];
  parentProcesses: ProcessManagement[] = [];

  processTypes = [
    { label: "Process Group", value: ProcessType.ProcessGroup },
    { label: "Process", value: ProcessType.Process },
    { label: "Activity", value: ProcessType.Activity },
    { label: "Task", value: ProcessType.Task },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.checkIfEditMode();

    this.formGroup.get("type")?.valueChanges.subscribe((type) => {
      const parentControl = this.formGroup.get("parentId");

      if (type === ProcessType.ProcessGroup) {
        // Clear and remove required
        parentControl?.reset();
        parentControl?.clearValidators();
        parentControl?.updateValueAndValidity();
        this.parentProcesses = [];
      } else if (this.entityId != null) {
        // Add required validator dynamically
        parentControl?.setValidators([Validators.required]);
        parentControl?.updateValueAndValidity();
        this.loadPotentialParents(this.entityId, type);
      }
    });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      entityName: [{ value: "", disabled: true }],
      type: [null, Validators.required],
      name: ["", Validators.required],
      parentId: [null],
      description: ["", Validators.required],
      processOwnerId: [null, Validators.required],
    });
  }

  private loadLookups(): void {
    this.resourceService
      .getUsersLookUp()
      .pipe(catchError(() => of([])))
      .subscribe((res) => (this.accounts = res));
  }

  private loadPotentialParents(entityId: string, type: number): void {
    this.keyProcessService
      .getPotentialParent(entityId, type)
      .pipe(catchError(() => of([])))
      .subscribe((res) => (this.parentProcesses = res));
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const entityId = params.get("entityId");
      const processId = params.get("processId");

      if (entityId) this.entityId = entityId;

      if (processId) {
        this.processId = +processId;
        this.loadProcess(this.processId);
      }
    });
  }

  private loadProcess(id: number): void {
    this.keyProcessService.getProcessManagementById(id).subscribe({
      next: (res: ProcessManagement) => {
        this.formGroup.patchValue({
          entityName: res.entityName,
          type: res.type,
          name: res.name,
          parentId: res.parentId,
          description: res.description,
          processOwnerId: res.processOwnerId,
        });

        if (this.entityId) {
          this.loadPotentialParents(this.entityId, res.type);
        }
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.formGroup.getRawValue(),
      entityId: this.entityId,
    };

    const action$ = this.processId
      ? this.keyProcessService.updateProcessManagement(this.processId, payload)
      : this.keyProcessService.createProcessManagement(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Process saved successfully 🎉",
        });
        this.router.navigate([
          "/entities",
          this.entityId,
          `${appRoutes["KEY-PROCESS"]}`,
        ]);
      },
    });
  }

  onCancel(): void {
    this.router.navigate([
      "/entities",
      this.entityId,
      `${appRoutes["KEY-PROCESS"]}`,
    ]);
  }
}
