<template>
  <v-row>
    <v-col cols="12" class="pa-2">
      <v-card>
        <!-- Header with navigation and actions -->
        <v-card-title class="py-3 d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-btn
              v-if="isEditMode"
              icon="mdi-arrow-left"
              variant="text"
              @click="backClicked"
              class="mr-2"
            />
            <h5 class="text-h5">{{ pageTitle }}</h5>
          </div>
          <div class="d-flex gap-3">
            <!-- Add Mode Buttons -->
            <template v-if="isAddMode">
              <v-btn
                color="grey"
                variant="outlined"
                @click="resetForm"
                class="mr-2"
              >
                <v-icon class="mr-2" size="small">mdi-refresh</v-icon>
                Reset
              </v-btn>
              <v-btn color="primary" @click="saveEmployee" :loading="isSaving">
                <v-icon class="mr-2" size="small">mdi-content-save</v-icon>
                Add Employee
              </v-btn>
            </template>

            <!-- Edit Mode Buttons -->
            <template v-else-if="isEditMode">
              <v-btn
                v-if="!isFormEditable"
                color="primary"
                variant="outlined"
                @click="toggleEditMode"
                :disabled="!employee"
              >
                <v-icon class="mr-2" size="small">mdi-pencil</v-icon>
                Edit
              </v-btn>
              <template v-else>
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="cancelEdit"
                  :disabled="isSaving"
                  class="mr-2"
                >
                  <v-icon class="mr-2" size="small">mdi-close</v-icon>
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  @click="saveEmployee"
                  :loading="isSaving"
                  :disabled="!employee"
                >
                  <v-icon class="mr-2" size="small">mdi-content-save</v-icon>
                  Save Changes
                </v-btn>
              </template>
            </template>
          </div>
        </v-card-title>

        <!-- Error Summary -->
        <v-alert
          v-if="errorCount > 0 && attemptedSave"
          type="error"
          variant="tonal"
          class="ma-4 mb-0"
          border="start"
          closable
          @click:close="attemptedSave = false"
          icon="mdi-alert-circle"
        >
          <div class="d-flex align-center">
            <div>
              <strong
                >{{ errorCount }} validation error{{
                  errorCount > 1 ? "s" : ""
                }}
                found</strong
              >
              <div class="text-caption mt-1">
                Please review and correct the highlighted fields below before
                saving.
              </div>
            </div>
          </div>
        </v-alert>

        <v-card-text class="pa-4" v-if="employee || isAddMode">
          <v-form @submit.prevent="saveEmployee">
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
                          :error-messages="errors.emergencyContactPhone"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="socialSecurityNumber"
                          label="Social Security Number"
                          variant="outlined"
                          density="compact"
                          :readonly="isEditMode && !isFormEditable"
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
                      <!-- Readonly sensitive fields in edit mode -->
                      <v-col cols="12" md="6" v-if="isEditMode">
                        <v-text-field
                          :model-value="employee?.employeeId"
                          label="Employee ID"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <v-col cols="12" md="6" v-if="isEditMode">
                        <v-text-field
                          :model-value="employee?.hireDate"
                          label="Hire Date"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <!-- Editable fields -->
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
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
                        <v-text-field
                          v-else
                          :model-value="department"
                          label="Department"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="position"
                          label="Position *"
                          required
                          variant="outlined"
                          density="compact"
                          :readonly="isEditMode && !isFormEditable"
                          :error-messages="errors.position"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="jobLevel"
                          :items="jobLevels"
                          label="Job Level *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.jobLevel"
                        />
                        <v-text-field
                          v-else
                          :model-value="jobLevel"
                          label="Job Level"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="employmentType"
                          :items="employmentTypes"
                          label="Employment Type *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.employmentType"
                        />
                        <v-text-field
                          v-else
                          :model-value="employmentType"
                          label="Employment Type"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="workLocation"
                          :items="workLocations"
                          label="Work Location *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.workLocation"
                        />
                        <v-text-field
                          v-else
                          :model-value="workLocation"
                          label="Work Location"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
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
                        <v-text-field
                          v-else
                          :model-value="managerName || 'No manager assigned'"
                          label="Manager"
                          variant="outlined"
                          density="compact"
                          readonly
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
                          :error-messages="errors.paygrade"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="benefitsEligibile"
                          :items="benefitsEligibleOptions"
                          label="Benefits Eligible *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.benefitsEligibile"
                        />
                        <v-text-field
                          v-else
                          :model-value="benefitsEligibile"
                          label="Benefits Eligible"
                          variant="outlined"
                          density="compact"
                          readonly
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
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="performanceRating"
                          :items="performanceRatings"
                          label="Performance Rating *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.performanceRating"
                        />
                        <v-text-field
                          v-else
                          :model-value="performanceRating"
                          label="Performance Rating"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="trainingStatus"
                          :items="trainingStatuses"
                          label="Training Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.trainingStatus"
                        />
                        <v-text-field
                          v-else
                          :model-value="trainingStatus"
                          label="Training Status"
                          variant="outlined"
                          density="compact"
                          readonly
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="active"
                          :items="activeStatuses"
                          label="Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.active"
                        />
                        <v-text-field
                          v-else
                          :model-value="active"
                          label="Status"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode || (isEditMode && isFormEditable)"
                          v-model="backgroundCheckStatus"
                          :items="backgroundCheckStatuses"
                          label="Background Check Status *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.backgroundCheckStatus"
                        />
                        <v-text-field
                          v-else
                          :model-value="backgroundCheckStatus"
                          label="Background Check Status"
                          variant="outlined"
                          density="compact"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-if="isAddMode"
                          v-model="source"
                          :items="sources"
                          label="Source *"
                          required
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.source"
                        />
                        <v-text-field
                          v-else
                          :model-value="source"
                          label="Source"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-if="isAddMode"
                          v-model="sourceId"
                          label="Source ID"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.sourceId"
                        />
                        <v-text-field
                          v-else
                          :model-value="sourceId || 'N/A'"
                          label="Source ID"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-if="isAddMode"
                          v-model="createdBy"
                          label="Created By"
                          variant="outlined"
                          density="compact"
                          :error-messages="errors.createdBy"
                        />
                        <v-text-field
                          v-else
                          :model-value="createdBy || 'N/A'"
                          label="Created By"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <v-col cols="12" md="6" v-if="isEditMode">
                        <v-text-field
                          :model-value="employee?.createdOn || 'N/A'"
                          label="Created On"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
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
                          :readonly="isEditMode && !isFormEditable"
                          :error-messages="
                            errors['hrAssignment.reviewComments']
                          "
                        />
                      </v-col>
                      <!-- Readonly HR fields in edit mode -->
                      <v-col cols="12" md="6" v-if="isEditMode">
                        <v-text-field
                          :model-value="
                            employee?.hrAssignment?.assignedDate || 'N/A'
                          "
                          label="Assigned Date"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                      <v-col cols="12" md="6" v-if="isEditMode">
                        <v-text-field
                          :model-value="
                            employee?.hrAssignment?.revalidationStatus || 'N/A'
                          "
                          label="Revalidation Status"
                          variant="outlined"
                          density="compact"
                          readonly
                          bg-color="grey-lighten-5"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- Loading state -->
        <v-card-text v-else-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" />
          <p class="mt-4">Loading employee record...</p>
        </v-card-text>

        <!-- Employee not found -->
        <v-card-text v-else class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-account-off</v-icon>
          <h3 class="mt-4">Employee Not Found</h3>
          <p class="text-grey">
            The requested employee record could not be found.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
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
const route = useRoute();
const appStore = useAppStore();

