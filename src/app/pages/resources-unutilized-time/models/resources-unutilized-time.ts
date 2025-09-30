// -------- Week Ends --------
export interface WeekEndInterface {
  id: number;
  code: number;
  day: string; // e.g., "Sunday"
}

// -------- Leave Days --------
export interface LeaveDayInterface {
  id: number;
  code: number;
  year: number;
  annualLeaves: number;
  sickLeaves: number;
  training: number;
  managerialTasks: number;
  otherActivities: number;
  totalLeaveDays: number;
  isArchived: boolean;
}

// -------- Public Holidays --------
export interface PublicHolidayInterface {
  id: number;
  code: number;
  title: string;
  date: string; // ISO string "2024-04-10T00:00:00"
  year: number;
  isArchived: boolean;
}
