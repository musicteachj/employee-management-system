<template>
  <v-row>
    <v-col cols="12" class="pa-2">
      <v-card>
        <v-card-title class="py-3">
          <h5 class="text-h5">Add New Employee</h5>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="handleSubmit">
            <!-- Personal Information Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-account</v-icon>
                    Personal Information
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.firstName"
                          label="First Name *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.lastName"
                          label="Last Name *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.personalEmail"
                          label="Personal Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.workEmail"
                          label="Work Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.phoneNumber"
                          label="Phone Number *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.dateOfBirth"
                          label="Date of Birth"
                          type="date"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="employee.address"
                          label="Address *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="employee.city"
                          label="City *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="employee.state"
                          label="State *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="employee.country"
                          label="Country *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.emergencyContactName"
                          label="Emergency Contact Name *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.emergencyContactPhone"
                          label="Emergency Contact Phone *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.socialSecurityNumber"
                          label="Social Security Number"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Employment Information Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-briefcase</v-icon>
                    Employment Information
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.employeeId"
                          label="Employee ID *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.department"
                          label="Department *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.position"
                          label="Position *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.jobLevel"
                          :items="jobLevels"
                          label="Job Level *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.employmentType"
                          :items="employmentTypes"
                          label="Employment Type *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.workLocation"
                          :items="workLocations"
                          label="Work Location *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.managerId"
                          label="Manager ID"
                          variant="outlined"
                          density="compact"
                          hint="Leave empty if no manager assigned yet"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.managerName"
                          label="Manager Name"
                          variant="outlined"
                          density="compact"
                          hint="Leave empty if no manager assigned yet"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.hireDate"
                          label="Hire Date *"
                          type="date"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.probationEndDate"
                          label="Probation End Date"
                          type="date"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Compensation & Benefits Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-currency-usd</v-icon>
                    Compensation & Benefits
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="employee.salary"
                          label="Salary *"
                          type="number"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.paygrade"
                          label="Pay Grade *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.benefitsEligibile"
                          :items="['Yes', 'No']"
                          label="Benefits Eligible *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Performance & Development Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-chart-line</v-icon>
                    Performance & Development
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.performanceRating"
                          :items="performanceRatings"
                          label="Performance Rating *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.trainingStatus"
                          :items="trainingStatuses"
                          label="Training Status *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="employee.developmentNotes"
                          label="Development Notes *"
                          required
                          variant="outlined"
                          rows="2"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.nextReviewDate"
                          label="Next Review Date"
                          type="date"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Compliance & System Information Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-shield-check</v-icon>
                    Compliance & System Information
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.active"
                          :items="activeStatuses"
                          label="Status *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.backgroundCheckStatus"
                          :items="backgroundCheckStatuses"
                          label="Background Check Status *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employee.source"
                          :items="sources"
                          label="Source *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.sourceId"
                          label="Source ID"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.createdBy"
                          label="Created By"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- HR Assignment Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-3">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4 py-2">
                    <v-icon class="mr-2" size="small">mdi-account-tie</v-icon>
                    HR Assignment
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.hrAssignment!.assignedTo"
                          label="Assigned To *"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.hrAssignment!.managerEmail"
                          label="Manager Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="employee.hrAssignment!.reviewComments"
                          label="Review Comments"
                          variant="outlined"
                          rows="2"
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Form Actions -->
            <v-row>
              <v-col cols="12" class="d-flex justify-end pt-4">
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="resetForm"
                  class="mr-4"
                >
                  <v-icon class="mr-2" size="small">mdi-refresh</v-icon>
                  Reset
                </v-btn>
                <v-btn color="primary" type="submit" :loading="isSubmitting">
                  <v-icon class="mr-2" size="small">mdi-content-save</v-icon>
                  Add Employee
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";
import type { Employee, JobLevel } from "../types";

const router = useRouter();
const appStore = useAppStore();
const form = ref();
const isSubmitting = ref(false);

// Form data
const employee = ref<Partial<Employee>>({
  active: "Active",
  firstName: "",
  lastName: "",
  personalEmail: "",
  workEmail: "",
  phoneNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  dateOfBirth: "",
  socialSecurityNumber: "",
  employeeId: "",
  department: "",
  position: "",
  jobLevel: "Entry",
  employmentType: "Full-time",
  workLocation: "Office",
  managerId: "",
  managerName: "",
  hireDate: "",
  probationEndDate: "",
  salary: 0,
  currency: 1,
  paygrade: "",
  benefitsEligibile: "Yes",
  performanceRating: "Unrated",
  trainingStatus: "Not Started",
  developmentNotes: "",
  nextReviewDate: "",
  backgroundCheckStatus: "Not Started",
  docType: "employee",
  source: "HR",
  sourceId: "",
  createdBy: "",
  hrAssignment: {
    assignedTo: "",
    managerEmail: "",
    reviewComments: "",
  },
});

// Computed property for full name
const fullName = computed(() => {
  return `${employee.value.firstName || ""} ${
    employee.value.lastName || ""
  }`.trim();
});

// Form options
const jobLevels: JobLevel[] = [
  "Entry",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level",
  "CEO",
];
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
  "Temporary",
];
const workLocations = ["Office", "Remote", "Hybrid"];
const activeStatuses = ["Active", "On Leave", "Terminated"];
const performanceRatings = [
  "Exceeds Expectations",
  "Meets Expectations",
  "Needs Improvement",
  "Unsatisfactory",
  "Unrated",
];
const trainingStatuses = ["Completed", "In Progress", "Not Started"];
const backgroundCheckStatuses = [
  "Completed",
  "In Progress",
  "Not Started",
  "Failed",
];
const sources = ["HR", "Onboarding", "External", "Transfer", "Other"];

// Form methods
const resetForm = () => {
  if (form.value) {
    form.value.reset();
  }
  // Reset to default values
  employee.value = {
    active: "Active",
    firstName: "",
    lastName: "",
    personalEmail: "",
    workEmail: "",
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    dateOfBirth: "",
    socialSecurityNumber: "",
    employeeId: "",
    department: "",
    position: "",
    jobLevel: "Entry",
    employmentType: "Full-time",
    workLocation: "Office",
    managerId: "",
    managerName: "",
    hireDate: "",
    probationEndDate: "",
    salary: 0,
    currency: 1,
    paygrade: "",
    benefitsEligibile: "Yes",
    performanceRating: "Unrated",
    trainingStatus: "Not Started",
    developmentNotes: "",
    nextReviewDate: "",
    backgroundCheckStatus: "Not Started",
    docType: "employee",
    source: "HR",
    sourceId: "",
    createdBy: "",
    hrAssignment: {
      assignedTo: "",
      managerEmail: "",
      reviewComments: "",
    },
  };
};

const handleSubmit = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;

  try {
    // Prepare employee data
    const newEmployee: Employee = {
      ...employee.value,
      fullName: fullName.value,
      _id: `emp_${Date.now()}`, // Simple ID generation
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
      lastProfileUpdate: new Date().toISOString().split("T")[0],
      hrAssignment: {
        ...employee.value.hrAssignment!,
        assignedDate: new Date().toISOString().split("T")[0],
      },
      onboarding: {
        author: employee.value.createdBy || "hr_admin",
        authorType: "HR",
        eventDate: employee.value.hireDate,
        eventName: "Onboarding",
        onboardingKey: `ONB_${Date.now()}`,
      },
    } as Employee;

    // Add employee to store
    appStore.addEmployee(newEmployee);

    // Navigate back to home or show success message
    router.push("/");
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
