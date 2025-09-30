// -------- Week Ends --------
export interface WeekEndInterface {
  id: number;
  code: number;
  day: string;
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
  date: string;
  year: number;
  isArchived: boolean;
}
