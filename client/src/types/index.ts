export interface Employee {
  _id?: string;
  _attachments?: string[];
  active: "Active" | "On Leave" | "Terminated";

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
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Intern"
    | "Temporary";
  workLocation: "Office" | "Remote" | "Hybrid";
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
  benefitsEligibile: "Yes" | "No";

  // Performance & Development
  performanceRating:
    | "Exceeds Expectations"
    | "Meets Expectations"
    | "Needs Improvement"
    | "Unsatisfactory"
    | "Unrated";
  trainingStatus: "Completed" | "In Progress" | "Not Started";
  developmentNotes: string;
  nextReviewDate?: string;
  performanceHistory?: PerformanceReview[];

  // Compliance & Verification
  backgroundCheckStatus: "Completed" | "In Progress" | "Not Started" | "Failed";

  // System fields
  docType: "employee";
  source: "HR" | "Onboarding" | "External" | "Transfer" | "Other";
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

export interface PerformanceReview {
  reviewId: string;
  reviewDate: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  reviewerName: string;
  reviewerEmail: string;
  rating:
    | "Exceeds Expectations"
    | "Meets Expectations"
    | "Needs Improvement"
    | "Unsatisfactory";
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
