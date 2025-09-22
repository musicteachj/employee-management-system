<template>
  <div class="assign-manager-form">
    <!-- Selected Employees Summary -->
    <v-card variant="outlined" class="mb-4 summary-card">
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
            No employees selected for manager assignment.
          </p>
          <p class="text-caption text-grey">
            Please select employees from the table to assign a manager.
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
      <div class="d-flex justify-end mt-4 gap-3">
        <v-btn
          color="grey"
          variant="outlined"
          @click="dialogStore.closeAndResetDialog()"
          :disabled="isAssigning"
        >
          <v-icon class="mr-2" size="small">mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="isAssigning"
          :disabled="!selectedManagerId || selectedEmployees.length === 0"
          @click="assignManager"
        >
          <v-icon class="mr-2" size="small">mdi-account-plus</v-icon>
          Assign Manager
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
import type { Manager } from "../../../types";

const dialogStore = useDialogStore();
const appStore = useAppStore();

// Form validation schema
const assignManagerSchema = z.object({
  managerId: z.string().min(1, "Please select a manager"),
  assignmentNotes: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

type AssignManagerFormData = z.infer<typeof assignManagerSchema>;

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(assignManagerSchema),
  initialValues: {
    managerId: "",
    assignmentNotes: "",
    effectiveDate: new Date().toISOString().split("T")[0], // Today's date
  } as AssignManagerFormData,
});

// Define form fields
const [selectedManagerId] = defineField("managerId");
const [assignmentNotes] = defineField("assignmentNotes");
const [effectiveDate] = defineField("effectiveDate");

// State
const isAssigning = ref(false);

// Computed properties
const selectedEmployees = computed(() => appStore.selectedEmployees);

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

const removeEmployee = (employeeId: string | undefined) => {
  if (employeeId) {
    appStore.removeSelectedEmployee(employeeId);
  }
};

const clearAllEmployees = () => {
  appStore.setSelectedEmployees([]);
};

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
  // Set default effective date to today
  effectiveDate.value = new Date().toISOString().split("T")[0];
});
</script>

<style scoped>
/* Section cards styling */
.section-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border: 1px solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.section-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.1);
  border-color: rgba(25, 118, 210, 0.2);
}

.summary-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4fd 100%);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* Section headers styling */
.section-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 100%);
  color: #1976d2;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(25, 118, 210, 0.2);
}

/* Form fields styling */
.form-field {
  transition: all 0.3s ease;
}

.form-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.form-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  border-width: 2px;
}

.form-field :deep(.v-field__input) {
  background: rgba(25, 118, 210, 0.02);
  border-radius: 8px;
}

/* Employee list styling */
.employee-list {
  max-height: 200px;
  overflow-y: auto;
}

/* Empty state styling */
.empty-state {
  text-align: center;
  padding: 32px 16px;
  background: rgba(245, 247, 250, 0.5);
  border-radius: 8px;
  border: 2px dashed rgba(158, 158, 158, 0.3);
}

.empty-state .v-icon {
  opacity: 0.6;
}

/* Enhanced spacing */
.gap-3 {
  gap: 12px;
}

/* Section header icon styling */
.section-header :deep(.v-icon) {
  color: #1976d2;
}

/* Form validation styling */
:deep(.v-messages__message) {
  color: #d32f2f;
  font-weight: 500;
}

/* Enhanced chip styling */
:deep(.v-chip) {
  transition: all 0.3s ease;
}

:deep(.v-chip:hover) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

/* Closable chip styling */
:deep(.v-chip--closable) {
  padding-right: 4px;
}

:deep(.v-chip__close) {
  margin-left: 8px;
  opacity: 0.7;
  transition: all 0.2s ease;
}

:deep(.v-chip__close:hover) {
  opacity: 1;
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Clear all button styling */
:deep(.v-btn--variant-text) {
  transition: all 0.3s ease;
}

:deep(.v-btn--variant-text:hover) {
  background: rgba(244, 67, 54, 0.1);
}
</style>
