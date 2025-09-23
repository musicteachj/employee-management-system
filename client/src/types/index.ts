export interface Employee {
  _id?: string;
  _attachments?: string[];
  status: ActiveStatus;

  // Personal Information
  firstName: string;
  lastName: string;
  fullName: string;
  personalEmail: string;
  workEmail: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  dateOfBirth?: string;
  socialSecurityNumber?: string; // For duplicate detection (should be encrypted/hashed)

  // Employment Information
  employeeId: string;
  department: string;
  position: string;
  jobLevel: JobLevel;
  employmentType: EmploymentType;
  workLocation: WorkLocation;
  managerId?: string;
  managerName?: string;
  directReports?: string[]; // Array of employee IDs who report to this person
  organizationLevel?: number; // Hierarchy level (0 = CEO, 1 = C-Level, 2 = VP, etc.)
  costCenter?: string; // For budgeting and organizational purposes
  businessUnit?: string; // Larger organizational grouping

  // Dates
  hireDate: string;
  probationEndDate?: string;
  lastReviewDate?: string;
  terminationDate?: string;

  // Compensation & Benefits
  salary: number;
  currency: number;
  paygrade: string;
  benefitsEligible: BenefitsEligible;

  // Performance & Development
  performanceRating: PerformanceRating;
  trainingStatus: TrainingStatus;
  developmentNotes: string;
  nextReviewDate?: string;
  performanceHistory?: PerformanceReview[];
  performanceMetrics?: PerformanceMetrics;

  // Compliance & Verification
  backgroundCheckStatus: BackgroundCheckStatus;

  // System fields
  docType: "employee";
  source: EmployeeSource;
  sourceId?: string;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
  updatedAt?: string;
  lastProfileUpdate?: string;
  profileUpdateHistory?: ProfileUpdate[];

  // Manager/HR Assignment
  hrAssignment: {
    assignedTo: string;
    assignedDate?: string;
    managerEmail: string;
    managerAssignDate?: string;
    reviewComments?: string;
    revalidationStatus?: "Pending" | "Completed" | "Failed";
  };

  // Onboarding/Event tracking
  onboarding?: {
    author: string;
    authorType: "HR" | "Manager";
    eventDate?: string; // Start date or event date
    eventName?:
      | "Onboarding"
      | "Transfer"
      | "Promotion"
      | "Termination"
      | "Other";
    eventReferenceId?: string;
    onboardingKey?: string;
    owner?: string;
    recordUpdated?: string;
  };
}

export type JobLevel =
  | "Entry"
  | "Mid"
  | "Senior"
  | "Lead"
  | "Manager"
  | "Director"
  | "VP"
  | "C-Level"
  | "CEO";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Intern"
  | "Temporary";

export type WorkLocation = "Office" | "Remote" | "Hybrid";

export type ActiveStatus = "Active" | "Inactive" | "On Leave" | "Terminated";

export type PerformanceRating =
  | "Exceeds Expectations"
  | "Meets Expectations"
  | "Needs Improvement"
  | "Unsatisfactory"
  | "Unrated";

export type TrainingStatus = "Completed" | "In Progress" | "Not Started";

export type BackgroundCheckStatus =
  | "Completed"
  | "In Progress"
  | "Not Started"
  | "Failed";

export type EmployeeSource =
  | "HR"
  | "Onboarding"
  | "External"
  | "Transfer"
  | "Other";

export type BenefitsEligible = "Yes" | "No";

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  department: string;
  jobLevel: JobLevel;
}

export interface PerformanceReview {
  reviewId: string;
  reviewDate: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: Exclude<PerformanceRating, "Unrated">;
  goals?: Goal[];
  achievements?: Achievement[];
  areasForImprovement?: string[];
  comments?: string;
  nextReviewDate?: string;
  skillAssessments?: SkillAssessment[];
  managerFeedback?: string;
  selfAssessment?: string;
  developmentPlan?: DevelopmentItem[];
}

export interface ProfileUpdate {
  updateId: string;
  updateDate: string;
  updatedBy: string;
  updatedFields: string[];
  updateReason?: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface GroupByInfo {
  groupBy: null | GroupByOption;
  groupByOptions: GroupByOption[];
}

// This should match the keys in the Employee interface pick
export type GroupByOption = keyof Pick<
  Employee,
  "managerName" | "department" | "status"
>;

// Performance Review Enhanced Types
export interface PerformanceMetrics {
  averageRating: number;
  ratingTrend: "improving" | "declining" | "stable";
  reviewsCompleted: number;
  overdueDays?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "cancelled";
  targetDate?: string;
  completionDate?: string;
  priority: "low" | "medium" | "high";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: "low" | "medium" | "high";
  category:
    | "technical"
    | "leadership"
    | "collaboration"
    | "innovation"
    | "other";
}

export interface SkillAssessment {
  skillName: string;
  currentLevel: 1 | 2 | 3 | 4 | 5;
  targetLevel: 1 | 2 | 3 | 4 | 5;
  category: "technical" | "soft_skills" | "leadership" | "domain_knowledge";
  assessorNotes?: string;
}

export interface DevelopmentItem {
  id: string;
  title: string;
  description: string;
  type: "training" | "mentoring" | "project" | "certification" | "other";
  status: "planned" | "in_progress" | "completed" | "cancelled";
  startDate?: string;
  targetDate?: string;
  completionDate?: string;
  cost?: number;
}

// Performance Analytics Types
export interface PerformanceAnalytics {
  totalReviews: number;
  overdueReviews: number;
  averageRating: number;
  ratingDistribution: Record<PerformanceRating, number>;
  departmentPerformance: Record<
    string,
    {
      averageRating: number;
      totalReviews: number;
      employeeCount: number;
    }
  >;
  performanceTrends: {
    period: string;
    averageRating: number;
    reviewCount: number;
  }[];
}

export interface ReviewStatus {
  employeeId: string;
  employeeName: string;
  department: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  daysOverdue?: number;
  currentRating: PerformanceRating;
  reviewStatus: "current" | "due_soon" | "overdue" | "never_reviewed";
}

export interface DialogState {
  show: boolean;
  header: string;
  size: "x-small" | "small" | "medium" | "large";
  type: ActionType | null;
  persistent?: boolean;
  maxWidth?: number | string;
}

export interface Action {
  text: string;
  icon: string;
  action: () => void;
  type: ActionType;
  isEnabled?: (selected: Employee[]) => boolean;
  tooltip?: (selected: Employee[]) => string | undefined;
}

export type ActionType =
  | "assign-to-manager"
  | "convert-employee-type"
  | "rehire-employee"
  | "training-status-update"
  | "schedule-performance-review";
