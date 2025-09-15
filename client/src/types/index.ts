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

  // Dates
  hireDate: string;
  probationEndDate?: string;
  lastReviewDate?: string;
  terminationDate?: string;

  // Compensation & Benefits
  salary: number;
  currency: number;
  paygrade: string;
  benefitsEligibile: BenefitsEligible;

  // Performance & Development
  performanceRating: PerformanceRating;
  trainingStatus: TrainingStatus;
  developmentNotes: string;
  nextReviewDate?: string;
  performanceHistory?: PerformanceReview[];

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
  goals?: string[];
  achievements?: string[];
  areasForImprovement?: string[];
  comments?: string;
  nextReviewDate?: string;
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