// Route and mode detection
const employeeId = computed(() => route.params.id as string);
const isAddMode = computed(() => route.name === "employee-new");
const isEditMode = computed(() => route.name === "employee-edit");
const isFormEditable = ref(false);
const isSaving = ref(false);
const loading = ref(false);
const attemptedSave = ref(false);

// Page title
const pageTitle = computed(() => {
  if (isAddMode.value) return "Add New Employee";
  if (isEditMode.value && !isFormEditable.value) return "Employee Record";
  if (isEditMode.value && isFormEditable.value) return "Edit Employee";
  return "Employee";
});

// Get employee from store (only in edit mode)
const employee = computed(() => {
  if (!isEditMode.value || !employeeId.value) return null;
  return appStore.employees.find((emp) => emp._id === employeeId.value);
});

// VeeValidate form setup - use consistent schema to avoid type issues
const {
  errors,
  defineField,
  resetForm: resetVeeForm,
  validate,
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

// Computed property for error count
const errorCount = computed(() => {
  return Object.keys(errors.value).length;
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

// Initialize form with employee data in edit mode
watch(
  employee,
  (newEmployee) => {
    if (newEmployee && isEditMode.value) {
      // Populate form fields with employee data
      firstName.value = newEmployee.firstName;
      lastName.value = newEmployee.lastName;
      personalEmail.value = newEmployee.personalEmail;
      workEmail.value = newEmployee.workEmail;
      phoneNumber.value = newEmployee.phoneNumber;
      emergencyContactName.value = newEmployee.emergencyContactName;
      emergencyContactPhone.value = newEmployee.emergencyContactPhone;
      address.value = newEmployee.address;
      city.value = newEmployee.city;
      state.value = newEmployee.state;
      country.value = newEmployee.country;
      dateOfBirth.value = newEmployee.dateOfBirth || "";
      socialSecurityNumber.value = newEmployee.socialSecurityNumber || "";
      department.value = newEmployee.department;
      position.value = newEmployee.position;
      jobLevel.value = newEmployee.jobLevel;
      employmentType.value = newEmployee.employmentType;
      workLocation.value = newEmployee.workLocation;
      managerId.value = newEmployee.managerId || "";
      managerName.value = newEmployee.managerName || "";
      hireDate.value = newEmployee.hireDate;
      probationEndDate.value = newEmployee.probationEndDate || "";
      salary.value = newEmployee.salary;
      paygrade.value = newEmployee.paygrade;
      benefitsEligibile.value = newEmployee.benefitsEligibile;
      performanceRating.value = newEmployee.performanceRating;
      trainingStatus.value = newEmployee.trainingStatus;
      developmentNotes.value = newEmployee.developmentNotes;
      nextReviewDate.value = newEmployee.nextReviewDate || "";
      active.value = newEmployee.active;
      backgroundCheckStatus.value = newEmployee.backgroundCheckStatus;
      source.value = newEmployee.source;
      sourceId.value = newEmployee.sourceId || "";
      createdBy.value = newEmployee.createdBy || "";
      hrAssignmentAssignedTo.value = newEmployee.hrAssignment.assignedTo;
      hrAssignmentManagerEmail.value = newEmployee.hrAssignment.managerEmail;
      hrAssignmentReviewComments.value =
        newEmployee.hrAssignment.reviewComments || "";
    }
  },
  { immediate: true }
);

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
    managerName.value = "";
  }
});

