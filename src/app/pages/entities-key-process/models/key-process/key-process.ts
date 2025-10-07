export interface ProcessManagement {
  id: number;
  type: number;
  entityId: number;
  entityName?: string;
  parentId: number;
  parentName?: string;
  name: string;
  description: string;
  processOwnerId: string;
  processOwnerName?: string;
  processOwnerEmail?: string;
  hasChildren?: boolean;
  children?: string[];
}
