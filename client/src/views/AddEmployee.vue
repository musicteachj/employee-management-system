<template>
  <v-row>
    <v-col cols="12" class="pa-2">
      <v-card>
        <v-card-title class="py-3">
          <h5 class="text-h5">Add New Employee</h5>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form @submit.prevent="onSubmit">
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
                          v-model="firstName"
                          label="First Name *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.firstName"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="lastName"
                          label="Last Name *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.lastName"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalEmail"
                          label="Personal Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.personalEmail"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="workEmail"
                          label="Work Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.workEmail"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="phoneNumber"
                          label="Phone Number *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.phoneNumber"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="dateOfBirth"
                          label="Date of Birth"
                          type="date"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.dateOfBirth"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="address"
                          label="Address *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.address"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="city"
                          label="City *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.city"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="state"
                          label="State *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.state"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="country"
                          label="Country *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.country"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="emergencyContactName"
                          label="Emergency Contact Name *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.emergencyContactName"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="emergencyContactPhone"
                          label="Emergency Contact Phone *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.emergencyContactPhone"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="socialSecurityNumber"
                          label="Social Security Number"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.socialSecurityNumber"
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
                        <v-select
                          v-model="department"
                          :items="departmentOptions"
                          label="Department *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.department"
                          item-title="title"
                          item-value="value"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="position"
                          label="Position *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.position"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="jobLevel"
                          :items="jobLevels"
                          label="Job Level *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.jobLevel"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="employmentType"
                          :items="employmentTypes"
                          label="Employment Type *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.employmentType"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="workLocation"
                          :items="workLocations"
                          label="Work Location *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.workLocation"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="managerId"
                          :items="filteredManagerOptions"
                          label="Manager"
                          variant="outlined"
                          density="compact"
                          :hint="
                            !managerId
                              ? 'Select a manager or leave empty if none assigned yet'
                              : ''
                          "
                          :error-messages="errors.managerId"
                          item-title="title"
                          item-value="value"
                          clearable
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="hireDate"
                          label="Hire Date *"
                          type="date"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.hireDate"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="probationEndDate"
                          label="Probation End Date"
                          type="date"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.probationEndDate"
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
                          v-model.number="salary"
                          label="Salary *"
                          type="number"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.salary"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="paygrade"
                          label="Pay Grade *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.paygrade"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="benefitsEligibile"
                          :items="benefitsEligibleOptions"
                          label="Benefits Eligible *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.benefitsEligibile"
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
                          v-model="performanceRating"
                          :items="performanceRatings"
                          label="Performance Rating *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.performanceRating"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="trainingStatus"
                          :items="trainingStatuses"
                          label="Training Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.trainingStatus"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="developmentNotes"
                          label="Development Notes *"
                          required
                          variant="outlined"
                          rows="2"
                          density="compact"
                          :error-messages="errors.developmentNotes"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="nextReviewDate"
                          label="Next Review Date"
                          type="date"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.nextReviewDate"
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
                          v-model="active"
                          :items="activeStatuses"
                          label="Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.active"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="backgroundCheckStatus"
                          :items="backgroundCheckStatuses"
                          label="Background Check Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.backgroundCheckStatus"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="source"
                          :items="sources"
                          label="Source *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.source"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="sourceId"
                          label="Source ID"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.sourceId"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="createdBy"
                          label="Created By"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.createdBy"
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
                          v-model="hrAssignmentAssignedTo"
                          label="Assigned To *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors['hrAssignment.assignedTo']"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="hrAssignmentManagerEmail"
                          label="Manager Email *"
                          type="email"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors['hrAssignment.managerEmail']"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="hrAssignmentReviewComments"
                          label="Review Comments"
                          variant="outlined"
                          rows="2"
                          density="compact"
                          :error-messages="
                            errors['hrAssignment.reviewComments']
                          "
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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useAppStore } from "../stores/app";
import type {
  Employee,
  JobLevel,
  EmploymentType,
  WorkLocation,
  BenefitsEligible,
  PerformanceRating,
  TrainingStatus,
  BackgroundCheckStatus,
  EmployeeSource,
} from "../types";
import {
  addEmployeeSchema,
  type AddEmployeeFormData,
} from "../schemas/employee";

const router = useRouter();
const appStore = useAppStore();
const isSubmitting = ref(false);

// VeeValidate form setup
const {
  handleSubmit,
  errors,
  defineField,
  resetForm: resetVeeForm,
} = useForm({
  validationSchema: toTypedSchema(addEmployeeSchema),
  initialValues: {
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
    department: "",
    position: "",
    jobLevel: "Entry" as JobLevel,
    employmentType: "Full-time" as EmploymentType,
    workLocation: "Office" as WorkLocation,
    managerId: "",
    managerName: "",
    hireDate: "",
    probationEndDate: "",
    salary: 0,
    currency: 1,
    paygrade: "",
    benefitsEligibile: "Yes" as BenefitsEligible,
    performanceRating: "Unrated" as PerformanceRating,
    trainingStatus: "Not Started" as TrainingStatus,
    developmentNotes: "",
    nextReviewDate: "",
    backgroundCheckStatus: "Not Started" as BackgroundCheckStatus,
    docType: "employee" as const,
    source: "HR" as EmployeeSource,
    sourceId: "",
    createdBy: "",
    hrAssignment: {
      assignedTo: "",
      managerEmail: "",
      reviewComments: "",
    },
  } as AddEmployeeFormData,
});

