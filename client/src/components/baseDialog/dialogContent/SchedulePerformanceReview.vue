<template>
  <div class="schedule-performance-review-form">
    <SelectedEmployeesSummary />

    <!-- Performance Review Scheduling Form -->
    <v-form>
      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-calendar-clock</v-icon>
          Performance Review Details
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reviewDate"
                label="Review Date *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewDate"
                class="form-field"
                color="primary"
                hint="Date when the performance review will be conducted"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="nextReviewDate"
                label="Next Review Date"
                type="date"
                variant="outlined"
                density="compact"
                :error-messages="errors.nextReviewDate"
                class="form-field"
                color="primary"
                hint="Date for the following review cycle"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reviewPeriodStart"
                label="Review Period Start *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewPeriodStart"
                class="form-field"
                color="primary"
                hint="Start date of the performance period being reviewed"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reviewPeriodEnd"
                label="Review Period End *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewPeriodEnd"
                class="form-field"
                color="primary"
                hint="End date of the performance period being reviewed"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-account-tie</v-icon>
          Reviewer Assignment
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="selectedReviewerId"
                :items="reviewerOptions"
                label="Select Reviewer *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewerId"
                class="form-field"
                color="primary"
                item-title="title"
                item-value="value"
                clearable
                :hint="
                  selectedReviewerId
                    ? `Reviewer: ${getSelectedReviewerInfo()}`
                    : 'Choose a reviewer to conduct the performance reviews'
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
              <v-select
                v-model="reviewType"
                :items="reviewTypeOptions"
                label="Review Type *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewType"
                class="form-field"
                color="primary"
                hint="Type of performance review to be conducted"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-note-text</v-icon>
          Additional Information
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="reviewNotes"
                label="Review Notes"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.reviewNotes"
                class="form-field"
                color="primary"
                hint="Optional notes or special instructions for the performance review"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="priority"
                :items="priorityOptions"
                label="Priority"
                variant="outlined"
                density="compact"
                :error-messages="errors.priority"
                class="form-field"
                color="primary"
                hint="Priority level for scheduling this review"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isScheduling"
        :disabled="!selectedReviewerId || selectedEmployees.length === 0"
        submit-text="Schedule Review"
        submit-icon="mdi-calendar-plus"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="scheduleReview"
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
  scheduleReviewSchema,
  type ScheduleReviewFormData,
} from "../../../schemas/performanceReview";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";

const dialogStore = useDialogStore();
const appStore = useAppStore();
const { selectedEmployees } = useBulkDialogForm();

// Form validation schema imported from schemas/performanceReview.ts

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(scheduleReviewSchema),
  initialValues: {
    reviewDate: "",
    reviewPeriodStart: "",
    reviewPeriodEnd: "",
    reviewerId: "",
    reviewType: "Annual Review",
    nextReviewDate: "",
    reviewNotes: "",
    priority: "medium",
  } as ScheduleReviewFormData,
});

// Define form fields
const [reviewDate] = defineField("reviewDate");
const [reviewPeriodStart] = defineField("reviewPeriodStart");
const [reviewPeriodEnd] = defineField("reviewPeriodEnd");
const [selectedReviewerId] = defineField("reviewerId");
const [reviewType] = defineField("reviewType");
const [nextReviewDate] = defineField("nextReviewDate");
const [reviewNotes] = defineField("reviewNotes");
const [priority] = defineField("priority");

// State
const isScheduling = ref(false);

// Options
const reviewTypeOptions = [
  "Annual Review",
  "Mid-Year Review",
  "Quarterly Review",
  "Probation Review",
  "Performance Improvement Review",
  "Promotion Review",
  "Exit Review",
];

const priorityOptions = [
  { title: "Low", value: "low" },
  { title: "Medium", value: "medium" },
  { title: "High", value: "high" },
  { title: "Urgent", value: "urgent" },
];

const reviewerOptions = computed(() =>
  appStore.managers.map((manager: Manager) => ({
    title: manager.name,
    value: manager.id,
    subtitle: `${manager.department} - ${manager.email}`,
    manager: manager,
  }))
);

// Methods
const getSelectedReviewerInfo = () => {
  const reviewer = appStore.managers.find(
    (m: Manager) => m.id === selectedReviewerId.value
  );
  return reviewer ? `${reviewer.name} (${reviewer.department})` : "";
};

const calculateDefaultDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Set default review date to 2 weeks from now
  const defaultReviewDate = new Date(now);
  defaultReviewDate.setDate(now.getDate() + 14);

  // Set default review period to current year
  const periodStart = new Date(currentYear, 0, 1); // January 1st
  const periodEnd = new Date(currentYear, 11, 31); // December 31st

  // Set next review date to one year from review date
  const defaultNextReview = new Date(defaultReviewDate);
  defaultNextReview.setFullYear(defaultNextReview.getFullYear() + 1);

  reviewDate.value = defaultReviewDate.toISOString().split("T")[0];
  reviewPeriodStart.value = periodStart.toISOString().split("T")[0];
  reviewPeriodEnd.value = periodEnd.toISOString().split("T")[0];
  nextReviewDate.value = defaultNextReview.toISOString().split("T")[0];
};

const scheduleReview = async () => {
  isScheduling.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isScheduling.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isScheduling.value = false;
      return;
    }

    // Get the selected reviewer
    const selectedReviewer = appStore.managers.find(
      (m: Manager) => m.id === selectedReviewerId.value
    );
    if (!selectedReviewer) {
      console.error("Selected reviewer not found");
      isScheduling.value = false;
      return;
    }

    // Create review data object
    const reviewData = {
      reviewDate: reviewDate.value,
      reviewPeriodStart: reviewPeriodStart.value,
      reviewPeriodEnd: reviewPeriodEnd.value,
      reviewerName: selectedReviewer.name,
      reviewerEmail: selectedReviewer.email,
      reviewType: reviewType.value,
      nextReviewDate: nextReviewDate.value || undefined,
      comments: reviewNotes.value || undefined,
      priority: priority.value || "medium",
    };

    // Use the bulk schedule method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];

    // TODO: Implement bulkSchedulePerformanceReview method in the store
    // appStore.bulkSchedulePerformanceReview(employeeIds, reviewData);
    console.log(
      "Scheduling performance reviews for employees:",
      employeeIds,
      "with data:",
      reviewData
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error scheduling performance review:", error);
  } finally {
    isScheduling.value = false;
  }
};

// Initialize form when component mounts
onMounted(() => {
  calculateDefaultDates();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
