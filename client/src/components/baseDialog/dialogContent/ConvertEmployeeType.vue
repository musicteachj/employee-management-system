<template>
  <div class="convert-employee-type-form">
    <SelectedEmployeesSummary />

    <!-- Employment Type Conversion Form -->
    <v-form>
      <v-row dense>
        <v-col cols="12">
          <v-select
            v-model="selectedEmploymentType"
            :items="appStore.formOptions.employmentTypes as string[]"
            label="New Employment Type *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.employmentType"
            class="form-field"
            color="primary"
            clearable
            :hint="
              selectedEmploymentType
                ? `Converting to: ${selectedEmploymentType}`
                : 'Choose the new employment type for selected employees'
            "
            persistent-hint
          >
            <template v-slot:item="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="32" color="primary">
                    <v-icon icon="mdi-account-convert" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" v-if="selectedEmploymentType && skippedCount > 0">
          <v-alert
            :type="allSkipped ? 'warning' : 'info'"
            variant="tonal"
            density="compact"
            class="text-caption"
          >
            {{ skippedCount }} selected employee(s) are already "{{
              selectedEmploymentType
            }}" and will be skipped.
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="conversionNotes"
            label="Conversion Notes"
            variant="outlined"
            rows="3"
            density="comfortable"
            :error-messages="errors.conversionNotes"
            class="form-field"
            color="primary"
            hint="Optional notes about this employment type conversion"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="effectiveDate"
            label="Effective Date *"
            type="date"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.effectiveDate"
            class="form-field"
            color="primary"
          />
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isConverting"
        :disabled="
          !selectedEmploymentType ||
          selectedEmployees.length === 0 ||
          allSkipped
        "
        submit-text="Convert Employment Type"
        submit-icon="mdi-account-convert"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="convertEmploymentType"
      />
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useDialogStore } from "../../../stores/dialog";
import { useAppStore } from "../../../stores/app";
import type { EmploymentType } from "../../../types";
import {
  convertEmploymentTypeSchema,
  type ConvertEmploymentTypeFormData,
} from "../../../schemas/employmentType";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";
import { useApplicableEmployees } from "../../../composables/useApplicableEmployees";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// Form validation schema imported from schemas/employmentType.ts

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(convertEmploymentTypeSchema),
  initialValues: {
    employmentType: "",
    conversionNotes: "",
    effectiveDate: today(),
  } as ConvertEmploymentTypeFormData,
});

// Define form fields
const [selectedEmploymentType] = defineField("employmentType");
const [conversionNotes] = defineField("conversionNotes");
const [effectiveDate] = defineField("effectiveDate");

// State
const isConverting = ref(false);

// Skip employees already of the chosen employment type — converting is a no-op.
const { applicableIds, skippedCount, allSkipped } = useApplicableEmployees(
  selectedEmployees,
  (emp) => emp.employmentType !== selectedEmploymentType.value
);

// Methods
// Selection helpers handled by SelectedEmployeesSummary component

const convertEmploymentType = async () => {
  isConverting.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isConverting.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isConverting.value = false;
      return;
    }

    // Only convert employees not already of the chosen type.
    const employeeIds = applicableIds.value;
    if (employeeIds.length === 0) {
      isConverting.value = false;
      return;
    }

    appStore.bulkConvertEmploymentType(
      employeeIds,
      selectedEmploymentType.value as EmploymentType,
      effectiveDate.value || new Date().toISOString().split("T")[0],
      conversionNotes.value || ""
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error converting employment type:", error);
  } finally {
    isConverting.value = false;
  }
};

// Initialize form when component mounts
onMounted(() => {
  effectiveDate.value = today();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
