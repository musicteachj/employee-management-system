<template>
  <div class="convert-employee-type-form">
    <SelectedEmployeesSummary />

    <!-- Employment Type Conversion Form -->
    <v-form>
      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-account-convert</v-icon>
          Employment Type Conversion
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="selectedEmploymentType"
                :items="appStore.formOptions.employmentTypes as string[]"
                label="New Employment Type *"
                required
                variant="outlined"
                density="compact"
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
                <template v-slot:item="{ props, item }">
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
            <v-col cols="12">
              <v-textarea
                v-model="conversionNotes"
                label="Conversion Notes"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.conversionNotes"
                class="form-field"
                color="primary"
                hint="Optional notes about this employment type conversion"
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
                hint="Date when the employment type change becomes effective"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isConverting"
        :disabled="!selectedEmploymentType || selectedEmployees.length === 0"
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
import { z } from "zod";
import { useDialogStore } from "../../../stores/dialog";
import { useAppStore } from "../../../stores/app";
import type { EmploymentType } from "../../../types";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees, today } = useBulkDialogForm();

// Form validation schema
const convertEmploymentTypeSchema = z.object({
  employmentType: z.string().min(1, "Please select an employment type"),
  conversionNotes: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

type ConvertEmploymentTypeFormData = z.infer<
  typeof convertEmploymentTypeSchema
>;

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

    // Use the bulk convert method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];

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
