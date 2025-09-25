export interface EntityInterface {
  id: number;
  name: string;
  description: string;
  orgChartLevelId: number;
  orgChartLevelName: string;
  parentId: number;
  parentName: string;
  dimensionId: number;
  dimensionTitle: string;
  organizationId: number;
  organizationTitle: string;
  introduction: string;
  objectives: string;
  hasChildren: boolean;
}
