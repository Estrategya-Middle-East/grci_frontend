import { Component, inject, OnInit } from '@angular/core';

import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { LoadingPageComponent } from '../../../shared/components/loading-page/loading-page.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    // LoadingPageComponent,
    FormsModule,
    InputTextModule,
    CheckboxModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  FormGroup!: FormGroup;
  togglePassword = true;
  isLoading = false;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private route = inject(Router);
  ngOnInit(): void {
    this.FormGroup = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      rememberMe: false,
    });
  }
  switchTogglePassword() {
    this.togglePassword = !this.togglePassword;
  }
  submit() {
    if (this.FormGroup.valid && !this.isLoading) {
      this.isLoading = true;
      const formatObject = {
        email: this.FormGroup.get('email')?.value.trim(),
        password: this.FormGroup.get('password')?.value.trim(),
        ...this.FormGroup?.value,
      };

      this.authService.login(formatObject).subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          if (this.authService.getToken()) {
            this.route.navigate(['/organizations']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message,
            key: 'bc',
            life: 3000,
          });
        },
      });
    } else {
      this.FormGroup.get('email')?.markAsDirty();
      this.FormGroup.get('password')?.markAsDirty();
    }
  }
  getControl(FormControl: string) {
    return this.FormGroup.get(FormControl);
  }
}
