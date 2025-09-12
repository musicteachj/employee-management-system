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

  // Employment Information
  employeeId: string;
  department: string;
  position: string;
  jobLevel: JobLevel;
  workLocation: "Office" | "Remote" | "Hybrid";

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
