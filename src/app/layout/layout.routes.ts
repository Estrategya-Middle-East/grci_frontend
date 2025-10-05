import { Routes } from "@angular/router";
import { AppRoute, appRoutes } from "../app.routes.enum";

export const layoutRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: appRoutes.ORGANIZATIONS,
  },
  {
    path: appRoutes.ORGANIZATIONS,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/organizations/components/view/view.component").then(
            (m) => m.ViewComponent
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/organizations/components/add-edit/add-edit.component"
          ).then((m) => m.AddEditComponent),
      },
      {
        path: ":id",
        loadComponent: () =>
          import(
            "../pages/organizations/components/organization-details/organization-details"
          ).then((m) => m.OrganizationDetails),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "../pages/organizations/components/add-edit/add-edit.component"
          ).then((m) => m.AddEditComponent),
      },
      {
        path: `:id/${AppRoute.STRATEGIES}`,
        children: [
          {
            path: "",
            loadComponent: () =>
              import(
                "../pages/organization-strategy/organization-strategy"
              ).then((m) => m.OrganizationStrategy),
          },
          {
            path: "add",
            loadComponent: () =>
              import(
                "../pages/organization-strategy/components/add-edit/add-edit"
              ).then((m) => m.AddEdit),
          },
          {
            path: ":strategyId",
            loadComponent: () =>
              import(
                "../pages/organization-strategy/components/strategy-details/strategy-details"
              ).then((m) => m.StrategyDetails),
          },
          {
            path: "edit/:strategyId",
            loadComponent: () =>
              import(
                "../pages/organization-strategy/components/add-edit/add-edit"
              ).then((m) => m.AddEdit),
          },
        ],
      },
    ],
  },
  {
    path: appRoutes.DIMENSIONS,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/dimensions/dimensions").then((m) => m.Dimensions),
      },
      {
        path: "add",
        loadComponent: () =>
          import("../pages/dimensions/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
      {
        path: ":id",
        loadComponent: () =>
          import(
            "../pages/dimensions/components/dimensions-details/dimensions-details"
          ).then((m) => m.DimensionsDetails),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import("../pages/dimensions/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
    ],
  },
  {
    path: appRoutes.ENTITIES,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/entities/entities").then((m) => m.Entities),
      },
      {
        path: "add",
        loadComponent: () =>
          import("../pages/entities/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
      {
        path: ":entityId",
        loadComponent: () =>
          import(
            "../pages/entities/components/entity-details/entity-details"
          ).then((m) => m.EntityDetails),
      },
      {
        path: "edit/:entityId",
        loadComponent: () =>
          import("../pages/entities/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
    ],
  },
  {
    path: appRoutes["RESOURCES-MANAGEMENT"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/resources-management/resources-management").then(
            (m) => m.ResourcesManagement
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/resources-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
      {
        path: ":resourceId",
        loadComponent: () =>
          import(
            "../pages/resources-management/components/resource-details/resource-details"
          ).then((m) => m.ResourceDetails),
      },
      {
        path: "edit/:resourceId",
        loadComponent: () =>
          import(
            "../pages/resources-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
    ],
  },
  {
    path: appRoutes["RESOURCES-UNUTILIZED"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "../pages/resources-unutilized-time/resources-unutilized-time"
          ).then((m) => m.ResourcesUnutilizedTime),
      },
    ],
  },
  {
    path: appRoutes["RISK-SCORING-MODEL"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/risk-scoring-model/risk-scoring-model").then(
            (m) => m.RiskScoringModel
          ),
      },
    ],
  },
  {
    path: appRoutes.MITIGATION,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/mitigation/mitigation").then((m) => m.Mitigation),
      },
    ],
  },
];
