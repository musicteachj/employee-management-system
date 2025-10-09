import { z } from "zod";

// Define the job levels as a Zod enum
const jobLevelSchema = z.enum([
  "Entry",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level",
  "CEO",
] as const);

// Define the employment type schema
const employmentTypeSchema = z.enum([
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
  "Temporary",
] as const);

// Define work location schema
const workLocationSchema = z.enum(["Office", "Remote", "Hybrid"] as const);

// Define active status schema Active" | "Inactive" | "On Leave" | "Terminated
const statusSchema = z.enum([
  "Active",
  "Inactive",
  "On Leave",
  "Terminated",
] as const);

// Define performance rating schema
const performanceRatingSchema = z.enum([
  "Exceeds Expectations",
  "Meets Expectations",
  "Needs Improvement",
  "Unsatisfactory",
  "Unrated",
] as const);

// Define training status schema
const trainingStatusSchema = z.enum([
  "Completed",
  "In Progress",
  "Not Started",
] as const);

// Define background check status schema
const backgroundCheckStatusSchema = z.enum([
  "Completed",
  "In Progress",
  "Not Started",
  "Failed",
] as const);

// Define source schema
const sourceSchema = z.enum([
  "HR",
  "Onboarding",
  "External",
  "Transfer",
  "Other",
] as const);

// Define benefits eligible schema
const benefitsEligibleSchema = z.enum(["Yes", "No"] as const);

// Define business unit schema
const businessUnitSchema = z.enum([
  "Technology",
  "Operations",
  "Revenue",
  "Executive",
] as const);

const costCenterSchema = z.enum([
  "ENG-000",
  "ENG-001",
  "ENG-002",
  "MKT-000",
  "MKT-001",
  "MKT-002",
  "OPS-000",
  "OPS-001",
  "FIN-000",
  "FIN-001",
  "SAL-000",
  "SAL-001",
  "DES-001",
  "PRD-000",
  "PRD-001",
  "EXE-000",
  "HR-000",
] as const);

// HR Assignment schema
const hrAssignmentSchema = z.object({
  assignedTo: z
    .string()
    .min(1, "Assigned To is required")
    .max(25, "Assigned To must be less than 25 characters"),
  managerEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Manager Email must be less than 100 characters")
    .optional(),
  reviewComments: z
    .string()
    .max(500, "Review Comments must be less than 500 characters")
    .optional(),
});

// Main employee validation schema for the add form
export const addEmployeeSchema = z.object({
  // Personal Information - Required fields
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(25, "First Name must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(25, "Last Name must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  personalEmail: z
    .string()
    .email("Please enter a valid personal email address")
    .min(1, "Personal Email is required")
    .max(100, "Personal Email must be less than 100 characters"),

  workEmail: z
    .string()
    .email("Please enter a valid work email address")
    .min(1, "Work Email is required")
    .max(100, "Work Email must be less than 100 characters"),

  phoneNumber: z
    .string()
    .min(1, "Phone Number is required")
    .max(25, "Phone Number must be less than 25 characters")
    .regex(
      /^(\+?1[-\s]?)?\(?([0-9]{3})\)?[-\s]?([0-9]{3})[-\s]?([0-9]{4})$|^(\+?[1-9]\d{1,14})$/,
      "Please enter a valid phone number (e.g., (555) 123-4567 or +1-555-123-4567)"
    ),

  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Address must be less than 100 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(25, "City must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "City can only contain letters, spaces, hyphens, and apostrophes"
    ),

  state: z
    .string()
    .min(1, "State is required")
    .max(25, "State must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "State can only contain letters, spaces, hyphens, and apostrophes"
    ),

  country: z
    .string()
    .min(1, "Country is required")
    .max(25, "Country must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Country can only contain letters, spaces, hyphens, and apostrophes"
    ),

  emergencyContactName: z
    .string()
    .min(1, "Emergency Contact Name is required")
    .max(25, "Emergency Contact Name must be less than 25 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Emergency Contact Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  emergencyContactPhone: z
    .string()
    .min(1, "Emergency Contact Phone is required")
    .max(25, "Emergency Contact Phone must be less than 25 characters")
    .regex(
      /^(\+?1[-\s]?)?\(?([0-9]{3})\)?[-\s]?([0-9]{3})[-\s]?([0-9]{4})$|^(\+?[1-9]\d{1,14})$/,
      "Please enter a valid emergency contact phone number (e.g., (555) 123-4567)"
    ),

  // Personal Information - Optional fields
  dateOfBirth: z.string().optional(),

  socialSecurityNumber: z.string().optional(),

  // Employment Information - Auto-generated fields
  employeeId: z.string().optional(),

  department: z
    .string()
    .min(1, "Department is required")
    .max(25, "Department must be less than 25 characters"),

  position: z
    .string()
    .min(1, "Position is required")
    .max(25, "Position must be less than 25 characters"),

  jobLevel: jobLevelSchema,

  employmentType: employmentTypeSchema,

  workLocation: workLocationSchema,

  hireDate: z
    .string()
    .min(1, "Hire Date is required")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Please enter a valid hire date (YYYY-MM-DD)"
    ),

  // Employment Information - Optional fields
  managerId: z.string().nullable().optional(),

  managerName: z.string().nullable().optional(),

  directReports: z.array(z.string()).optional(),

  costCenter: costCenterSchema.optional(),

  businessUnit: businessUnitSchema.optional(),

  probationEndDate: z.string().optional(),

  // Compensation & Benefits - Required fields
  salary: z
    .number()
    .min(0, "Salary must be a positive number")
    .max(10000000, "Salary must be less than 10,000,000"),

  paygrade: z
    .string()
    .min(1, "Pay Grade is required")
    .max(25, "Pay Grade must be less than 25 characters"),

  benefitsEligible: benefitsEligibleSchema,

  // Performance & Development - Required fields
  performanceRating: performanceRatingSchema,

  trainingStatus: trainingStatusSchema,

  developmentNotes: z
    .string()
    .min(1, "Development Notes are required")
    .max(500, "Development Notes must be less than 500 characters"),

  // Performance & Development - Optional fields
  nextReviewDate: z.string().optional(),

  // Compliance & System Information - Required fields
  status: statusSchema,

  backgroundCheckStatus: backgroundCheckStatusSchema,

  source: sourceSchema,

  // Compliance & System Information - Optional fields
  sourceId: z.string().optional(),

  createdBy: z.string().optional(),

  // HR Assignment - Required nested object
  hrAssignment: hrAssignmentSchema,

  // System fields (these will be set automatically)
  currency: z.number(),
  docType: z.string(),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

// Export individual schemas for reuse
export {
  jobLevelSchema,
  employmentTypeSchema,
  workLocationSchema,
  statusSchema,
  performanceRatingSchema,
  trainingStatusSchema,
  backgroundCheckStatusSchema,
  sourceSchema,
  benefitsEligibleSchema,
  businessUnitSchema,
  hrAssignmentSchema,
  costCenterSchema,
};
