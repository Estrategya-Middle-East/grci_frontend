import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const HttpConfigInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  let token = authService.getToken();

  if (token) {
    token = token.replace(/^"|"$/g, '');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';

      if (error.error) {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (
          Array.isArray(error.error.errors) &&
          error.error.errors.length
        ) {
          errorMessage = error.error.errors.join(', ');
        }
      }

      messageService.add({
        severity: 'error',
        summary: `Error ${error.status || ''}`,
        detail: errorMessage,
        life: 5000,
      });

      return throwError(() => error);
    })
  );
};
