<template>
  <div class="assign-manager-form">
    <SelectedEmployeesSummary />

    <!-- Manager Assignment Form -->
    <v-form>
      <v-card variant="outlined" class="section-card">
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
                label="Select Manager *"
                required
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
                    : 'Choose a manager to assign to selected employees'
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
            <v-col cols="12">
              <v-textarea
                v-model="assignmentNotes"
                label="Assignment Notes"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.assignmentNotes"
                class="form-field"
                color="primary"
                hint="Optional notes about this manager assignment"
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
                hint="Date when the manager assignment becomes effective"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isAssigning"
        :disabled="!selectedManagerId || selectedEmployees.length === 0"
        submit-text="Assign Manager"
        submit-icon="mdi-account-plus"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="assignManager"
      />
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useDialogStore } from "../../../stores/dialog";
import { useAppStore } from "../../../stores/app";
import type { Manager } from "../../../types";
import {
  assignManagerSchema,
  type AssignManagerFormData,
} from "../../../schemas/manager";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// Form validation schema imported from schemas/manager.ts

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(assignManagerSchema),
  initialValues: {
    managerId: "",
    assignmentNotes: "",
    effectiveDate: today(),
  } as AssignManagerFormData,
});

// Define form fields
const [selectedManagerId] = defineField("managerId");
const [assignmentNotes] = defineField("assignmentNotes");
const [effectiveDate] = defineField("effectiveDate");

// State
const isAssigning = ref(false);

const managerOptions = computed(() =>
  appStore.managers.map((manager: Manager) => ({
    title: manager.name,
    value: manager.id,
    subtitle: `${manager.department} - ${manager.email}`,
    manager: manager,
  }))
);

// Methods
const getSelectedManagerInfo = () => {
  const manager = appStore.managers.find(
    (m: Manager) => m.id === selectedManagerId.value
  );
  return manager ? `${manager.name} (${manager.department})` : "";
};

// Selection helpers handled by SelectedEmployeesSummary component

const assignManager = async () => {
  isAssigning.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isAssigning.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isAssigning.value = false;
      return;
    }

    // Get the selected manager
    const selectedManager = appStore.managers.find(
      (m: Manager) => m.id === selectedManagerId.value
    );
    if (!selectedManager) {
      console.error("Selected manager not found");
      isAssigning.value = false;
      return;
    }

    // Use the bulk assign method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];
    appStore.bulkAssignManager(
      employeeIds,
      selectedManager.id,
      effectiveDate.value || new Date().toISOString().split("T")[0],
      assignmentNotes.value || ""
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error assigning manager:", error);
  } finally {
    isAssigning.value = false;
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
