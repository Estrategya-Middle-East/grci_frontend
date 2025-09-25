export interface ResourceInterface {
  id: number;
  code: string;
  resourceName: string;
  resourceFunctionId: number;
  resourceFunctionName: string;
  workingHoursFrom: string;
  workingHoursTo: string;
  skills: { resourceSkillId: number; name: string }[];
  performanceRating: number | null;
  userId: string;
  userFullName: string;
  userEmail: string;
  experiences: ExperienceInterface[];
}

export interface ExperienceInterface {
  id: number;
  experienceName: string;
  numberOfYears: number;
}