// Clear manager selection when department changes
watch(department, () => {
  managerId.value = "";
  managerName.value = "";
});

// Clear form when switching to add mode
watch(
  isAddMode,
  (newIsAddMode) => {
    if (newIsAddMode) {
      // Reset all form fields to initial values when switching to add mode
      resetVeeForm();
      attemptedSave.value = false;
    }
  },
  { immediate: true }
);

// Utility functions
const generateEmployeeId = (): string => {
  const existingIds = appStore.employees.map((emp) => emp.employeeId);
  let counter = 1;
  let newId = `EMP${counter.toString().padStart(3, "0")}`;

  while (existingIds.includes(newId)) {
    counter++;
    newId = `EMP${counter.toString().padStart(3, "0")}`;
  }

  return newId;
};

// Methods
const backClicked = () => {
  router.back();
};

const toggleEditMode = () => {
  isFormEditable.value = true;
  attemptedSave.value = false; // Clear any previous save attempts
  // Don't reset form values, just clear validation errors
  // The form values should already be populated from the employee data
};

const cancelEdit = () => {
  if (employee.value) {
    isFormEditable.value = false;
    attemptedSave.value = false; // Clear any previous save attempts
    // Clear validation errors and re-populate with original data
    resetVeeForm();
    // Re-trigger the employee watcher to repopulate form
    const emp = employee.value;
    if (emp) {
      // Repopulate form fields with original employee data
      firstName.value = emp.firstName;
      lastName.value = emp.lastName;
      personalEmail.value = emp.personalEmail;
      workEmail.value = emp.workEmail;
      phoneNumber.value = emp.phoneNumber;
      emergencyContactName.value = emp.emergencyContactName;
      emergencyContactPhone.value = emp.emergencyContactPhone;
      address.value = emp.address;
      city.value = emp.city;
      state.value = emp.state;
      country.value = emp.country;
      dateOfBirth.value = emp.dateOfBirth || "";
      socialSecurityNumber.value = emp.socialSecurityNumber || "";
      department.value = emp.department;
      position.value = emp.position;
      jobLevel.value = emp.jobLevel;
      employmentType.value = emp.employmentType;
      workLocation.value = emp.workLocation;
      managerId.value = emp.managerId || "";
      managerName.value = emp.managerName || "";
      hireDate.value = emp.hireDate;
      probationEndDate.value = emp.probationEndDate || "";
      salary.value = emp.salary;
      paygrade.value = emp.paygrade;
      benefitsEligibile.value = emp.benefitsEligibile;
      performanceRating.value = emp.performanceRating;
      trainingStatus.value = emp.trainingStatus;
      developmentNotes.value = emp.developmentNotes;
      nextReviewDate.value = emp.nextReviewDate || "";
      active.value = emp.active;
      backgroundCheckStatus.value = emp.backgroundCheckStatus;
      source.value = emp.source;
      sourceId.value = emp.sourceId || "";
      createdBy.value = emp.createdBy || "";
      hrAssignmentAssignedTo.value = emp.hrAssignment.assignedTo;
      hrAssignmentManagerEmail.value = emp.hrAssignment.managerEmail;
      hrAssignmentReviewComments.value = emp.hrAssignment.reviewComments || "";
    }
  }
};

