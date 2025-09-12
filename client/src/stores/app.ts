import { defineStore } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";
import type { Employee } from "../types";

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
      managerId: "emp_003",
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

  const getNewHires = async () => {
    return employees.value;
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

  return {
    employees,
    getNewHires,
    getRecentHires,
  };
});
