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
  children?: ProcessManagement[];
}

export enum ProcessType {
  ProcessGroup = 0,
  Process = 1,
  Activity = 2,
  Task = 3,
}
