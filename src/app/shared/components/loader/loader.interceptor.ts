import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, finalize } from "rxjs/operators";
import { LoaderService } from "./loader.service";
import { throwError } from "rxjs";

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loader = inject(LoaderService);
  loader.show();

  return next(req).pipe(
    finalize(() => {
      loader.hide();
    }),
    catchError((error) => {
      loader.hide();
      return throwError(() => error);
    })
  );
};
