<template>
  <div class="training-status-update-form">
    <SelectedEmployeesSummary />

    <!-- Training Status Update Form -->
    <v-form>
      <v-row dense>
        <v-col cols="12">
          <v-select
            v-model="selectedTrainingStatus"
            :items="appStore.formOptions.trainingStatuses as string[]"
            label="New Training Status *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.trainingStatus"
            class="form-field"
            color="primary"
            clearable
            :hint="
              selectedTrainingStatus
                ? `Updating to: ${selectedTrainingStatus}`
                : 'Choose the new training status for selected employees'
            "
            persistent-hint
          >
            <template v-slot:item="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="32" color="primary">
                    <v-icon icon="mdi-school" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" v-if="selectedTrainingStatus && skippedCount > 0">
          <v-alert
            :type="allSkipped ? 'warning' : 'info'"
            variant="tonal"
            density="compact"
            class="text-caption"
          >
            {{ skippedCount }} selected employee(s) are already "{{
              selectedTrainingStatus
            }}" and will be skipped.
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="trainingProgram"
            label="Training Program"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.trainingProgram"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.startDate"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="completionDate"
            label="Completion Date"
            type="date"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.completionDate"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="trainingNotes"
            label="Training Notes"
            variant="outlined"
            rows="3"
            density="comfortable"
            :error-messages="errors.trainingNotes"
            class="form-field"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
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
        :loading="isUpdating"
        :disabled="
          !selectedTrainingStatus ||
          selectedEmployees.length === 0 ||
          allSkipped
        "
        submit-text="Update Training Status"
        submit-icon="mdi-school"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="updateTrainingStatus"
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
import type { TrainingStatus } from "../../../types";
import {
  updateTrainingStatusSchema,
  type UpdateTrainingStatusFormData,
} from "../../../schemas/training";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";
import { useApplicableEmployees } from "../../../composables/useApplicableEmployees";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(updateTrainingStatusSchema),
  initialValues: {
    trainingStatus: "",
    trainingProgram: "",
    startDate: "",
    completionDate: "",
    trainingNotes: "",
    effectiveDate: today(),
  } as UpdateTrainingStatusFormData,
});

// Define form fields
const [selectedTrainingStatus] = defineField("trainingStatus");
const [trainingProgram] = defineField("trainingProgram");
const [startDate] = defineField("startDate");
const [completionDate] = defineField("completionDate");
const [trainingNotes] = defineField("trainingNotes");
const [effectiveDate] = defineField("effectiveDate");

// State
const isUpdating = ref(false);

// Skip employees already at the chosen training status — updating is a no-op.
const { applicableIds, skippedCount, allSkipped } = useApplicableEmployees(
  selectedEmployees,
  (emp) => emp.trainingStatus !== selectedTrainingStatus.value
);

// Methods
const updateTrainingStatus = async () => {
  isUpdating.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isUpdating.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isUpdating.value = false;
      return;
    }

    // Only update employees not already at the chosen training status.
    const employeeIds = applicableIds.value;
    if (employeeIds.length === 0) {
      isUpdating.value = false;
      return;
    }

    appStore.bulkUpdateTrainingStatus(
      employeeIds,
      selectedTrainingStatus.value as TrainingStatus,
      {
        trainingProgram: trainingProgram.value || "",
        startDate: startDate.value || "",
        completionDate: completionDate.value || "",
        effectiveDate:
          effectiveDate.value || new Date().toISOString().split("T")[0],
        notes: trainingNotes.value || "",
      }
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error updating training status:", error);
  } finally {
    isUpdating.value = false;
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
