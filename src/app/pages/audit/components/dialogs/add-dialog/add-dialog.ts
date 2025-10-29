import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AuditItemService } from '../../../services/auditItem/audit-item-service';
import { StorageLocationItem } from '../../../models/interfaces/location-storage';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,   // ✅ Added
    ButtonModule,        // ✅ Added
    InputTextModule,     // ✅ Added if needed
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    ToastModule],
  templateUrl: './add-dialog.html',
  styleUrl: './add-dialog.scss'
})
export class AddDialog implements OnInit {
  private dialogRef = inject(DynamicDialogRef);
  categoryForm: FormGroup;
  storageLocationProp:StorageLocationItem[] = []
  constructor(private fb: FormBuilder,private auditService:AuditItemService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      storageLocationId:['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getStorageLocation()
  }

  onSave() {
    if (this.categoryForm.valid) {
      
      this.dialogRef.close(this.categoryForm)
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close()    
  }
  getStorageLocation(){
    this.auditService.getStorageLocations().subscribe({
      next:(res)=>{
        this.storageLocationProp  = res
      }
    })
  }
}
