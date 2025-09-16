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
  PerformanceAnalytics,
  ReviewStatus,
} from "../types";

export const useAppStore = defineStore("app", () => {
  const employees = ref<Employee[]>([
    {
      _id: "emp_001",
      status: "Active",

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
      performanceHistory: [
        {
          reviewId: "rev_001_2024",
          reviewDate: "2024-06-15",
          reviewPeriodStart: "2023-12-15",
          reviewPeriodEnd: "2024-06-15",
          reviewerName: "David Chen",
          reviewerEmail: "david.chen@company.com",
          rating: "Exceeds Expectations",
          goals: [
            {
              id: "goal_001",
              title: "Lead microservices migration",
              description:
                "Migrate legacy monolith to microservices architecture",
              status: "completed",
              targetDate: "2024-05-01",
              completionDate: "2024-04-28",
              priority: "high",
            },
          ],
          achievements: [
            {
              id: "ach_001",
              title: "Reduced system latency by 40%",
              description: "Optimized database queries and implemented caching",
              date: "2024-03-15",
              impact: "high",
              category: "technical",
            },
          ],
          areasForImprovement: ["Public speaking", "Cross-team collaboration"],
          comments: "Exceptional technical performance, ready for senior role",
          nextReviewDate: "2024-12-15",
          managerFeedback:
            "Outstanding contributor, consistently delivers high-quality work",
          selfAssessment:
            "Proud of technical achievements, want to improve leadership skills",
        },
        {
          reviewId: "rev_001_2023",
          reviewDate: "2023-12-15",
          reviewPeriodStart: "2023-06-15",
          reviewPeriodEnd: "2023-12-15",
          reviewerName: "David Chen",
          reviewerEmail: "david.chen@company.com",
          rating: "Meets Expectations",
          comments: "Solid performance, good technical skills",
          nextReviewDate: "2024-06-15",
        },
      ],
      performanceMetrics: {
        averageRating: 4.5,
        ratingTrend: "improving",
        reviewsCompleted: 2,
        overdueDays: 0,
      },

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
      status: "Active",

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
      performanceHistory: [
        {
          reviewId: "rev_002_2024",
          reviewDate: "2024-03-01",
          reviewPeriodStart: "2023-09-01",
          reviewPeriodEnd: "2024-03-01",
          reviewerName: "David Chen",
          reviewerEmail: "david.chen@company.com",
          rating: "Meets Expectations",
          comments: "Good team management, needs to improve strategic thinking",
          nextReviewDate: "2024-09-01",
        },
      ],
      performanceMetrics: {
        averageRating: 3.0,
        ratingTrend: "stable",
        reviewsCompleted: 1,
        overdueDays: 15,
      },

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
      status: "Active",

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
      performanceHistory: [
        {
          reviewId: "rev_003_2024",
          reviewDate: "2024-01-15",
          reviewPeriodStart: "2023-07-15",
          reviewPeriodEnd: "2024-01-15",
          reviewerName: "CEO",
          reviewerEmail: "ceo@company.com",
          rating: "Exceeds Expectations",
          comments: "Outstanding leadership and technical vision",
          nextReviewDate: "2024-07-15",
        },
      ],
      performanceMetrics: {
        averageRating: 5.0,
        ratingTrend: "stable",
        reviewsCompleted: 1,
        overdueDays: 62,
      },

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
    {
      _id: "emp_004",
      status: "Active",

      // Personal Information
      firstName: "Jennifer",
      lastName: "Liu",
      fullName: "Jennifer Liu",
      personalEmail: "jennifer.liu@yahoo.com",
      workEmail: "jennifer.liu@company.com",
      phoneNumber: "+1-555-0321",
      emergencyContactName: "James Liu",
      emergencyContactPhone: "+1-555-0322",
      address: "321 Cedar Lane",
      city: "Denver",
      state: "CO",
      country: "USA",
      dateOfBirth: "1987-12-03",

      // Employment Information
      employeeId: "EMP004",
      department: "Human Resources",
      position: "HR Director",
      jobLevel: "Director",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "",
      managerName: "CEO",

      // Dates
      hireDate: "2020-05-15",
      lastReviewDate: "2024-02-01",

      // Compensation & Benefits
      salary: 165000,
      currency: 1, // USD
      paygrade: "D2",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes: "Strong HR leadership, excellent employee relations",
      nextReviewDate: "2024-08-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2020-05-10",
      updatedBy: "hr_admin",
      updatedOn: "2024-02-01",
      updatedAt: "2024-02-01T11:45:00Z",
      lastProfileUpdate: "2024-02-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2020-05-10",
        managerEmail: "ceo@company.com",
        managerAssignDate: "2020-05-15",
        reviewComments: "Exceptional HR leadership and strategic thinking",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2020-05-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_004",
      },
    },
    {
      _id: "emp_005",
      status: "On Leave",

      // Personal Information
      firstName: "Michael",
      lastName: "Thompson",
      fullName: "Michael Thompson",
      personalEmail: "michael.thompson@hotmail.com",
      workEmail: "michael.thompson@company.com",
      phoneNumber: "+1-555-0654",
      emergencyContactName: "Sarah Thompson",
      emergencyContactPhone: "+1-555-0655",
      address: "654 Maple Drive",
      city: "Chicago",
      state: "IL",
      country: "USA",
      dateOfBirth: "1992-04-18",

      // Employment Information
      employeeId: "EMP005",
      department: "Sales",
      position: "Sales Manager",
      jobLevel: "Manager",
      employmentType: "Full-time",
      workLocation: "Hybrid",
      managerId: "emp_003",
      managerName: "David Chen",

      // Dates
      hireDate: "2023-01-20",
      lastReviewDate: "2024-01-20",

      // Compensation & Benefits
      salary: 105000,
      currency: 1, // USD
      paygrade: "M3",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "In Progress",
      developmentNotes: "Good sales performance, currently on paternity leave",
      nextReviewDate: "2024-07-20",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2023-01-15",
      updatedBy: "hr_admin",
      updatedOn: "2024-01-20",
      updatedAt: "2024-01-20T16:30:00Z",
      lastProfileUpdate: "2024-01-20",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2023-01-15",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2023-01-20",
        reviewComments: "Solid sales performance, good team player",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2023-01-20",
        eventName: "Onboarding",
        onboardingKey: "ONB_005",
      },
    },
    {
      _id: "emp_006",
      status: "Active",

      // Personal Information
      firstName: "Emily",
      lastName: "Davis",
      fullName: "Emily Davis",
      personalEmail: "emily.davis@gmail.com",
      workEmail: "emily.davis@company.com",
      phoneNumber: "+1-555-0987",
      emergencyContactName: "Robert Davis",
      emergencyContactPhone: "+1-555-0988",
      address: "987 Birch Street",
      city: "Portland",
      state: "OR",
      country: "USA",
      dateOfBirth: "1991-09-12",

      // Employment Information
      employeeId: "EMP006",
      department: "Operations",
      position: "Operations Manager",
      jobLevel: "Manager",
      employmentType: "Full-time",
      workLocation: "Remote",
      managerId: "emp_004",
      managerName: "Jennifer Liu",

      // Dates
      hireDate: "2022-11-01",
      lastReviewDate: "2024-05-01",

      // Compensation & Benefits
      salary: 98000,
      currency: 1, // USD
      paygrade: "M1",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes: "Excellent operational efficiency improvements",
      nextReviewDate: "2024-11-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2022-10-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-05-01",
      updatedAt: "2024-05-01T13:15:00Z",
      lastProfileUpdate: "2024-05-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2022-10-25",
        managerEmail: "jennifer.liu@company.com",
        managerAssignDate: "2022-11-01",
        reviewComments: "Outstanding operational leadership",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2022-11-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_006",
      },
    },
    {
      _id: "emp_007",
      status: "Active",

      // Personal Information
      firstName: "Alex",
      lastName: "Kim",
      fullName: "Alex Kim",
      personalEmail: "alex.kim@protonmail.com",
      workEmail: "alex.kim@company.com",
      phoneNumber: "+1-555-0147",
      emergencyContactName: "Grace Kim",
      emergencyContactPhone: "+1-555-0148",
      address: "147 Elm Avenue",
      city: "Boston",
      state: "MA",
      country: "USA",
      dateOfBirth: "1994-06-25",

      // Employment Information
      employeeId: "EMP007",
      department: "Finance",
      position: "Financial Analyst",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "emp_004",
      managerName: "Jennifer Liu",

      // Dates
      hireDate: "2024-08-01", // Recent hire (within 30 days)
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 72000,
      currency: 1, // USD
      paygrade: "L3",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "New hire, completing onboarding training",
      nextReviewDate: "2025-02-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2024-07-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-08-01",
      updatedAt: "2024-08-01T08:00:00Z",
      lastProfileUpdate: "2024-08-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2024-07-25",
        managerEmail: "jennifer.liu@company.com",
        managerAssignDate: "2024-08-01",
        reviewComments: "New hire, strong academic background",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2024-08-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_007",
      },
    },
    {
      _id: "emp_008",
      status: "Active",

      // Personal Information
      firstName: "Lisa",
      lastName: "Wang",
      fullName: "Lisa Wang",
      personalEmail: "lisa.wang@icloud.com",
      workEmail: "lisa.wang@company.com",
      phoneNumber: "+1-555-0258",
      emergencyContactName: "Kevin Wang",
      emergencyContactPhone: "+1-555-0259",
      address: "258 Willow Court",
      city: "San Diego",
      state: "CA",
      country: "USA",
      dateOfBirth: "1989-01-30",

      // Employment Information
      employeeId: "EMP008",
      department: "Design",
      position: "Senior UX Designer",
      jobLevel: "Senior",
      employmentType: "Full-time",
      workLocation: "Hybrid",
      managerId: "emp_003",
      managerName: "David Chen",

      // Dates
      hireDate: "2021-09-15",
      lastReviewDate: "2024-03-15",

      // Compensation & Benefits
      salary: 115000,
      currency: 1, // USD
      paygrade: "L4",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes: "Exceptional design skills, mentoring junior designers",
      nextReviewDate: "2024-09-15",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2021-09-10",
      updatedBy: "hr_admin",
      updatedOn: "2024-03-15",
      updatedAt: "2024-03-15T10:45:00Z",
      lastProfileUpdate: "2024-03-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2021-09-10",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2021-09-15",
        reviewComments: "Outstanding design work and team collaboration",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2021-09-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_008",
      },
    },
    {
      _id: "emp_009",
      status: "Active",

      // Personal Information
      firstName: "Robert",
      lastName: "Brown",
      fullName: "Robert Brown",
      personalEmail: "robert.brown@outlook.com",
      workEmail: "robert.brown@company.com",
      phoneNumber: "+1-555-0369",
      emergencyContactName: "Maria Brown",
      emergencyContactPhone: "+1-555-0370",
      address: "369 Spruce Lane",
      city: "Miami",
      state: "FL",
      country: "USA",
      dateOfBirth: "1993-08-14",

      // Employment Information
      employeeId: "EMP009",
      department: "Product",
      position: "Product Manager",
      jobLevel: "Manager",
      employmentType: "Full-time",
      workLocation: "Remote",
      managerId: "emp_003",
      managerName: "David Chen",

      // Dates
      hireDate: "2023-06-01",
      lastReviewDate: "2024-06-01",

      // Compensation & Benefits
      salary: 135000,
      currency: 1, // USD
      paygrade: "M4",
      benefitsEligibile: "Yes",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Good product strategy, working on stakeholder management",
      nextReviewDate: "2024-12-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2023-05-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-06-01",
      updatedAt: "2024-06-01T14:30:00Z",
      lastProfileUpdate: "2024-06-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2023-05-25",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2023-06-01",
        reviewComments: "Solid product management skills",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2023-06-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_009",
      },
    },
    {
      _id: "emp_010",
      status: "Terminated",

      // Personal Information
      firstName: "Jessica",
      lastName: "Taylor",
      fullName: "Jessica Taylor",
      personalEmail: "jessica.taylor@gmail.com",
      workEmail: "jessica.taylor@company.com",
      phoneNumber: "+1-555-0741",
      emergencyContactName: "Mark Taylor",
      emergencyContactPhone: "+1-555-0742",
      address: "741 Poplar Street",
      city: "Nashville",
      state: "TN",
      country: "USA",
      dateOfBirth: "1990-11-27",

      // Employment Information
      employeeId: "EMP010",
      department: "Marketing",
      position: "Marketing Coordinator",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "emp_002",
      managerName: "Marcus Rodriguez",

      // Dates
      hireDate: "2022-03-01",
      lastReviewDate: "2024-01-15",

      // Compensation & Benefits
      salary: 65000,
      currency: 1, // USD
      paygrade: "L2",
      benefitsEligibile: "No",

      // Performance & Development
      performanceRating: "Needs Improvement",
      trainingStatus: "Not Started",
      developmentNotes: "Performance issues led to termination",
      nextReviewDate: "",
      performanceHistory: [
        {
          reviewId: "rev_010_2024",
          reviewDate: "2024-01-15",
          reviewPeriodStart: "2023-07-15",
          reviewPeriodEnd: "2024-01-15",
          reviewerName: "Marcus Rodriguez",
          reviewerEmail: "marcus.rodriguez@company.com",
          rating: "Needs Improvement",
          comments:
            "Performance below expectations, improvement plan initiated",
          areasForImprovement: [
            "Time management",
            "Quality of work",
            "Communication",
          ],
          nextReviewDate: "2024-04-15",
        },
      ],
      performanceMetrics: {
        averageRating: 2.0,
        ratingTrend: "declining",
        reviewsCompleted: 1,
      },

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2022-02-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-07-15",
      updatedAt: "2024-07-15T17:00:00Z",
      lastProfileUpdate: "2024-07-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2022-02-25",
        managerEmail: "marcus.rodriguez@company.com",
        managerAssignDate: "2022-03-01",
        reviewComments: "Terminated due to performance issues",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2022-03-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_010",
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

  const getUnassignedHires = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => !employee.managerId);
  };

  const getRecentHires = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => {
      const hireDate = dayjs(employee.hireDate);
      const thirtyDaysAgo = dayjs().subtract(30, "day");
      return (
        hireDate.isAfter(thirtyDaysAgo) || hireDate.isSame(thirtyDaysAgo, "day")
      );
    });
  };

  const getByManager = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => employee.managerId);
  };

  const getByDepartment = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => employee.department);
  };

  const getActiveTerminated = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => employee.status);
  };

  const getUpdatedProfiles = async (): Promise<Employee[]> => {
    return employees.value.filter((employee) => employee.lastProfileUpdate);
  };

  const getContractEmployees = async (): Promise<Employee[]> => {
    return employees.value.filter(
      (employee) => employee.employmentType === "Contract"
    );
  };

  const getFormerEmployees = async (): Promise<Employee[]> => {
    return employees.value.filter(
      (employee) => employee.status === "Terminated"
    );
  };

  const addEmployee = (employee: Employee): void => {
    employees.value.push(employee);
  };

  const updateEmployee = (updatedEmployee: Employee): void => {
    const index = employees.value.findIndex(
      (emp) => emp._id === updatedEmployee._id
    );
    if (index !== -1) {
      // Update the updatedOn and updatedAt fields
      updatedEmployee.updatedOn = new Date().toISOString().split("T")[0];
      updatedEmployee.updatedAt = new Date().toISOString();
      updatedEmployee.lastProfileUpdate = new Date()
        .toISOString()
        .split("T")[0];

      employees.value[index] = updatedEmployee;
    }
  };

  // Performance Review Methods
  const getPerformanceReviews = async (): Promise<Employee[]> => {
    return employees.value.filter(
      (employee) =>
        employee.performanceHistory && employee.performanceHistory.length > 0
    );
  };

  const getOverdueReviews = async (): Promise<ReviewStatus[]> => {
    const today = dayjs();
    return employees.value
      .filter((employee) => employee.nextReviewDate)
      .map((employee) => {
        const nextReview = dayjs(employee.nextReviewDate);
        const daysOverdue = today.diff(nextReview, "day");
        return {
          employeeId: employee._id || "",
          employeeName: employee.fullName,
          department: employee.department,
          lastReviewDate: employee.lastReviewDate,
          nextReviewDate: employee.nextReviewDate,
          daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
          currentRating: employee.performanceRating,
          reviewStatus: (daysOverdue > 0
            ? "overdue"
            : daysOverdue > -30
            ? "due_soon"
            : "current") as ReviewStatus["reviewStatus"],
        };
      })
      .filter((review) => review.reviewStatus === "overdue");
  };

  const getPerformanceAnalytics = async (): Promise<PerformanceAnalytics> => {
    const activeEmployees = employees.value.filter(
      (emp) => emp.status === "Active"
    );
    const reviewedEmployees = activeEmployees.filter(
      (emp) => emp.performanceHistory && emp.performanceHistory.length > 0
    );

    // Calculate rating distribution
    const ratingDistribution: Record<PerformanceRating, number> = {
      "Exceeds Expectations": 0,
      "Meets Expectations": 0,
      "Needs Improvement": 0,
      Unsatisfactory: 0,
      Unrated: 0,
    };

    activeEmployees.forEach((emp) => {
      ratingDistribution[emp.performanceRating]++;
    });

    // Calculate department performance
    const departmentPerformance: Record<
      string,
      {
        averageRating: number;
        totalReviews: number;
        employeeCount: number;
      }
    > = {};

    activeEmployees.forEach((emp) => {
      if (!departmentPerformance[emp.department]) {
        departmentPerformance[emp.department] = {
          averageRating: 0,
          totalReviews: 0,
          employeeCount: 0,
        };
      }

      departmentPerformance[emp.department].employeeCount++;
      if (emp.performanceHistory?.length) {
        departmentPerformance[emp.department].totalReviews +=
          emp.performanceHistory.length;
      }
    });

    // Calculate average ratings for departments
    Object.keys(departmentPerformance).forEach((dept) => {
      const deptEmployees = activeEmployees.filter(
        (emp) => emp.department === dept
      );
      const ratingSum = deptEmployees.reduce((sum, emp) => {
        const ratingValue =
          emp.performanceRating === "Exceeds Expectations"
            ? 5
            : emp.performanceRating === "Meets Expectations"
            ? 3
            : emp.performanceRating === "Needs Improvement"
            ? 2
            : emp.performanceRating === "Unsatisfactory"
            ? 1
            : 0;
        return sum + ratingValue;
      }, 0);
      departmentPerformance[dept].averageRating =
        ratingSum / deptEmployees.length;
    });

    // Calculate overall average rating
    const totalRatingSum = activeEmployees.reduce((sum, emp) => {
      const ratingValue =
        emp.performanceRating === "Exceeds Expectations"
          ? 5
          : emp.performanceRating === "Meets Expectations"
          ? 3
          : emp.performanceRating === "Needs Improvement"
          ? 2
          : emp.performanceRating === "Unsatisfactory"
          ? 1
          : 0;
      return sum + ratingValue;
    }, 0);

    const overdueReviews = await getOverdueReviews();

    return {
      totalReviews: reviewedEmployees.reduce(
        (sum, emp) => sum + (emp.performanceHistory?.length || 0),
        0
      ),
      overdueReviews: overdueReviews.length,
      averageRating: totalRatingSum / activeEmployees.length,
      ratingDistribution,
      departmentPerformance,
      performanceTrends: [
        { period: "2024-Q1", averageRating: 3.2, reviewCount: 15 },
        { period: "2024-Q2", averageRating: 3.4, reviewCount: 18 },
        { period: "2024-Q3", averageRating: 3.6, reviewCount: 12 },
      ],
    };
  };

  const getReviewStatusList = async (): Promise<ReviewStatus[]> => {
    const today = dayjs();
    return employees.value
      .filter((employee) => employee.status === "Active")
      .map((employee) => {
        let reviewStatus: ReviewStatus["reviewStatus"] = "never_reviewed";
        let daysOverdue: number | undefined;

        if (employee.nextReviewDate) {
          const nextReview = dayjs(employee.nextReviewDate);
          const daysDiff = today.diff(nextReview, "day");

          if (daysDiff > 0) {
            reviewStatus = "overdue";
            daysOverdue = daysDiff;
          } else if (daysDiff > -30) {
            reviewStatus = "due_soon";
          } else {
            reviewStatus = "current";
          }
        } else if (employee.lastReviewDate) {
          reviewStatus = "current";
        }

        return {
          employeeId: employee._id || "",
          employeeName: employee.fullName,
          department: employee.department,
          lastReviewDate: employee.lastReviewDate,
          nextReviewDate: employee.nextReviewDate,
          daysOverdue,
          currentRating: employee.performanceRating,
          reviewStatus,
        };
      });
  };

  return {
    employees,
    departments,
    managers,
    formOptions,
    getUnassignedHires,
    getRecentHires,
    getByManager,
    getByDepartment,
    getActiveTerminated,
    getContractEmployees,
    getFormerEmployees,
    getUpdatedProfiles,
    addEmployee,
    updateEmployee,
    // Performance Review Methods
    getPerformanceReviews,
    getOverdueReviews,
    getPerformanceAnalytics,
    getReviewStatusList,
  };
});
