// -------- Week Ends --------
export interface WeekEnd {
  id: number;
  code: number;
  day: string; // e.g., "Sunday"
}

// -------- Leave Days --------
export interface LeaveDay {
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
export interface PublicHoliday {
  id: number;
  code: number;
  title: string;
  date: string; // ISO string "2024-04-10T00:00:00"
  year: number;
  isArchived: boolean;
}
