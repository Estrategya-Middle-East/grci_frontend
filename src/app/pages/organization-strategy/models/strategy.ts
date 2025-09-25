export interface StrategicGoal {
  id: number;
  title: string;
  description: string;
}

export interface Swot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Strategy {
  id: number;
  organizationalUnitId: number;
  organizationName: string;
  risk: string;
  scenarioDescription: string;
  year: number;
  vision: string;
  strategicScenarioId: number;
  assumptions: string;
  strategicFocus: string;
  description: string;
  swot: Swot;
  code: string;
  strategicGoals: { titile: string; description: string }[];
}