// Define form fields with VeeValidate
const [firstName] = defineField("firstName");
const [lastName] = defineField("lastName");
const [personalEmail] = defineField("personalEmail");
const [workEmail] = defineField("workEmail");
const [phoneNumber] = defineField("phoneNumber");
const [emergencyContactName] = defineField("emergencyContactName");
const [emergencyContactPhone] = defineField("emergencyContactPhone");
const [address] = defineField("address");
const [city] = defineField("city");
const [state] = defineField("state");
const [country] = defineField("country");
const [dateOfBirth] = defineField("dateOfBirth");
const [socialSecurityNumber] = defineField("socialSecurityNumber");
const [department] = defineField("department");
const [position] = defineField("position");
const [jobLevel] = defineField("jobLevel");
const [employmentType] = defineField("employmentType");
const [workLocation] = defineField("workLocation");
const [managerId] = defineField("managerId");
const [managerName] = defineField("managerName");
const [hireDate] = defineField("hireDate");
const [probationEndDate] = defineField("probationEndDate");
const [salary] = defineField("salary");
const [paygrade] = defineField("paygrade");
const [benefitsEligibile] = defineField("benefitsEligibile");
const [performanceRating] = defineField("performanceRating");
const [trainingStatus] = defineField("trainingStatus");
const [developmentNotes] = defineField("developmentNotes");
const [nextReviewDate] = defineField("nextReviewDate");
const [active] = defineField("active");
const [backgroundCheckStatus] = defineField("backgroundCheckStatus");
const [source] = defineField("source");
const [sourceId] = defineField("sourceId");
const [createdBy] = defineField("createdBy");
const [hrAssignmentAssignedTo] = defineField("hrAssignment.assignedTo");
const [hrAssignmentManagerEmail] = defineField("hrAssignment.managerEmail");
const [hrAssignmentReviewComments] = defineField("hrAssignment.reviewComments");

// Computed property for full name
const fullName = computed(() => {
  return `${firstName.value || ""} ${lastName.value || ""}`.trim();
});

// Form options from store
const {
  jobLevels,
  employmentTypes,
  workLocations,
  activeStatuses,
  performanceRatings,
  trainingStatuses,
  backgroundCheckStatuses,
  sources,
  benefitsEligibleOptions,
} = appStore.formOptions;

// Department and manager options
const departmentOptions = computed(() =>
  appStore.departments.map((dept) => ({
    title: dept.name,
    value: dept.name,
    subtitle: dept.description,
  }))
);

const managerOptions = computed(() =>
  appStore.managers.map((manager) => ({
    title: manager.name,
    value: manager.id,
    subtitle: `${manager.department} - ${manager.email}`,
  }))
);

// Filtered managers based on selected department
const filteredManagerOptions = computed(() => {
  if (!department.value) return managerOptions.value;
  return managerOptions.value.filter((manager) => {
    const managerData = appStore.managers.find((m) => m.id === manager.value);
    return managerData?.department === department.value;
  });
});

// Watchers
// Auto-populate manager name when manager is selected
watch(managerId, (newManagerId) => {
  if (newManagerId) {
    const selectedManager = appStore.managers.find(
      (m) => m.id === newManagerId
    );
    if (selectedManager) {
      managerName.value = selectedManager.name;
    }
  } else {
    // Handle both null and undefined by setting to empty string
    managerName.value = "";
  }
});

// Clear manager selection when department changes
watch(department, () => {
  managerId.value = "";
  managerName.value = "";
});

// Utility functions
const generateEmployeeId = (): string => {
  // Get existing employee IDs to ensure uniqueness
  const existingIds = appStore.employees.map((emp) => emp.employeeId);

  // Generate ID in format: EMP + 3-digit number (e.g., EMP001, EMP002)
  let counter = 1;
  let newId = `EMP${counter.toString().padStart(3, "0")}`;

  // Keep incrementing until we find a unique ID
  while (existingIds.includes(newId)) {
    counter++;
    newId = `EMP${counter.toString().padStart(3, "0")}`;
  }

  return newId;
};

// Form methods
const resetForm = () => {
  resetVeeForm();
};

const onSubmit = handleSubmit(async (values: AddEmployeeFormData) => {
  isSubmitting.value = true;

  try {
    // Generate unique Employee ID
    const employeeId = generateEmployeeId();

    // Clean up null values - convert to empty strings or undefined
    const cleanedValues = {
      ...values,
      managerId: values.managerId || undefined,
      managerName: values.managerName || undefined,
    };

    // Prepare employee data
    const newEmployee: Employee = {
      ...cleanedValues,
      employeeId,
      fullName: fullName.value,
      _id: `emp_${Date.now()}`, // Simple ID generation
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
      lastProfileUpdate: new Date().toISOString().split("T")[0],
      hrAssignment: {
        ...values.hrAssignment,
        assignedDate: new Date().toISOString().split("T")[0],
      },
      onboarding: {
        author: values.createdBy || "hr_admin",
        authorType: "HR",
        eventDate: values.hireDate,
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
});
</script>
