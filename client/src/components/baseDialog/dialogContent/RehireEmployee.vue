<template>
  <div class="rehire-employee-form">
    <SelectedEmployeesSummary />

    <v-alert
      v-if="skippedCount > 0"
      :type="allSkipped ? 'warning' : 'info'"
      variant="tonal"
      density="compact"
      class="text-caption mb-3"
    >
      {{ skippedCount }} selected employee(s) are not terminated and cannot be
      rehired — they will be skipped.
    </v-alert>

    <!-- Rehire Information Form -->
    <v-form>
      <div class="dialog-subhead">Rehire Information</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="rehireDate"
            label="Rehire Date *"
            type="date"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.rehireDate"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="newDepartment"
            :items="departmentOptions"
            label="Department *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.department"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newPosition"
            label="Position *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.position"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="newJobLevel"
            :items="jobLevelOptions"
            item-title="title"
            item-value="value"
            label="Job Level *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.jobLevel"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newSalary"
            label="Salary *"
            type="number"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.salary"
            class="form-field"
            color="primary"
            prefix="$"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="newEmploymentType"
            :items="appStore.formOptions.employmentTypes as string[]"
            label="Employment Type *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.employmentType"
            class="form-field"
            color="primary"
          />
        </v-col>
      </v-row>

      <div class="dialog-subhead">Manager Assignment</div>
      <v-row dense>
        <v-col cols="12">
          <v-select
            v-model="selectedManagerId"
            :items="managerOptions"
            label="Select Manager"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.managerId"
            class="form-field"
            color="primary"
            item-title="title"
            item-value="value"
            clearable
            no-data-text="No eligible managers for the chosen job level"
            :hint="
              selectedManagerId
                ? `Manager: ${getSelectedManagerInfo()}`
                : 'Choose a manager for the rehired employee (optional)'
            "
            persistent-hint
          >
            <template v-slot:item="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="32" color="primary">
                    <v-icon icon="mdi-account-tie" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <div class="dialog-subhead">Additional Information</div>
      <v-row dense>
        <v-col cols="12">
          <v-textarea
            v-model="rehireNotes"
            label="Rehire Notes"
            variant="outlined"
            rows="3"
            density="comfortable"
            :error-messages="errors.rehireNotes"
            class="form-field"
            color="primary"
          />
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isRehiring"
        :disabled="!isFormValid || selectedEmployees.length === 0 || allSkipped"
        submit-text="Rehire Employees"
        submit-icon="mdi-account-plus"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="rehireEmployees"
      />
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useDialogStore } from "../../../stores/dialog";
import { useAppStore } from "../../../stores/app";
import type { Manager, JobLevel, EmploymentType } from "../../../types";
import { getEligibleManagers } from "../../../constants/hierarchy";
import {
  rehireEmployeeSchema,
  type RehireEmployeeFormData,
} from "../../../schemas/rehire";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";
import { useApplicableEmployees } from "../../../composables/useApplicableEmployees";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// Form validation schema imported from schemas/rehire.ts

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

const departmentOptions = computed(() =>
  appStore.departments.map((dept) => dept.name)
);

// Managers eligible for the level the employee is being rehired at. Until a job
// level is chosen there's no floor, so all managers are eligible.
const managerOptions = computed(() =>
  getEligibleManagers({
    reports: selectedEmployees.value,
    managers: appStore.managers,
    employees: appStore.employees,
    reportLevelOverride: (newJobLevel.value as JobLevel) || undefined,
  }).map((manager: Manager) => ({
    title: manager.name,
    value: manager.id,
    subtitle: `${manager.department} - ${manager.email}`,
    manager: manager,
  }))
);

// Mirror EmployeeForm's single-CEO rule: only one non-terminated CEO allowed.
const hasExistingCEO = computed(() =>
  appStore.employees.some(
    (emp) => emp.jobLevel === "CEO" && emp.status !== "Terminated"
  )
);

const jobLevelOptions = computed(() =>
  appStore.formOptions.jobLevels.map((lvl) => ({
    title: lvl,
    value: lvl,
    props: { disabled: lvl === "CEO" && hasExistingCEO.value },
  }))
);

// Only terminated employees can be rehired — skip anyone still employed.
const { applicableIds, skippedCount, allSkipped } = useApplicableEmployees(
  selectedEmployees,
  (emp) => emp.status === "Terminated"
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

// If the chosen job level makes the selected manager ineligible, clear it.
watch([newJobLevel, managerOptions], () => {
  if (
    selectedManagerId.value &&
    !managerOptions.value.some((opt) => opt.value === selectedManagerId.value)
  ) {
    selectedManagerId.value = "";
  }
});

// Methods
const getSelectedManagerInfo = () => {
  const manager = appStore.managers.find(
    (m: Manager) => m.id === selectedManagerId.value
  );
  return manager ? `${manager.name} (${manager.department})` : "";
};

// Selection helpers handled by SelectedEmployeesSummary component

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

    // Only rehire employees who are actually terminated.
    const employeeIds = applicableIds.value;
    if (employeeIds.length === 0) {
      isRehiring.value = false;
      return;
    }

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
  rehireDate.value = today();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
