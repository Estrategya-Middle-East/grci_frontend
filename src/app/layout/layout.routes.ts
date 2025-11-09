import { Routes } from "@angular/router";
import { appRoutes } from "../app.routes.enum";

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
        path: `:id/${appRoutes.STRATEGIES}`,
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
      {
        path: `:entityId/${appRoutes["KEY-PROCESS"]}`,
        children: [
          {
            path: "",
            loadComponent: () =>
              import("../pages/entities-key-process/entities-key-process").then(
                (m) => m.EntitiesKeyProcess
              ),
          },
          {
            path: "add",
            loadComponent: () =>
              import(
                "../pages/entities-key-process/components/add-edit/add-edit"
              ).then((m) => m.AddEdit),
          },
          {
            path: ":processId",
            loadComponent: () =>
              import(
                "../pages/entities-key-process/components/key-process-details/key-process-details"
              ).then((m) => m.KeyProcessDetails),
          },
          {
            path: "edit/:processId",
            loadComponent: () =>
              import(
                "../pages/entities-key-process/components/add-edit/add-edit"
              ).then((m) => m.AddEdit),
          },
        ],
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
  {
    path: appRoutes["CONTROL-PARAMETERS"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/control/control").then((m) => m.Control),
      },
    ],
  },
  {
    path: appRoutes["MITIGATION-MANAGEMENT"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/mitigation-management/mitigation-management").then(
            (m) => m.MitigationManagement
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/mitigation-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
      {
        path: ":id",
        loadComponent: () =>
          import(
            "../pages/mitigation-management/components/mititgation-management-details/mititgation-management-details"
          ).then((m) => m.MititgationManagementDetails),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "../pages/mitigation-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
    ],
  },
  {
    path: appRoutes["RISK-MANAGEMENT"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/risk-management/risk-management").then(
            (m) => m.RiskManagement
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import("../pages/risk-management/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
      {
        path: ":id",
        loadComponent: () =>
          import(
            "../pages/risk-management/components/risk-management-details/risk-management-details"
          ).then((m) => m.RiskManagementDetails),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import("../pages/risk-management/components/add-edit/add-edit").then(
            (m) => m.AddEdit
          ),
      },
      {
        path: `:id/${appRoutes["RISK-ASSESSMENTS"]}`,
        loadComponent: () =>
          import(
            "../pages/risk-management/components/risk-assessments-list/risk-assessments-list"
          ).then((m) => m.RiskAssessmentsList),
      },
      {
        path: `:id/${appRoutes["RISK-FEEDBACK"]}`,
        loadComponent: () =>
          import(
            "../pages/risk-management/components/risk-feedback-list/risk-feedback-list"
          ).then((m) => m.RiskFeedbackList),
      },
    ],
  },
  {
    path: appRoutes["CONTROL-MANAGEMENT"],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/control-management/control-management").then(
            (m) => m.ControlManagement
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/control-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
      {
        path: ":id",
        loadComponent: () =>
          import(
            "../pages/control-management/components/control-management-details/control-management-details"
          ).then((m) => m.ControlManagementDetails),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "../pages/control-management/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
    ],
  },
  {
    path: appRoutes.HEATMAP,
    loadComponent: () =>
      import("../pages/basic-heatmap/basic-heatmap").then(
        (m) => m.BasicHeatmap
      ),
  },
  {
    path: appRoutes["RESOURCES-SKILLS"],
    loadComponent: () =>
      import("../pages/resources-skills/resources-skills").then(
        (m) => m.ResourcesSkills
      ),
  },
  {
    path: appRoutes["RESOURCES-FUNCTIONS"],
    loadComponent: () =>
      import("../pages/resources-functions/resources-functions").then(
        (m) => m.ResourcesFunctions
      ),
  },
  {
    path: appRoutes["RISK-ROOT-CAUSES"],
    loadComponent: () =>
      import("../pages/risk-root-causes/risk-root-causes").then(
        (m) => m.RiskRootCauses
      ),
  },
  {
    path: appRoutes["RISK-HEATMAP"],
    loadComponent: () =>
      import("../pages/risk-heatmap/risk-heatmap").then((m) => m.RiskHeatmap),
  },
  {
    path: appRoutes.Audit,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/audit/pages/audit-item/audit-item").then(
            (m) => m.AuditItem
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import("../pages/audit/pages/crud-audit-item/crud-audit-item").then(
            (m) => m.CrudAuditItem
          ),
      },
      {
        path: "edit",
        loadComponent: () =>
          import("../pages/audit/pages/crud-audit-item/crud-audit-item").then(
            (m) => m.CrudAuditItem
          ),
      },
      {
        path: "frequancy",
        loadComponent: () =>
          import("../pages/audit/pages/audit-frequency/audit-frequency").then(
            (m) => m.AuditFrequency
          ),
      },
      {
        path: "category",
        loadComponent: () =>
          import("../pages/audit/pages/audit-category/audit-category").then(
            (m) => m.AuditCategory
          ),
      },
      {
        path: "schedule",
        loadComponent: () =>
          import("../pages/audit/pages//audit-schedule/audit-schedule").then(
            (m) => m.AuditSchedule
          ),
      },
    ],
  },
  {
    path: `${appRoutes["RESOURCES-PERFORMANCE-RATING"]}`,
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "../pages/resources-performance-rating/resources-performance-rating"
          ).then((m) => m.ResourcesPerformanceRating),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/resources-performance-rating/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "../pages/resources-performance-rating/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
    ],
  },
  {
    path: `${appRoutes["CONTROL-DESIGN-RATING"]}`,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/control-design-rating/control-design-rating").then(
            (m) => m.ControlDesignRating
          ),
      },
      {
        path: "add",
        loadComponent: () =>
          import(
            "../pages/control-design-rating/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "../pages/control-design-rating/components/add-edit/add-edit"
          ).then((m) => m.AddEdit),
      },
    ],
  },
];
