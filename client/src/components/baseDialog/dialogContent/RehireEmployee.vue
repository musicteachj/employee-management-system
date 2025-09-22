<template>
  <div class="rehire-employee-form">
    <!-- Selected Employees Summary -->
    <v-card variant="outlined" class="mb-4 summary-card dialog-summary">
      <v-card-title class="text-subtitle-1 section-header py-2">
        <v-icon class="mr-2" size="small">mdi-account-multiple</v-icon>
        Selected Employees ({{ selectedEmployees.length }})
      </v-card-title>
      <v-card-text class="pa-3">
        <!-- Empty state -->
        <div v-if="selectedEmployees.length === 0" class="empty-state">
          <v-icon size="48" color="grey-lighten-1" class="mb-3">
            mdi-account-off
          </v-icon>
          <p class="text-body-2 text-grey-darken-1 mb-0">
            No employees selected for rehiring.
          </p>
          <p class="text-caption text-grey">
            Please select terminated employees from the table to rehire them.
          </p>
        </div>

        <!-- Employee list with remove functionality -->
        <div v-else class="employee-list">
          <v-chip
            v-for="employee in selectedEmployees"
            :key="employee._id"
            class="ma-1"
            color="primary"
            variant="outlined"
            size="small"
            closable
            @click:close="removeEmployee(employee._id)"
          >
            <v-icon start icon="mdi-account" />
            {{ employee.fullName }}
            <span class="ml-2 text-caption">({{ employee.department }})</span>
          </v-chip>

          <!-- Clear all button -->
          <div class="mt-3" v-if="selectedEmployees.length > 1">
            <v-btn
              size="small"
              variant="text"
              color="error"
              @click="clearAllEmployees"
              class="text-caption"
            >
              <v-icon start size="small">mdi-close-circle</v-icon>
              Clear All
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Rehire Information Form -->
    <v-form>
      <v-card variant="outlined" class="section-card mb-4">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-account-plus</v-icon>
          Rehire Information
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="rehireDate"
                label="Rehire Date *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.rehireDate"
                class="form-field"
                color="primary"
                hint="Date when the employee will be rehired"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="newDepartment"
                :items="departmentOptions"
                label="Department *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.department"
                class="form-field"
                color="primary"
                hint="Department for the rehired employee"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newPosition"
                label="Position *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.position"
                class="form-field"
                color="primary"
                hint="Job position for the rehired employee"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="newJobLevel"
                :items="jobLevelOptions"
                label="Job Level *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.jobLevel"
                class="form-field"
                color="primary"
                hint="Job level for the rehired employee"
                persistent-hint
                item-title="text"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newSalary"
                label="Salary *"
                type="number"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.salary"
                class="form-field"
                color="primary"
                hint="Annual salary for the rehired employee"
                persistent-hint
                prefix="$"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="newEmploymentType"
                :items="employmentTypeOptions"
                label="Employment Type *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.employmentType"
                class="form-field"
                color="primary"
                hint="Employment type for the rehired employee"
                persistent-hint
                item-title="text"
                item-value="value"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Manager Assignment -->
      <v-card variant="outlined" class="section-card mb-4">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-account-tie</v-icon>
          Manager Assignment
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="selectedManagerId"
                :items="managerOptions"
                label="Select Manager"
                variant="outlined"
                density="compact"
                :error-messages="errors.managerId"
                class="form-field"
                color="primary"
                item-title="title"
                item-value="value"
                clearable
                :hint="
                  selectedManagerId
                    ? `Manager: ${getSelectedManagerInfo()}`
                    : 'Choose a manager for the rehired employee (optional)'
                "
                persistent-hint
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar size="32" color="primary">
                        <v-icon icon="mdi-account-tie" />
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.raw.subtitle
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Additional Information -->
      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-note-text</v-icon>
          Additional Information
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="rehireNotes"
                label="Rehire Notes"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.rehireNotes"
                class="form-field"
                color="primary"
                hint="Optional notes about the rehiring process"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <div class="d-flex justify-end mt-4 gap-3">
        <v-btn
          color="grey"
          variant="outlined"
          @click="dialogStore.closeAndResetDialog()"
          :disabled="isRehiring"
        >
          <v-icon class="mr-2" size="small">mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="isRehiring"
          :disabled="!isFormValid || selectedEmployees.length === 0"
          @click="rehireEmployees"
        >
          <v-icon class="mr-2" size="small">mdi-account-plus</v-icon>
          Rehire Employees
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useDialogStore } from "../../../stores/dialog";
import { useAppStore } from "../../../stores/app";
import type { Manager, JobLevel, EmploymentType } from "../../../types";

