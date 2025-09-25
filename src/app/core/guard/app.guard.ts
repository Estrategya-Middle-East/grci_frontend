import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const appGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  const requiresAuth = route.data['requiresAuth'] === true;

  if (isPlatformBrowser(platformId)) {
    const hasToken = !!authService.getToken();

    if (requiresAuth) {
      return hasToken ? true : router.createUrlTree(['/login']);
    } else {
      return hasToken ? router.createUrlTree(['/']) : true;
    }
  }

  return true;
};
