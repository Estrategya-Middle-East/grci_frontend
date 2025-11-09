export interface ResourcePerformanceInterface {
  id: number;
  resourceManagementId: number;
  workingPaperId: number;
  finalEvaluation: number;
  comments: string;
  ratingDate: string;
  workingPaperTitle: string;
  resourceName: string;
  resourceId: string;
  ratings: ResourceRating[];
  sectionSummaries: Record<string, SectionSummary>;
}

export interface ResourceRating {
  id: number;
  resourcePerformanceRatingId: number;
  competencyFrameworkId: number;
  ratingValue: number;
  comments: string;
  competencyFramework: CompetencyFramework;
}

export interface CompetencyFramework {
  id: number;
  sectionSymbol: string;
  section: string;
  sectionWeight: number;
  competencyCategory: string;
  performanceMeasure: string;
  evaluator: string;
  rating: string;
}

export interface SectionSummary {
  section: string;
  sectionName: string;
  sectionWeight: number;
  averageRating: number;
  weightedScore: number;
  ratingCount: number;
}
