import { Routes } from "@angular/router";
import { appRoutes } from "./app.routes.enum";
import { appGuard } from "./core/guard/app.guard";
import { LayoutComponent } from "./layout/layout.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./layout/layout.routes").then((m) => m.layoutRoutes),
    canActivate: [appGuard],
    data: { requiresAuth: true },
  },
  {
    path: appRoutes.LOGIN,
    loadComponent: () =>
      import("./core/auth/login/login.component").then((m) => m.LoginComponent),
    canActivate: [appGuard],
    data: { requiresAuth: false },
    pathMatch: "full",
  },
  { path: "**", redirectTo: appRoutes.ORGANIZATIONS, pathMatch: "full" },
];
