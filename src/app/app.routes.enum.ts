export enum AppRoute {
  LOGIN = "login",
  ORGANIZATIONS = "organizations",
  DIMENSIONS = "dimensions",
  STRATEGIES = "strategies",
  ENTITIES = "entities",
  "RESOURCES-MANAGEMENT" = "resources-management",
}

export const appRoutes = {
  LOGIN: `${AppRoute.LOGIN}`,
  ORGANIZATIONS: `${AppRoute.ORGANIZATIONS}`,
  DIMENSIONS: `${AppRoute.DIMENSIONS}`,
  STRATEGIES: `${AppRoute.STRATEGIES}`,
  ENTITIES: `${AppRoute.ENTITIES}`,
  "RESOURCES-MANAGEMENT": `${AppRoute["RESOURCES-MANAGEMENT"]}`,
};

Object.freeze(appRoutes);
