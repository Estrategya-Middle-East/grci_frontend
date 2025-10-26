import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuditItemService } from '../../../services/auditItem/audit-item-service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-audit-toolbar',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, RouterLink, RouterLinkActive],
  templateUrl: './audit-toolbar.html',
  styleUrl: './audit-toolbar.scss'
})
export class AuditToolbar {
  constructor(public auditService:AuditItemService){}
  searchText = '';
  
 
}
