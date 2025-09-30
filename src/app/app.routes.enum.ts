export enum AppRoute {
  LOGIN = "login",
  ORGANIZATIONS = "organizations",
  DIMENSIONS = "dimensions",
  STRATEGIES = "strategies",
  ENTITIES = "entities",
  "RESOURCES-MANAGEMENT" = "resources-management",
  "RESOURCES-UNUTILIZED" = "resources-unutilized",
  "RISK-SCORING-MODEL" = "risk-scoring-model",
}

export const appRoutes = {
  LOGIN: `${AppRoute.LOGIN}`,
  ORGANIZATIONS: `${AppRoute.ORGANIZATIONS}`,
  DIMENSIONS: `${AppRoute.DIMENSIONS}`,
  STRATEGIES: `${AppRoute.STRATEGIES}`,
  ENTITIES: `${AppRoute.ENTITIES}`,
  "RESOURCES-MANAGEMENT": `${AppRoute["RESOURCES-MANAGEMENT"]}`,
  "RESOURCES-UNUTILIZED": `${AppRoute["RESOURCES-UNUTILIZED"]}`,
  "RISK-SCORING-MODEL": `${AppRoute["RISK-SCORING-MODEL"]}`,
};

Object.freeze(appRoutes);
