import { Component, DestroyRef, inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { EVManagmentService } from "../../services/EVManagementLevel/evmanagment-service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EditEvidenceDialog } from "../dialogs/edit-evidence-dialog/edit-evidence-dialog";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-evlevel-filter",
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule],
  templateUrl: "./evlevel-filter.html",
  styleUrl: "./evlevel-filter.scss",
})
export class EVLevelFilter {
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private searchSubject = new Subject<string>();
  evForm!: FormGroup;
  constructor(
    public evService: EVManagmentService,
    private destroyRef: DestroyRef,
    private fb: FormBuilder
  ) {
    this.evForm = this.fb.group({
      describtion: ["", Validators.required],
      name: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.evService.getTableData({
            ...this.evService.pagination(),
            FilterValue: searchValue ?? "",
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onApply() {
    this.evService
      .createEvManagment({
        name: this.evForm.get("name")?.value,
        description: this.evForm.get("describtion")?.value,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.evService.getTableData({}).subscribe();
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
}