const resetForm = () => {
  resetVeeForm();
};

const saveEmployee = async () => {
  isSaving.value = true;
  attemptedSave.value = true;

  try {
    if (isAddMode.value) {
      // Validate all fields for add mode
      const { valid } = await validate();
      if (!valid) {
        isSaving.value = false;
        return;
      }

      // Add new employee
      const employeeId = generateEmployeeId();

      const cleanedValues = {
        managerId: managerId.value || undefined,
        managerName: managerName.value || undefined,
      };

      const newEmployee: Employee = {
        firstName: firstName.value,
        lastName: lastName.value,
        fullName: fullName.value,
        personalEmail: personalEmail.value,
        workEmail: workEmail.value,
        phoneNumber: phoneNumber.value,
        emergencyContactName: emergencyContactName.value,
        emergencyContactPhone: emergencyContactPhone.value,
        address: address.value,
        city: city.value,
        state: state.value,
        country: country.value,
        dateOfBirth: dateOfBirth.value || undefined,
        socialSecurityNumber: socialSecurityNumber.value || undefined,
        department: department.value,
        position: position.value,
        jobLevel: jobLevel.value,
        employmentType: employmentType.value,
        workLocation: workLocation.value,
        ...cleanedValues,
        hireDate: hireDate.value,
        probationEndDate: probationEndDate.value || undefined,
        salary: salary.value,
        currency: 1,
        paygrade: paygrade.value,
        benefitsEligibile: benefitsEligibile.value,
        performanceRating: performanceRating.value,
        trainingStatus: trainingStatus.value,
        developmentNotes: developmentNotes.value,
        nextReviewDate: nextReviewDate.value || undefined,
        active: active.value,
        backgroundCheckStatus: backgroundCheckStatus.value,
        docType: "employee" as const,
        source: source.value,
        sourceId: sourceId.value || undefined,
        createdBy: createdBy.value || undefined,
        employeeId,
        _id: `emp_${Date.now()}`,
        createdOn: new Date().toISOString().split("T")[0],
        updatedOn: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
        lastProfileUpdate: new Date().toISOString().split("T")[0],
        hrAssignment: {
          assignedTo: hrAssignmentAssignedTo.value,
          managerEmail: hrAssignmentManagerEmail.value,
          reviewComments: hrAssignmentReviewComments.value || undefined,
          assignedDate: new Date().toISOString().split("T")[0],
        },
        onboarding: {
          author: createdBy.value || "hr_admin",
          authorType: "HR",
          eventDate: hireDate.value,
          eventName: "Onboarding",
          onboardingKey: `ONB_${Date.now()}`,
        },
      } as Employee;

      appStore.addEmployee(newEmployee);
      attemptedSave.value = false; // Clear the flag on successful save
      router.push("/");
    } else if (isEditMode.value && employee.value) {
      // Validate only the fields that are required and currently editable
      const validationErrors = Object.keys(errors.value);
      if (validationErrors.length > 0) {
        console.log("Validation errors:", validationErrors, errors.value);
        isSaving.value = false;
        return;
      }

      // Since validation passed, we can safely use the form values
      // For required fields, they should have values; for optional fields, use fallback
      const updatedEmployee: Employee = {
        ...employee.value,
        // Required fields - should have values if validation passed
        firstName: firstName.value || employee.value.firstName,
        lastName: lastName.value || employee.value.lastName,
        personalEmail: personalEmail.value || employee.value.personalEmail,
        workEmail: workEmail.value || employee.value.workEmail,
        phoneNumber: phoneNumber.value || employee.value.phoneNumber,
        emergencyContactName:
          emergencyContactName.value || employee.value.emergencyContactName,
        emergencyContactPhone:
          emergencyContactPhone.value || employee.value.emergencyContactPhone,
        address: address.value || employee.value.address,
        city: city.value || employee.value.city,
        state: state.value || employee.value.state,
        country: country.value || employee.value.country,
        department: department.value || employee.value.department,
        position: position.value || employee.value.position,
        jobLevel: jobLevel.value || employee.value.jobLevel,
        employmentType: employmentType.value || employee.value.employmentType,
        workLocation: workLocation.value || employee.value.workLocation,
        salary: salary.value || employee.value.salary,
        paygrade: paygrade.value || employee.value.paygrade,
        benefitsEligibile:
          benefitsEligibile.value || employee.value.benefitsEligibile,
        performanceRating:
          performanceRating.value || employee.value.performanceRating,
        trainingStatus: trainingStatus.value || employee.value.trainingStatus,
        developmentNotes:
          developmentNotes.value || employee.value.developmentNotes,
        active: active.value || employee.value.active,
        backgroundCheckStatus:
          backgroundCheckStatus.value || employee.value.backgroundCheckStatus,

        // Update full name
        fullName: `${firstName.value || employee.value.firstName} ${
          lastName.value || employee.value.lastName
        }`.trim(),

        // Optional fields
        dateOfBirth: dateOfBirth.value || employee.value.dateOfBirth,
        socialSecurityNumber:
          socialSecurityNumber.value || employee.value.socialSecurityNumber,
        managerId: managerId.value || employee.value.managerId,
        managerName: managerName.value || employee.value.managerName,
        probationEndDate:
          probationEndDate.value || employee.value.probationEndDate,
        nextReviewDate: nextReviewDate.value || employee.value.nextReviewDate,

        // HR Assignment
        hrAssignment: {
          ...employee.value.hrAssignment,
          assignedTo:
            hrAssignmentAssignedTo.value ||
            employee.value.hrAssignment.assignedTo,
          managerEmail:
            hrAssignmentManagerEmail.value ||
            employee.value.hrAssignment.managerEmail,
          reviewComments:
            hrAssignmentReviewComments.value ||
            employee.value.hrAssignment.reviewComments,
        },
      };

      appStore.updateEmployee(updatedEmployee);
      attemptedSave.value = false; // Clear the flag on successful save
      isFormEditable.value = false;
    }
  } catch (error) {
    console.error("Error saving employee:", error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.bg-grey-lighten-5 {
  background-color: #fafafa !important;
}
</style>
