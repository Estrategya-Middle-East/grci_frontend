export interface RiskRootCauseChild {
  id: number;
  rootCause: string;
  canBeUpdated: boolean;
  canBeDeleted: boolean;
}

export interface RiskRootCauseInterface {
  id: number;
  rootCause: string;
  parent: number | null;
  parentRootCause: string | null;
  isMainCategory: boolean;
  children: RiskRootCauseChild[];
  canBeUpdated: boolean;
  canBeDeleted: boolean;
}

export interface RiskRootCausePayloadInterface {
  rootCause: string;
  parent: number;
}
