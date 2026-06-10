<template>
  <div class="status-change-form">
    <SelectedEmployeesSummary />

    <!-- Status Change Form -->
    <v-form>
      <v-row dense>
        <v-col cols="12">
          <v-select
            v-model="newStatus"
            :items="appStore.formOptions.statuses as string[]"
            label="New Status *"
            required
            variant="outlined"
            density="comfortable"
            :error-messages="errors.newStatus"
            class="form-field"
            color="primary"
            clearable
            :hint="
              newStatus
                ? `Changing status to: ${newStatus}`
                : 'Choose the new status for selected employees'
            "
            persistent-hint
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="32" :color="getStatusColor(item.title)">
                    <v-icon :icon="getStatusIcon(item.title)" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" v-if="newStatus && skippedCount > 0">
          <v-alert
            :type="allSkipped ? 'warning' : 'info'"
            variant="tonal"
            density="compact"
            class="text-caption"
          >
            {{ skippedCount }} selected employee(s) are already "{{
              newStatus
            }}" and will be skipped.
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="statusChangeReason"
            label="Reason for Status Change"
            variant="outlined"
            rows="3"
            density="comfortable"
            :error-messages="errors.statusChangeReason"
            class="form-field"
            color="primary"
            hint="Optional reason or notes about this status change"
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
        <v-col cols="12">
          <div class="notify-row">
            <span class="notify-label">Notify</span>
            <v-checkbox
              v-model="notifyEmployee"
              label="Employee"
              color="primary"
              density="compact"
              hide-details
            />
            <v-checkbox
              v-model="notifyManager"
              label="Manager"
              color="primary"
              density="compact"
              hide-details
            />
          </div>
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isChangingStatus"
        :disabled="!newStatus || selectedEmployees.length === 0 || allSkipped"
        submit-text="Change Status"
        submit-icon="mdi-account-switch"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="changeEmployeeStatus"
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
import type { ActiveStatus } from "../../../types";
import { statusChangeSchema } from "../../../schemas/statusChange";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";
import { useApplicableEmployees } from "../../../composables/useApplicableEmployees";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(statusChangeSchema),
  initialValues: {
    newStatus: "",
    statusChangeReason: "",
    effectiveDate: today(),
    notifyEmployee: false,
    notifyManager: false,
  },
});

// Define form fields
const [newStatus] = defineField("newStatus");
const [statusChangeReason] = defineField("statusChangeReason");
const [effectiveDate] = defineField("effectiveDate");
const [notifyEmployee] = defineField("notifyEmployee");
const [notifyManager] = defineField("notifyManager");

// State
const isChangingStatus = ref(false);

// Skip employees already in the chosen status — changing them is a no-op.
const { applicableIds, skippedCount, allSkipped } = useApplicableEmployees(
  selectedEmployees,
  (emp) => emp.status !== newStatus.value
);

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "warning";
    case "On Leave":
      return "info";
    case "Terminated":
      return "error";
    default:
      return "primary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return "mdi-account-check";
    case "Inactive":
      return "mdi-account-minus";
    case "On Leave":
      return "mdi-account-clock";
    case "Terminated":
      return "mdi-account-remove";
    default:
      return "mdi-account";
  }
};

const changeEmployeeStatus = async () => {
  isChangingStatus.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isChangingStatus.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isChangingStatus.value = false;
      return;
    }

    // Only change employees not already in the chosen status.
    const employeeIds = applicableIds.value;
    if (employeeIds.length === 0) {
      isChangingStatus.value = false;
      return;
    }

    appStore.bulkChangeStatus(
      employeeIds,
      newStatus.value as ActiveStatus,
      effectiveDate.value || new Date().toISOString().split("T")[0],
      statusChangeReason.value || "",
      {
        notifyEmployee: notifyEmployee.value || false,
        notifyManager: notifyManager.value || false,
      }
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error changing employee status:", error);
  } finally {
    isChangingStatus.value = false;
  }
};

// Initialize form when component mounts
onMounted(() => {
  effectiveDate.value = today();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
.notify-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.notify-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-gray);
}
</style>
