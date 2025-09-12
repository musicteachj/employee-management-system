import { defineStore } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import type {
  Employee,
  JobLevel,
  EmploymentType,
  WorkLocation,
  ActiveStatus,
  PerformanceRating,
  TrainingStatus,
  BackgroundCheckStatus,
  EmployeeSource,
  BenefitsEligible,
  Department,
  Manager,
} from "../types";

export const useAppStore = defineStore("app", () => {
  const employees = ref<Employee[]>([
    {
      _id: "emp_001",
      active: "Active",

      // Personal Information
      firstName: "Sarah",
      lastName: "Johnson",
      fullName: "Sarah Johnson",
      personalEmail: "sarah.johnson@gmail.com",
      workEmail: "sarah.johnson@company.com",
      phoneNumber: "+1-555-0123",
      emergencyContactName: "Michael Johnson",
      emergencyContactPhone: "+1-555-0124",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      dateOfBirth: "1990-03-15",

      // Employment Information
      employeeId: "EMP001",
      department: "Engineering",
      position: "Senior Software Engineer",
      jobLevel: "Senior",
      employmentType: "Full-time",
      workLocation: "Hybrid",
      managerId: "",
      managerName: "David Chen",

      // Dates
      hireDate: "2024-08-15", // Recent hire (within 30 days)
      lastReviewDate: "2024-06-15",

      // Compensation & Benefits
      salary: 125000,
      currency: 1, // USD
      paygrade: "L5",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes: "Strong technical skills, excellent team collaboration",
      nextReviewDate: "2024-12-15",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2022-01-10",
      updatedBy: "hr_admin",
      updatedOn: "2024-06-15",
      updatedAt: "2024-06-15T10:30:00Z",
      lastProfileUpdate: "2024-06-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2022-01-10",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2022-01-15",
        reviewComments:
          "Excellent performance, ready for promotion consideration",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2022-01-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_001",
      },
    },
    {
      _id: "emp_002",
      active: "Active",

      // Personal Information
      firstName: "Marcus",
      lastName: "Rodriguez",
      fullName: "Marcus Rodriguez",
      personalEmail: "marcus.rodriguez@outlook.com",
      workEmail: "marcus.rodriguez@company.com",
      phoneNumber: "+1-555-0456",
      emergencyContactName: "Elena Rodriguez",
      emergencyContactPhone: "+1-555-0457",
      address: "456 Oak Avenue",
      city: "Austin",
      state: "TX",
      country: "USA",
      dateOfBirth: "1988-07-22",

      // Employment Information
      employeeId: "EMP002",
      department: "Marketing",
      position: "Marketing Manager",
      jobLevel: "Manager",
      employmentType: "Full-time",
      workLocation: "Remote",
      managerId: "emp_003",
      managerName: "David Chen",

      // Dates
      hireDate: "2024-07-01", // Recent hire (within 90 days but not 30)
      lastReviewDate: "2024-03-01",

      // Compensation & Benefits
      salary: 95000,
      currency: 1, // USD
      paygrade: "M2",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "In Progress",
      developmentNotes:
        "Good leadership skills, working on digital marketing certification",
      nextReviewDate: "2024-09-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2021-08-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-03-01",
      updatedAt: "2024-03-01T14:20:00Z",
      lastProfileUpdate: "2024-03-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2021-08-25",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2021-09-01",
        reviewComments: "Solid performer, good team management",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2021-09-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_002",
      },
    },
    {
      _id: "emp_003",
      active: "Active",

      // Personal Information
      firstName: "David",
      lastName: "Chen",
      fullName: "David Chen",
      personalEmail: "david.chen@gmail.com",
      workEmail: "david.chen@company.com",
      phoneNumber: "+1-555-0789",
      emergencyContactName: "Lisa Chen",
      emergencyContactPhone: "+1-555-0790",
      address: "789 Pine Street",
      city: "Seattle",
      state: "WA",
      country: "USA",
      dateOfBirth: "1985-11-08",

      // Employment Information
      employeeId: "EMP003",
      department: "Engineering",
      position: "Engineering Director",
      jobLevel: "Director",
      employmentType: "Full-time",
      workLocation: "Office",

      // Dates
      hireDate: "2019-03-01",
      lastReviewDate: "2024-01-15",

      // Compensation & Benefits
      salary: 180000,
      currency: 1, // USD
      paygrade: "D1",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes: "Excellent leadership, driving technical strategy",
      nextReviewDate: "2024-07-15",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2019-02-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-01-15",
      updatedAt: "2024-01-15T09:15:00Z",
      lastProfileUpdate: "2024-01-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2019-02-25",
        managerEmail: "ceo@company.com",
        managerAssignDate: "2019-03-01",
        reviewComments: "Outstanding leadership and technical vision",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2019-03-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_003",
      },
    },
  ]);

  // Departments - Centralized department data
  const departments = ref<Department[]>([
    {
      id: "dept_001",
      name: "Engineering",
      description: "Software development and technical operations",
    },
    {
      id: "dept_002",
      name: "Marketing",
      description: "Brand management and customer acquisition",
    },
    {
      id: "dept_003",
      name: "Sales",
      description: "Revenue generation and client relationships",
    },
    {
      id: "dept_004",
      name: "Human Resources",
      description: "Employee management and organizational development",
    },
    {
      id: "dept_005",
      name: "Finance",
      description: "Financial planning and accounting operations",
    },
    {
      id: "dept_006",
      name: "Operations",
      description: "Business operations and process management",
    },
    {
      id: "dept_007",
      name: "Product",
      description: "Product strategy and development",
    },
    {
      id: "dept_008",
      name: "Design",
      description: "User experience and visual design",
    },
  ]);

  // Managers - Centralized manager data
  const managers = ref<Manager[]>([
    {
      id: "mgr_001",
      name: "David Chen",
      email: "david.chen@company.com",
      department: "Engineering",
      jobLevel: "Director",
    },
    {
      id: "mgr_002",
      name: "Sarah Martinez",
      email: "sarah.martinez@company.com",
      department: "Marketing",
      jobLevel: "Manager",
    },
    {
      id: "mgr_003",
      name: "Michael Thompson",
      email: "michael.thompson@company.com",
      department: "Sales",
      jobLevel: "Manager",
    },
    {
      id: "mgr_004",
      name: "Jennifer Liu",
      email: "jennifer.liu@company.com",
      department: "Human Resources",
      jobLevel: "Director",
    },
    {
      id: "mgr_005",
      name: "Robert Kim",
      email: "robert.kim@company.com",
      department: "Finance",
      jobLevel: "Manager",
    },
    {
      id: "mgr_006",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Operations",
      jobLevel: "Manager",
    },
    {
      id: "mgr_007",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@company.com",
      department: "Product",
      jobLevel: "Director",
    },
    {
      id: "mgr_008",
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      department: "Design",
      jobLevel: "Senior",
    },
  ]);

  // Form Options - Centralized for consistency across the app
  const formOptions = {
    jobLevels: [
      "Entry",
      "Mid",
      "Senior",
      "Lead",
      "Manager",
      "Director",
      "VP",
      "C-Level",
      "CEO",
    ] as JobLevel[],

    employmentTypes: [
      "Full-time",
      "Part-time",
      "Contract",
      "Intern",
      "Temporary",
    ] as EmploymentType[],

    workLocations: ["Office", "Remote", "Hybrid"] as WorkLocation[],

    activeStatuses: ["Active", "On Leave", "Terminated"] as ActiveStatus[],

    performanceRatings: [
      "Exceeds Expectations",
      "Meets Expectations",
      "Needs Improvement",
      "Unsatisfactory",
      "Unrated",
    ] as PerformanceRating[],

    trainingStatuses: [
      "Completed",
      "In Progress",
      "Not Started",
    ] as TrainingStatus[],

    backgroundCheckStatuses: [
      "Completed",
      "In Progress",
      "Not Started",
      "Failed",
    ] as BackgroundCheckStatus[],

    sources: [
      "HR",
      "Onboarding",
      "External",
      "Transfer",
      "Other",
    ] as EmployeeSource[],

    benefitsEligibleOptions: ["Yes", "No"] as BenefitsEligible[],
  };

  const getUnassignedHires = async () => {
    return employees.value.filter((employee) => !employee.managerId);
  };

  const getRecentHires = async () => {
    return employees.value.filter((employee) => {
      const hireDate = dayjs(employee.hireDate);
      const thirtyDaysAgo = dayjs().subtract(30, "day");
      return (
        hireDate.isAfter(thirtyDaysAgo) || hireDate.isSame(thirtyDaysAgo, "day")
      );
    });
  };

  const addEmployee = (employee: Employee) => {
    employees.value.push(employee);
  };

  return {
    employees,
    departments,
    managers,
    formOptions,
    getUnassignedHires,
    getRecentHires,
    addEmployee,
  };
});