const dialogStore = useDialogStore();
const appStore = useAppStore();

// Form validation schema
const rehireEmployeeSchema = z.object({
  rehireDate: z.string().min(1, "Please select a rehire date"),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(1, "Please enter a position"),
  jobLevel: z.string().min(1, "Please select a job level"),
  salary: z.number().min(1, "Please enter a valid salary"),
  employmentType: z.string().min(1, "Please select an employment type"),
  managerId: z.string().optional(),
  rehireNotes: z.string().optional(),
});

type RehireEmployeeFormData = z.infer<typeof rehireEmployeeSchema>;

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(rehireEmployeeSchema),
  initialValues: {
    rehireDate: new Date().toISOString().split("T")[0],
    department: "",
    position: "",
    jobLevel: "",
    salary: 0,
    employmentType: "",
    managerId: "",
    rehireNotes: "",
  } as RehireEmployeeFormData,
});

// Define form fields
const [rehireDate] = defineField("rehireDate");
const [newDepartment] = defineField("department");
const [newPosition] = defineField("position");
const [newJobLevel] = defineField("jobLevel");
const [newSalary] = defineField("salary");
const [newEmploymentType] = defineField("employmentType");
const [selectedManagerId] = defineField("managerId");
const [rehireNotes] = defineField("rehireNotes");

// State
const isRehiring = ref(false);

// Computed properties
const selectedEmployees = computed(() => appStore.selectedEmployees);

const departmentOptions = computed(() =>
  appStore.departments.map((dept) => dept.name)
);

const jobLevelOptions = computed(() =>
  appStore.formOptions.jobLevels.map((level) => ({
    text: level,
    value: level,
  }))
);

const employmentTypeOptions = computed(() =>
  appStore.formOptions.employmentTypes.map((type) => ({
    text: type,
    value: type,
  }))
);

const managerOptions = computed(() =>
  appStore.managers.map((manager: Manager) => ({
    title: manager.name,
    value: manager.id,
    subtitle: `${manager.department} - ${manager.email}`,
    manager: manager,
  }))
);

const isFormValid = computed(() => {
  return (
    rehireDate.value &&
    newDepartment.value &&
    newPosition.value &&
    newJobLevel.value &&
    newSalary.value !== undefined &&
    newSalary.value > 0 &&
    newEmploymentType.value
  );
});

// Methods
const getSelectedManagerInfo = () => {
  const manager = appStore.managers.find(
    (m: Manager) => m.id === selectedManagerId.value
  );
  return manager ? `${manager.name} (${manager.department})` : "";
};

const removeEmployee = (employeeId: string | undefined) => {
  if (employeeId) {
    appStore.removeSelectedEmployee(employeeId);
  }
};

const clearAllEmployees = () => {
  appStore.setSelectedEmployees([]);
};

const rehireEmployees = async () => {
  isRehiring.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isRehiring.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isRehiring.value = false;
      return;
    }

    // Get the selected manager if one is selected
    const selectedManager = selectedManagerId.value
      ? appStore.managers.find((m: Manager) => m.id === selectedManagerId.value)
      : null;

    // Use the bulk rehire method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];

    appStore.bulkRehireEmployees(employeeIds, {
      rehireDate: rehireDate.value || new Date().toISOString().split("T")[0],
      department: newDepartment.value || "",
      position: newPosition.value || "",
      jobLevel: newJobLevel.value as JobLevel,
      salary: Number(newSalary.value || 0),
      employmentType: newEmploymentType.value as EmploymentType,
      managerId: selectedManager?.id || "",
      managerName: selectedManager?.name || "",
      notes: rehireNotes.value || "",
    });

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error rehiring employees:", error);
  } finally {
    isRehiring.value = false;
  }
};

// Initialize form when component mounts
onMounted(() => {
  // Set default rehire date to today
  rehireDate.value = new Date().toISOString().split("T")[0];
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
