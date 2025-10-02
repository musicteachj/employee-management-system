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
  BusinessUnit,
} from "../types";
import { useNotificationStore } from "./notification";

export const useAppStore = defineStore("app", () => {
  const refreshKey = ref(0);

  const selectedEmployees = ref<Employee[]>([]);

  const setSelectedEmployees = (employees: Employee[]) => {
    selectedEmployees.value = employees;
  };

  const removeSelectedEmployee = (employeeId: string) => {
    selectedEmployees.value = selectedEmployees.value.filter(
      (emp) => emp._id !== employeeId
    );
  };

  // Simplified search interface for essential employee fields
  interface SearchCriteria {
    fullName?: string;
    department?: string;
    position?: string;
    status?: ActiveStatus;
    managerId?: string;
    employmentType?: EmploymentType;
  }

  // API helper functions
  const apiGet = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      const notificationStore = useNotificationStore();
      const errorMessage = `Failed to fetch data: ${response.status} ${response.statusText}`;
      notificationStore.showError(errorMessage);
      throw new Error(errorMessage);
    }
    return await response.json();
  };

  const apiPost = async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const notificationStore = useNotificationStore();
      const errorMessage = `Failed to post data: ${response.status} ${response.statusText}`;
      notificationStore.showError(errorMessage);
      throw new Error(errorMessage);
    }
    return await response.json();
  };

  const getEmployees = async (): Promise<Employee[]> => {
    try {
      const data = await apiGet("/api/employees");
      employees.value = data;
      // Also refresh managers when employees are loaded
      await getManagers();
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      // Return cached employees if API fails
      return employees.value;
    }
  };

  const getManagers = async (): Promise<Manager[]> => {
    try {
      const data = await apiGet("/api/managers");
      // Transform Employee objects to Manager interface
      managers.value = data.map((emp: Employee) => ({
        id: emp._id!,
        name: emp.fullName,
        email: emp.workEmail,
        department: emp.department,
        jobLevel: emp.jobLevel,
      }));
      return managers.value;
    } catch (error) {
      console.error("Error fetching managers:", error);
      // Return cached managers if API fails
      return managers.value;
    }
  };

  const searchEmployees = async (
    criteria: SearchCriteria
  ): Promise<Employee[]> => {
    console.log("Searching employees with criteria:", criteria);

    try {
      const results = await apiPost("/api/employees/search", criteria);
      return results;
    } catch (error) {
      console.error("Error searching employees:", error);
      // Fallback to local filtering if API fails
      return employees.value.filter((employee) => {
        if (criteria.fullName) {
          const searchTerm = criteria.fullName.toLowerCase();
          const nameMatch =
            employee.firstName.toLowerCase().includes(searchTerm) ||
            employee.lastName.toLowerCase().includes(searchTerm) ||
            employee.fullName.toLowerCase().includes(searchTerm);
          if (!nameMatch) return false;
        }
        if (
          criteria.department &&
          !employee.department
            .toLowerCase()
            .includes(criteria.department.toLowerCase())
        )
          return false;
        if (
          criteria.position &&
          !employee.position
            .toLowerCase()
            .includes(criteria.position.toLowerCase())
        )
          return false;
        if (criteria.status && employee.status !== criteria.status)
          return false;
        if (criteria.managerId && employee.managerId !== criteria.managerId)
          return false;
        if (
          criteria.employmentType &&
          employee.employmentType !== criteria.employmentType
        )
          return false;
        return true;
      });
    }
  };

  // Initialize as empty - will be populated from API
  const employees = ref<Employee[]>([]);
  const managers = ref<Manager[]>([]);

  // STATIC DATA COMMENTED OUT - Now fetched from API
  // Keeping this here for reference during migration
  /*
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
      managerId: "emp_003",
      managerName: "David Chen",
      directReports: [],
      costCenter: "ENG-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-09-01", // Recent hire (within 30 days)
      lastReviewDate: "2024-06-15",

      // Compensation & Benefits
      salary: 125000,
      currency: 1, // USD
      paygrade: "L5",
      benefitsEligible: "Yes",

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
      managerId: "emp_020",
      managerName: "James Wilson",
      directReports: ["emp_013"],
      costCenter: "MKT-000",
      businessUnit: "Revenue",

      // Dates
      hireDate: "2024-07-01", // Recent hire (within 90 days but not 30)
      lastReviewDate: "2024-03-01",

      // Compensation & Benefits
      salary: 95000,
      currency: 1, // USD
      paygrade: "M2",
      benefitsEligible: "Yes",

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
      managerId: "emp_020", // Will be the CEO
      managerName: "James Wilson",
      directReports: ["emp_001", "emp_008", "emp_009", "emp_014"],
      costCenter: "ENG-000",
      businessUnit: "Technology",

      // Dates
      hireDate: "2019-03-01",
      lastReviewDate: "2024-01-15",

      // Compensation & Benefits
      salary: 180000,
      currency: 1, // USD
      paygrade: "D1",
      benefitsEligible: "Yes",

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
      managerId: "emp_020",
      managerName: "James Wilson",
      directReports: ["emp_006", "emp_007"],
      costCenter: "HR-000",
      businessUnit: "Operations",

      // Dates
      hireDate: "2020-05-15",
      lastReviewDate: "2024-02-01",

      // Compensation & Benefits
      salary: 165000,
      currency: 1, // USD
      paygrade: "D2",
      benefitsEligible: "Yes",

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
      managerId: "emp_020",
      managerName: "James Wilson",
      directReports: ["emp_012"],
      costCenter: "SAL-000",
      businessUnit: "Revenue",

      // Dates
      hireDate: "2023-01-20",
      lastReviewDate: "2024-01-20",

      // Compensation & Benefits
      salary: 105000,
      currency: 1, // USD
      paygrade: "M3",
      benefitsEligible: "Yes",

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
      directReports: ["emp_019"],
      costCenter: "OPS-000",
      businessUnit: "Operations",

      // Dates
      hireDate: "2022-11-01",
      lastReviewDate: "2024-05-01",

      // Compensation & Benefits
      salary: 98000,
      currency: 1, // USD
      paygrade: "M1",
      benefitsEligible: "Yes",

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
      managerId: "emp_021",
      managerName: "Victoria Chang",
      directReports: ["emp_017"],
      costCenter: "FIN-001",
      businessUnit: "Operations",

      // Dates
      hireDate: "2025-08-25", // Recent hire (within 30 days)
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 72000,
      currency: 1, // USD
      paygrade: "L3",
      benefitsEligible: "Yes",

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
      directReports: ["emp_018"],
      costCenter: "DES-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2021-09-15",
      lastReviewDate: "2024-03-15",

      // Compensation & Benefits
      salary: 115000,
      currency: 1, // USD
      paygrade: "L4",
      benefitsEligible: "Yes",

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
      directReports: ["emp_015"],
      costCenter: "PRD-000",
      businessUnit: "Technology",

      // Dates
      hireDate: "2023-06-01",
      lastReviewDate: "2024-06-01",

      // Compensation & Benefits
      salary: 135000,
      currency: 1, // USD
      paygrade: "M4",
      benefitsEligible: "Yes",

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
      benefitsEligible: "No",

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
    {
      _id: "emp_011",
      status: "Active",

      // Personal Information
      firstName: "Amanda",
      lastName: "Foster",
      fullName: "Amanda Foster",
      personalEmail: "amanda.foster@gmail.com",
      workEmail: "amanda.foster@company.com",
      phoneNumber: "+1-555-0111",
      emergencyContactName: "Brian Foster",
      emergencyContactPhone: "+1-555-0112",
      address: "111 Oak Ridge Drive",
      city: "Atlanta",
      state: "GA",
      country: "USA",
      dateOfBirth: "1995-02-14",

      // Employment Information
      employeeId: "EMP011",
      department: "Engineering",
      position: "Junior Software Engineer",
      jobLevel: "Entry",
      employmentType: "Full-time",
      workLocation: "Remote",
      managerId: "emp_001",
      managerName: "Sarah Johnson",
      directReports: [],
      costCenter: "ENG-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-09-10", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 85000,
      currency: 1, // USD
      paygrade: "L1",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "New graduate hire, showing strong potential",
      nextReviewDate: "2025-03-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-09-05",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-10",
      updatedAt: "2025-09-10T09:00:00Z",
      lastProfileUpdate: "2025-09-10",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2025-09-05",
        managerEmail: "sarah.johnson@company.com",
        managerAssignDate: "2025-09-10",
        reviewComments: "New graduate hire with strong technical background",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-10",
        eventName: "Onboarding",
        onboardingKey: "ONB_011",
      },
    },
    {
      _id: "emp_012",
      status: "Active",

      // Personal Information
      firstName: "Carlos",
      lastName: "Martinez",
      fullName: "Carlos Martinez",
      personalEmail: "carlos.martinez@yahoo.com",
      workEmail: "carlos.martinez@company.com",
      phoneNumber: "+1-555-0222",
      emergencyContactName: "Sofia Martinez",
      emergencyContactPhone: "+1-555-0223",
      address: "222 Sunset Boulevard",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      dateOfBirth: "1992-06-18",

      // Employment Information
      employeeId: "EMP012",
      department: "Sales",
      position: "Sales Representative",
      jobLevel: "Mid",
      employmentType: "Part-time",
      workLocation: "Hybrid",
      managerId: "emp_005",
      managerName: "Michael Thompson",
      directReports: [],
      costCenter: "SAL-001",
      businessUnit: "Revenue",

      // Dates
      hireDate: "2025-09-05", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 45000, // Part-time salary
      currency: 1, // USD
      paygrade: "L2",
      benefitsEligible: "No",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes:
        "Part-time sales rep, working towards full-time position",
      nextReviewDate: "2025-02-20",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-09-01",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-05",
      updatedAt: "2025-09-05T10:30:00Z",
      lastProfileUpdate: "2025-09-05",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2025-09-01",
        managerEmail: "michael.thompson@company.com",
        managerAssignDate: "2025-09-05",
        reviewComments: "Part-time hire with sales experience",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-05",
        eventName: "Onboarding",
        onboardingKey: "ONB_012",
      },
    },
    {
      _id: "emp_013",
      status: "Active",

      // Personal Information
      firstName: "Rachel",
      lastName: "Green",
      fullName: "Rachel Green",
      personalEmail: "rachel.green@outlook.com",
      workEmail: "rachel.green@company.com",
      phoneNumber: "+1-555-0333",
      emergencyContactName: "Ross Green",
      emergencyContactPhone: "+1-555-0334",
      address: "333 Central Park West",
      city: "New York",
      state: "NY",
      country: "USA",
      dateOfBirth: "1990-05-05",

      // Employment Information
      employeeId: "EMP013",
      department: "Marketing",
      position: "Digital Marketing Specialist",
      jobLevel: "Senior",
      employmentType: "Contract",
      workLocation: "Remote",
      managerId: "emp_002",
      managerName: "Marcus Rodriguez",
      directReports: [],
      costCenter: "MKT-001",
      businessUnit: "Revenue",

      // Dates
      hireDate: "2024-07-15",
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 95000, // Contract rate annualized
      currency: 1, // USD
      paygrade: "C1",
      benefitsEligible: "No",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Contract specialist with strong digital marketing skills",
      nextReviewDate: "2025-01-15",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2024-07-10",
      updatedBy: "hr_admin",
      updatedOn: "2024-07-15",
      updatedAt: "2024-07-15T14:00:00Z",
      lastProfileUpdate: "2024-07-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2024-07-10",
        managerEmail: "marcus.rodriguez@company.com",
        managerAssignDate: "2024-07-15",
        reviewComments: "Experienced contractor with proven track record",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2024-07-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_013",
      },
    },
    {
      _id: "emp_014",
      status: "Active",

      // Personal Information
      firstName: "Kevin",
      lastName: "Park",
      fullName: "Kevin Park",
      personalEmail: "kevin.park@gmail.com",
      workEmail: "kevin.park@company.com",
      phoneNumber: "+1-555-0444",
      emergencyContactName: "Jenny Park",
      emergencyContactPhone: "+1-555-0445",
      address: "444 Innovation Drive",
      city: "San Jose",
      state: "CA",
      country: "USA",
      dateOfBirth: "1998-09-22",

      // Employment Information
      employeeId: "EMP014",
      department: "Engineering",
      position: "Software Engineering Intern",
      jobLevel: "Entry",
      employmentType: "Intern",
      workLocation: "Office",
      managerId: "emp_003",
      managerName: "David Chen",
      directReports: [],
      costCenter: "ENG-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-09-12", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 25000, // Intern stipend annualized
      currency: 1, // USD
      paygrade: "I1",
      benefitsEligible: "No",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "Computer Science student intern, summer program",
      nextReviewDate: "2024-12-10",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-09-10",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-12",
      updatedAt: "2025-09-12T08:00:00Z",
      lastProfileUpdate: "2025-09-12",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2025-09-10",
        managerEmail: "david.chen@company.com",
        managerAssignDate: "2025-09-12",
        reviewComments: "Promising CS student from Stanford",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-12",
        eventName: "Onboarding",
        onboardingKey: "ONB_014",
      },
    },
    {
      _id: "emp_015",
      status: "Active",

      // Personal Information
      firstName: "Priya",
      lastName: "Patel",
      fullName: "Priya Patel",
      personalEmail: "priya.patel@gmail.com",
      workEmail: "priya.patel@company.com",
      phoneNumber: "+1-555-0555",
      emergencyContactName: "Raj Patel",
      emergencyContactPhone: "+1-555-0556",
      address: "555 Tech Center Boulevard",
      city: "Austin",
      state: "TX",
      country: "USA",
      dateOfBirth: "1993-11-30",

      // Employment Information
      employeeId: "EMP015",
      department: "Product",
      position: "Senior Product Manager",
      jobLevel: "Senior",
      employmentType: "Full-time",
      workLocation: "Hybrid",
      managerId: "emp_009",
      managerName: "Robert Brown",
      directReports: ["emp_016"],
      costCenter: "PRD-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2023-04-01",
      lastReviewDate: "2024-04-01",

      // Compensation & Benefits
      salary: 145000,
      currency: 1, // USD
      paygrade: "L6",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Strong product leadership, excellent stakeholder management",
      nextReviewDate: "2024-10-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2023-03-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-04-01",
      updatedAt: "2024-04-01T12:00:00Z",
      lastProfileUpdate: "2024-04-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2023-03-25",
        managerEmail: "robert.brown@company.com",
        managerAssignDate: "2023-04-01",
        reviewComments: "Excellent product management skills and leadership",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2023-04-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_015",
      },
    },
    {
      _id: "emp_016",
      status: "Active",

      // Personal Information
      firstName: "Tyler",
      lastName: "Johnson",
      fullName: "Tyler Johnson",
      personalEmail: "tyler.johnson@protonmail.com",
      workEmail: "tyler.johnson@company.com",
      phoneNumber: "+1-555-0666",
      emergencyContactName: "Ashley Johnson",
      emergencyContactPhone: "+1-555-0667",
      address: "666 Innovation Way",
      city: "Raleigh",
      state: "NC",
      country: "USA",
      dateOfBirth: "1996-03-08",

      // Employment Information
      employeeId: "EMP016",
      department: "Product",
      position: "Product Analyst",
      jobLevel: "Mid",
      employmentType: "Temporary",
      workLocation: "Remote",
      managerId: "emp_015",
      managerName: "Priya Patel",
      directReports: [],
      costCenter: "PRD-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-08-30", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 70000, // Temporary position
      currency: 1, // USD
      paygrade: "T1",
      benefitsEligible: "No",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "Temporary analyst position, 6-month contract",
      nextReviewDate: "2024-11-05",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-08-25",
      updatedBy: "hr_admin",
      updatedOn: "2025-08-30",
      updatedAt: "2025-08-30T09:30:00Z",
      lastProfileUpdate: "2025-08-30",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2025-08-25",
        managerEmail: "priya.patel@company.com",
        managerAssignDate: "2025-08-30",
        reviewComments: "Temporary analyst for product metrics project",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-08-30",
        eventName: "Onboarding",
        onboardingKey: "ONB_016",
      },
    },
    {
      _id: "emp_017",
      status: "Active",

      // Personal Information
      firstName: "Samantha",
      lastName: "Lee",
      fullName: "Samantha Lee",
      personalEmail: "samantha.lee@icloud.com",
      workEmail: "samantha.lee@company.com",
      phoneNumber: "+1-555-0777",
      emergencyContactName: "Daniel Lee",
      emergencyContactPhone: "+1-555-0778",
      address: "777 Financial District",
      city: "New York",
      state: "NY",
      country: "USA",
      dateOfBirth: "1991-12-12",

      // Employment Information
      employeeId: "EMP017",
      department: "Finance",
      position: "Senior Financial Analyst",
      jobLevel: "Senior",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "emp_007",
      managerName: "Alex Kim",
      directReports: [],
      costCenter: "FIN-001",
      businessUnit: "Operations",

      // Dates
      hireDate: "2022-06-15",
      lastReviewDate: "2024-06-15",

      // Compensation & Benefits
      salary: 92000,
      currency: 1, // USD
      paygrade: "L4",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Strong analytical skills, working on CPA certification",
      nextReviewDate: "2024-12-15",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2022-06-10",
      updatedBy: "hr_admin",
      updatedOn: "2024-06-15",
      updatedAt: "2024-06-15T11:00:00Z",
      lastProfileUpdate: "2024-06-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2022-06-10",
        managerEmail: "alex.kim@company.com",
        managerAssignDate: "2022-06-15",
        reviewComments: "Reliable analyst with strong attention to detail",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2022-06-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_017",
      },
    },
    {
      _id: "emp_018",
      status: "Active",

      // Personal Information
      firstName: "Marcus",
      lastName: "Williams",
      fullName: "Marcus Williams",
      personalEmail: "marcus.williams@yahoo.com",
      workEmail: "marcus.williams@company.com",
      phoneNumber: "+1-555-0888",
      emergencyContactName: "Tanya Williams",
      emergencyContactPhone: "+1-555-0889",
      address: "888 Design Avenue",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      dateOfBirth: "1994-07-07",

      // Employment Information
      employeeId: "EMP018",
      department: "Design",
      position: "UX Designer",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Hybrid",
      managerId: "emp_008",
      managerName: "Lisa Wang",
      directReports: [],
      costCenter: "DES-001",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-09-08", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 88000,
      currency: 1, // USD
      paygrade: "L3",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "New UX designer with strong portfolio",
      nextReviewDate: "2025-03-05",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-09-03",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-08",
      updatedAt: "2025-09-08T10:00:00Z",
      lastProfileUpdate: "2025-09-08",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2025-09-03",
        managerEmail: "lisa.wang@company.com",
        managerAssignDate: "2025-09-08",
        reviewComments: "Talented designer with fresh perspective",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-08",
        eventName: "Onboarding",
        onboardingKey: "ONB_018",
      },
    },
    {
      _id: "emp_019",
      status: "Active",

      // Personal Information
      firstName: "Nicole",
      lastName: "Anderson",
      fullName: "Nicole Anderson",
      personalEmail: "nicole.anderson@outlook.com",
      workEmail: "nicole.anderson@company.com",
      phoneNumber: "+1-555-0999",
      emergencyContactName: "Chris Anderson",
      emergencyContactPhone: "+1-555-1000",
      address: "999 Operations Center",
      city: "Phoenix",
      state: "AZ",
      country: "USA",
      dateOfBirth: "1988-04-25",

      // Employment Information
      employeeId: "EMP019",
      department: "Operations",
      position: "Operations Coordinator",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "emp_006",
      managerName: "Emily Davis",
      directReports: [],
      costCenter: "OPS-001",
      businessUnit: "Operations",

      // Dates
      hireDate: "2023-10-01",
      lastReviewDate: "2024-04-01",

      // Compensation & Benefits
      salary: 68000,
      currency: 1, // USD
      paygrade: "L2",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Meets Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Reliable coordinator with strong organizational skills",
      nextReviewDate: "2024-10-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2023-09-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-04-01",
      updatedAt: "2024-04-01T15:30:00Z",
      lastProfileUpdate: "2024-04-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2023-09-25",
        managerEmail: "emily.davis@company.com",
        managerAssignDate: "2023-10-01",
        reviewComments: "Strong operational support and coordination",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2023-10-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_019",
      },
    },
    {
      _id: "emp_020",
      status: "Active",

      // Personal Information
      firstName: "James",
      lastName: "Wilson",
      fullName: "James Wilson",
      personalEmail: "james.wilson@gmail.com",
      workEmail: "james.wilson@company.com",
      phoneNumber: "+1-555-1111",
      emergencyContactName: "Patricia Wilson",
      emergencyContactPhone: "+1-555-1112",
      address: "1000 Executive Plaza",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      dateOfBirth: "1975-08-15",

      // Employment Information
      employeeId: "EMP020",
      department: "Executive",
      position: "Chief Executive Officer",
      jobLevel: "CEO",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "",
      managerName: "",
      directReports: ["emp_002", "emp_003", "emp_004", "emp_005", "emp_021"],
      costCenter: "EXE-000",
      businessUnit: "Executive",

      // Dates
      hireDate: "2018-01-01",
      lastReviewDate: "2024-01-01",

      // Compensation & Benefits
      salary: 350000,
      currency: 1, // USD
      paygrade: "CEO",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Visionary leader driving company growth and innovation",
      nextReviewDate: "2025-01-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "board_admin",
      createdOn: "2017-12-15",
      updatedBy: "hr_admin",
      updatedOn: "2024-01-01",
      updatedAt: "2024-01-01T00:00:00Z",
      lastProfileUpdate: "2024-01-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2017-12-15",
        managerEmail: "board@company.com",
        managerAssignDate: "2018-01-01",
        reviewComments: "Outstanding leadership and strategic vision",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "board_admin",
        authorType: "HR",
        eventDate: "2018-01-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_020",
      },
    },
    {
      _id: "emp_021",
      status: "Active",

      // Personal Information
      firstName: "Victoria",
      lastName: "Chang",
      fullName: "Victoria Chang",
      personalEmail: "victoria.chang@gmail.com",
      workEmail: "victoria.chang@company.com",
      phoneNumber: "+1-555-1222",
      emergencyContactName: "Michael Chang",
      emergencyContactPhone: "+1-555-1223",
      address: "1200 Financial Tower",
      city: "New York",
      state: "NY",
      country: "USA",
      dateOfBirth: "1982-10-03",

      // Employment Information
      employeeId: "EMP021",
      department: "Finance",
      position: "Chief Financial Officer",
      jobLevel: "C-Level",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "emp_020",
      managerName: "James Wilson",
      directReports: ["emp_007", "emp_017"],
      costCenter: "FIN-000",
      businessUnit: "Operations",

      // Dates
      hireDate: "2020-03-01",
      lastReviewDate: "2024-03-01",

      // Compensation & Benefits
      salary: 275000,
      currency: 1, // USD
      paygrade: "C1",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Exceeds Expectations",
      trainingStatus: "Completed",
      developmentNotes:
        "Strategic financial leadership, excellent stakeholder management",
      nextReviewDate: "2025-03-01",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2020-02-25",
      updatedBy: "hr_admin",
      updatedOn: "2024-03-01",
      updatedAt: "2024-03-01T12:00:00Z",
      lastProfileUpdate: "2024-03-01",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2020-02-25",
        managerEmail: "james.wilson@company.com",
        managerAssignDate: "2020-03-01",
        reviewComments:
          "Exceptional financial leadership and strategic thinking",
        revalidationStatus: "Completed",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2020-03-01",
        eventName: "Onboarding",
        onboardingKey: "ONB_021",
      },
    },
    // Add some unassigned employees for testing
    {
      _id: "emp_100",
      status: "Active",

      // Personal Information
      firstName: "John",
      lastName: "Unassigned",
      fullName: "John Unassigned",
      personalEmail: "john.unassigned@gmail.com",
      workEmail: "john.unassigned@company.com",
      phoneNumber: "+1-555-1001",
      emergencyContactName: "Jane Unassigned",
      emergencyContactPhone: "+1-555-1002",
      address: "100 Test Street",
      city: "Test City",
      state: "CA",
      country: "USA",
      dateOfBirth: "1990-01-01",

      // Employment Information
      employeeId: "EMP100",
      department: "Engineering",
      position: "Software Engineer",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Remote",
      managerId: "", // No manager assigned
      managerName: "",
      directReports: [],
      costCenter: "ENG-002",
      businessUnit: "Technology",

      // Dates
      hireDate: "2025-09-15", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 95000,
      currency: 1,
      paygrade: "L3",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "In Progress",
      developmentNotes: "New hire awaiting manager assignment",
      nextReviewDate: "",

      // Compliance & Verification
      backgroundCheckStatus: "Completed",

      // System fields
      docType: "employee",
      source: "HR",
      createdBy: "hr_admin",
      createdOn: "2025-09-15",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-15",
      updatedAt: "2025-09-15T10:00:00Z",
      lastProfileUpdate: "2025-09-15",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_1",
        assignedDate: "2025-09-15",
        managerEmail: "",
        managerAssignDate: "",
        reviewComments: "Awaiting manager assignment",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-15",
        eventName: "Onboarding",
        onboardingKey: "ONB_100",
      },
    },
    {
      _id: "emp_101",
      status: "Active",

      // Personal Information
      firstName: "Sarah",
      lastName: "NoManager",
      fullName: "Sarah NoManager",
      personalEmail: "sarah.nomanager@gmail.com",
      workEmail: "sarah.nomanager@company.com",
      phoneNumber: "+1-555-1003",
      emergencyContactName: "Bob NoManager",
      emergencyContactPhone: "+1-555-1004",
      address: "101 Test Avenue",
      city: "Test City",
      state: "CA",
      country: "USA",
      dateOfBirth: "1992-05-15",

      // Employment Information
      employeeId: "EMP101",
      department: "Marketing",
      position: "Marketing Specialist",
      jobLevel: "Mid",
      employmentType: "Full-time",
      workLocation: "Office",
      managerId: "", // No manager assigned
      managerName: "",
      directReports: [],
      costCenter: "MKT-002",
      businessUnit: "Revenue",

      // Dates
      hireDate: "2025-09-18", // Recent hire
      lastReviewDate: "",

      // Compensation & Benefits
      salary: 75000,
      currency: 1,
      paygrade: "L3",
      benefitsEligible: "Yes",

      // Performance & Development
      performanceRating: "Unrated",
      trainingStatus: "Not Started",
      developmentNotes: "New hire in onboarding process",
      nextReviewDate: "",

      // Compliance & Verification
      backgroundCheckStatus: "In Progress",

      // System fields
      docType: "employee",
      source: "External",
      createdBy: "hr_admin",
      createdOn: "2025-09-18",
      updatedBy: "hr_admin",
      updatedOn: "2025-09-18",
      updatedAt: "2025-09-18T14:00:00Z",
      lastProfileUpdate: "2025-09-18",

      // Manager/HR Assignment
      hrAssignment: {
        assignedTo: "hr_manager_2",
        assignedDate: "2025-09-18",
        managerEmail: "",
        managerAssignDate: "",
        reviewComments: "Pending manager assignment",
        revalidationStatus: "Pending",
      },

      // Onboarding/Event tracking
      onboarding: {
        author: "hr_admin",
        authorType: "HR",
        eventDate: "2025-09-18",
        eventName: "Onboarding",
        onboardingKey: "ONB_101",
      },
    },
  ]);
  */

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
    {
      id: "dept_009",
      name: "Executive",
      description: "Executive leadership and strategic direction",
    },
  ]);

  // Managers - Fetched dynamically from API
  // STATIC DATA REMOVED - Now using getManagers() to fetch from backend

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

    statuses: [
      "Active",
      "Inactive",
      "On Leave",
      "Terminated",
    ] as ActiveStatus[],

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

    businessUnits: [
      "Technology",
      "Operations",
      "Revenue",
      "Executive",
    ] as BusinessUnit[],

    costCenters: [
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
    ],

    usStates: [
      { value: "AL", title: "Alabama" },
      { value: "AK", title: "Alaska" },
      { value: "AZ", title: "Arizona" },
      { value: "AR", title: "Arkansas" },
      { value: "CA", title: "California" },
      { value: "CO", title: "Colorado" },
      { value: "CT", title: "Connecticut" },
      { value: "DE", title: "Delaware" },
      { value: "FL", title: "Florida" },
      { value: "GA", title: "Georgia" },
      { value: "HI", title: "Hawaii" },
      { value: "ID", title: "Idaho" },
      { value: "IL", title: "Illinois" },
      { value: "IN", title: "Indiana" },
      { value: "IA", title: "Iowa" },
      { value: "KS", title: "Kansas" },
      { value: "KY", title: "Kentucky" },
      { value: "LA", title: "Louisiana" },
      { value: "ME", title: "Maine" },
      { value: "MD", title: "Maryland" },
      { value: "MA", title: "Massachusetts" },
      { value: "MI", title: "Michigan" },
      { value: "MN", title: "Minnesota" },
      { value: "MS", title: "Mississippi" },
      { value: "MO", title: "Missouri" },
      { value: "MT", title: "Montana" },
      { value: "NE", title: "Nebraska" },
      { value: "NV", title: "Nevada" },
      { value: "NH", title: "New Hampshire" },
      { value: "NJ", title: "New Jersey" },
      { value: "NM", title: "New Mexico" },
      { value: "NY", title: "New York" },
      { value: "NC", title: "North Carolina" },
      { value: "ND", title: "North Dakota" },
      { value: "OH", title: "Ohio" },
      { value: "OK", title: "Oklahoma" },
      { value: "OR", title: "Oregon" },
      { value: "PA", title: "Pennsylvania" },
      { value: "RI", title: "Rhode Island" },
      { value: "SC", title: "South Carolina" },
      { value: "SD", title: "South Dakota" },
      { value: "TN", title: "Tennessee" },
      { value: "TX", title: "Texas" },
      { value: "UT", title: "Utah" },
      { value: "VT", title: "Vermont" },
      { value: "VA", title: "Virginia" },
      { value: "WA", title: "Washington" },
      { value: "WV", title: "West Virginia" },
      { value: "WI", title: "Wisconsin" },
      { value: "WY", title: "Wyoming" },
      { value: "DC", title: "District of Columbia" },
    ],

    countries: [{ value: "United States", title: "United States" }],
  };

  const getUnassignedHires = async (): Promise<Employee[]> => {
    console.log("Getting unassigned hires");
    return employees.value.filter((employee) => {
      // Filter employees who don't have a manager assigned (CEO is exempt)
      const noManager = !employee.managerId || employee.managerId.trim() === "";
      const isCEO = employee.jobLevel === "CEO";
      return noManager && !isCEO;
    });
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

  const addEmployee = async (
    employee: Omit<Employee, "_id">
  ): Promise<Employee> => {
    try {
      const notificationStore = useNotificationStore();
      const response = await apiPost("/api/employees", employee);

      // Refresh employees list from backend
      await getEmployees();

      notificationStore.showSuccess(
        `Employee ${response.fullName} added successfully!`
      );
      return response;
    } catch (error) {
      const notificationStore = useNotificationStore();
      console.error("Error adding employee:", error);
      notificationStore.showError("Failed to add employee. Please try again.");
      throw error;
    }
  };

  const updateEmployee = async (
    updatedEmployee: Employee
  ): Promise<Employee> => {
    try {
      const notificationStore = useNotificationStore();

      if (!updatedEmployee._id) {
        throw new Error("Employee ID is required for update");
      }

      const response = await fetch(`/api/employees/${updatedEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) {
        const errorMessage = `Failed to update employee: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Refresh employees list from backend
      await getEmployees();

      notificationStore.showSuccess(
        `Employee ${result.fullName} updated successfully!`
      );
      return result;
    } catch (error) {
      const notificationStore = useNotificationStore();
      console.error("Error updating employee:", error);
      notificationStore.showError(
        "Failed to update employee. Please try again."
      );
      throw error;
    }
  };

  const bulkAssignManager = async (
    employeeIds: string[],
    managerId: string,
    assignmentDate: string,
    notes?: string
  ): Promise<void> => {
    try {
      const response = await apiPost("/api/bulk/assign-manager", {
        employeeIds,
        managerId,
        assignmentDate,
        notes,
      });

      console.log("Bulk assign manager response:", response);

      // Refresh employees from server to get updated data
      await getEmployees();

      selectedEmployees.value = [];
      refreshKey.value += 1;
    } catch (error) {
      console.error("Error in bulk assign manager:", error);
      throw error;
    }
  };

  const bulkConvertEmploymentType = async (
    employeeIds: string[],
    newEmploymentType: EmploymentType,
    effectiveDate: string,
    notes?: string
  ): Promise<void> => {
    try {
      const response = await apiPost("/api/bulk/convert-employment-type", {
        employeeIds,
        newEmploymentType,
        effectiveDate,
        notes,
      });

      console.log("Bulk convert employment type response:", response);

      // Refresh employees from server to get updated data
      await getEmployees();

      selectedEmployees.value = [];
      refreshKey.value += 1;
    } catch (error) {
      console.error("Error in bulk convert employment type:", error);
      throw error;
    }
  };

  const bulkChangeStatus = async (
    employeeIds: string[],
    newStatus: ActiveStatus,
    effectiveDate: string,
    reason?: string,
    notifications?: {
      notifyEmployee: boolean;
      notifyManager: boolean;
    }
  ): Promise<void> => {
    try {
      const response = await apiPost("/api/bulk/change-status", {
        employeeIds,
        newStatus,
        effectiveDate,
        reason,
        notifications,
      });

      console.log("Bulk change status response:", response);

      // Refresh employees from server to get updated data
      await getEmployees();

      selectedEmployees.value = [];
      refreshKey.value += 1;
    } catch (error) {
      console.error("Error in bulk change status:", error);
      throw error;
    }
  };

  const bulkRehireEmployees = async (
    employeeIds: string[],
    rehireData: {
      rehireDate: string;
      department: string;
      position: string;
      jobLevel: JobLevel;
      salary: number;
      employmentType: EmploymentType;
      managerId: string;
      managerName: string;
      notes: string;
    }
  ): Promise<void> => {
    try {
      const response = await apiPost("/api/bulk/rehire-employees", {
        employeeIds,
        rehireData,
      });

      console.log("Bulk rehire employees response:", response);

      // Refresh employees from server to get updated data
      await getEmployees();

      selectedEmployees.value = [];
      refreshKey.value += 1;
    } catch (error) {
      console.error("Error in bulk rehire employees:", error);
      throw error;
    }
  };

  const bulkUpdateTrainingStatus = async (
    employeeIds: string[],
    newTrainingStatus: TrainingStatus,
    trainingData: {
      trainingProgram: string;
      startDate: string;
      completionDate: string;
      effectiveDate: string;
      notes: string;
    }
  ): Promise<void> => {
    try {
      const response = await apiPost("/api/bulk/update-training-status", {
        employeeIds,
        newTrainingStatus,
        trainingData,
      });

      console.log("Bulk update training status response:", response);

      // Refresh employees from server to get updated data
      await getEmployees();

      selectedEmployees.value = [];
      refreshKey.value += 1;
    } catch (error) {
      console.error("Error in bulk update training status:", error);
      throw error;
    }
  };

  // Performance Review Methods
  const getPerformanceReviews = async (): Promise<Employee[]> => {
    try {
      const data = await apiGet("/api/performance/reviews");
      return data;
    } catch (error) {
      console.error("Error fetching performance reviews:", error);
      // Fallback to local filtering
      return employees.value.filter(
        (employee) =>
          employee.performanceHistory && employee.performanceHistory.length > 0
      );
    }
  };

  const getOverdueReviews = async (): Promise<Employee[]> => {
    try {
      const data = await apiGet("/api/performance/overdue");
      return data;
    } catch (error) {
      console.error("Error fetching overdue reviews:", error);
      // Fallback to local filtering
      const today = dayjs();
      return employees.value
        .filter((employee) => employee.nextReviewDate)
        .map((employee) => {
          const nextReview = dayjs(employee.nextReviewDate);
          const daysOverdue = today.diff(nextReview, "day");
          const reviewStatus:
            | "current"
            | "due_soon"
            | "overdue"
            | "never_reviewed" =
            daysOverdue > 0
              ? "overdue"
              : daysOverdue > -30
              ? "due_soon"
              : "current";

          return {
            ...employee,
            daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
            reviewStatus,
          };
        })
        .filter((employee) => employee.reviewStatus === "overdue");
    }
  };

  const getPerformanceAnalytics = async (): Promise<PerformanceAnalytics> => {
    try {
      const data = await apiGet("/api/performance/analytics");
      return data;
    } catch (error) {
      console.error("Error fetching performance analytics:", error);
      // Fallback to local calculation
      const activeEmployees = employees.value.filter(
        (emp) => emp.status === "Active"
      );
      const reviewedEmployees = activeEmployees.filter(
        (emp) => emp.performanceHistory && emp.performanceHistory.length > 0
      );

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
    }
  };

  const getReviewStatusList = async (): Promise<Employee[]> => {
    const today = dayjs();
    return employees.value
      .filter((employee) => employee.status === "Active")
      .map((employee) => {
        let reviewStatus:
          | "current"
          | "due_soon"
          | "overdue"
          | "never_reviewed" = "never_reviewed";
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
          ...employee,
          daysOverdue,
          reviewStatus,
        };
      });
  };

  return {
    refreshKey,
    selectedEmployees,
    setSelectedEmployees,
    removeSelectedEmployee,
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
    bulkAssignManager,
    bulkConvertEmploymentType,
    bulkChangeStatus,
    bulkRehireEmployees,
    bulkUpdateTrainingStatus,
    // Performance Review Methods
    getPerformanceReviews,
    getOverdueReviews,
    getPerformanceAnalytics,
    getReviewStatusList,
    getEmployees,
    getManagers,
    searchEmployees,
  };
});
