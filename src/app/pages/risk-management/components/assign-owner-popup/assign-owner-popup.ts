import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { RiskManagementService } from "../../services/risk-management-service";
import { MessageService } from "primeng/api";
import { ResourceService } from "../../../resources-management/services/resource";

@Component({
  selector: "app-assign-owner-popup",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule],
  templateUrl: "./assign-owner-popup.html",
  styleUrls: ["./assign-owner-popup.scss"],
})
export class AssignOwnerPopup implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(RiskManagementService);
  private messageService = inject(MessageService);

  owners = signal<{ id: number; name: string }[]>([]);

  formGroup!: FormGroup;
  riskId!: number;
  currentOwnerId!: number | null;
  loading = true;

  ngOnInit(): void {
    this.riskId = this.config.data?.riskId;
    this.currentOwnerId = this.config.data?.currentOwnerId ?? null;
    this.formGroup = this.fb.group({
      riskOwnerId: [this.currentOwnerId, Validators.required],
    });

    this.loadOwners();
  }

  loadOwners(): void {
    this.service.getUsersLookUp().subscribe((res) => {
      this.owners.set(res);
      console.log(this.owners());

      this.loading = false;
      if (!this.currentOwnerId) {
        this.formGroup.patchValue({ riskOwnerId: null });
      }
    });
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.service
        .assignRiskOwner(this.riskId, this.formGroup.value.riskOwnerId)
        .subscribe(() => {
          this.ref.close(this.formGroup.value);
        });
    }
  }

  close(): void {
    this.ref.close();
  }
}
