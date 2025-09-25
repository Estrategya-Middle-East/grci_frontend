import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpConfigInterceptor } from './core/interceptors/HttpConfigInterceptor';
import { MessageService } from 'primeng/api';
import { loaderInterceptor } from './shared/components/loader/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideHttpClient(
      withInterceptors([HttpConfigInterceptor, loaderInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
  ],
};
