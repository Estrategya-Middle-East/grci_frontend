import { lookup } from "../../../shared/models/lookup.mdoel";

export interface Control {
  id: number;
  name: string;
  description: string;
  controlObjective: string;
  validityFrom: string;
  validityTo: string;
  controlCategoryId: number;
  controlCategoryName?: string;
  controlSignificanceId: number;
  controlSignificanceName?: string;
  controlAutomationId: number;
  controlAutomationName?: string;
  controlNatureId: number;
  controlNatureName?: string;
  status: number;
  risks: lookup[];
}

export interface ControlPayload {
  name: string;
  description: string;
  controlObjective: string;
  validityFrom: string | Date;
  validityTo: string | Date;
  controlCategoryId: number;
  controlSignificanceId: number;
  controlAutomationId: number;
  controlNatureId: number;
  status: number;
  riskIds: number[];
}
