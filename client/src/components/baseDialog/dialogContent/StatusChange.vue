<template>
  <div class="status-change-form">
    <SelectedEmployeesSummary />

    <!-- Status Change Form -->
    <v-form>
      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-account-switch</v-icon>
          Employee Status Change
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="newStatus"
                :items="appStore.formOptions.statuses as string[]"
                label="New Status *"
                required
                variant="outlined"
                density="compact"
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
            <v-col cols="12">
              <v-textarea
                v-model="statusChangeReason"
                label="Reason for Status Change"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.statusChangeReason"
                class="form-field"
                color="primary"
                hint="Optional reason or notes about this status change"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="effectiveDate"
                label="Effective Date *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.effectiveDate"
                class="form-field"
                color="primary"
                hint="Date when the status change becomes effective"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-card variant="outlined" class="notification-section">
                <v-card-title class="text-subtitle-2 py-2">
                  <v-icon class="mr-2" size="small">mdi-bell-outline</v-icon>
                  Notifications
                </v-card-title>
                <v-card-text class="pa-3">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-checkbox
                        v-model="notifyEmployee"
                        label="Notify Employee"
                        color="primary"
                        density="compact"
                        :error-messages="errors.notifyEmployee"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-checkbox
                        v-model="notifyManager"
                        label="Notify Manager"
                        color="primary"
                        density="compact"
                        :error-messages="errors.notifyManager"
                        hide-details="auto"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isChangingStatus"
        :disabled="!newStatus || selectedEmployees.length === 0"
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

    // Use the bulk status change method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];

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
.notification-section {
  margin-top: 8px;
}
</style>
