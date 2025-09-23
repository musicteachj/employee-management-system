<template>
  <div class="give-review-form">
    <SelectedEmployeesSummary />

    <!-- Performance Review Form -->
    <v-form>
      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-star-circle</v-icon>
          Performance Assessment
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="performanceRating"
                :items="performanceRatingOptions"
                label="Overall Performance Rating *"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.performanceRating"
                class="form-field"
                color="primary"
                hint="Select the overall performance rating for this review period"
                persistent-hint
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar size="32" :color="getRatingColor(item.value)">
                        <v-icon icon="mdi-star" />
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-calendar-range</v-icon>
          Review Period
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
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
            <v-col cols="12">
              <v-text-field
                v-model="reviewDate"
                label="Review Conducted Date *"
                type="date"
                required
                variant="outlined"
                density="compact"
                :error-messages="errors.reviewDate"
                class="form-field"
                color="primary"
                hint="Date when this performance review is being conducted"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-trophy</v-icon>
          Achievements & Strengths
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="achievements"
                label="Key Achievements"
                variant="outlined"
                rows="4"
                density="compact"
                :error-messages="errors.achievements"
                class="form-field"
                color="primary"
                hint="Highlight the employee's key achievements and accomplishments during this review period"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="strengths"
                label="Strengths & Positive Feedback"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.strengths"
                class="form-field"
                color="primary"
                hint="Note the employee's key strengths and positive performance areas"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-trending-up</v-icon>
          Development & Improvement
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="areasForImprovement"
                label="Areas for Improvement"
                variant="outlined"
                rows="3"
                density="compact"
                :error-messages="errors.areasForImprovement"
                class="form-field"
                color="primary"
                hint="Identify specific areas where the employee can improve their performance"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="developmentGoals"
                label="Development Goals & Action Plan"
                variant="outlined"
                rows="4"
                density="compact"
                :error-messages="errors.developmentGoals"
                class="form-field"
                color="primary"
                hint="Set specific development goals and action plans for the next review period"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="section-card">
        <v-card-title class="text-subtitle-1 section-header py-2">
          <v-icon class="mr-2" size="small">mdi-comment-text</v-icon>
          Additional Comments
        </v-card-title>
        <v-card-text class="pa-3">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="managerFeedback"
                label="Manager Feedback & Comments"
                variant="outlined"
                rows="4"
                density="compact"
                :error-messages="errors.managerFeedback"
                class="form-field"
                color="primary"
                hint="Provide overall feedback, observations, and any additional comments about the employee's performance"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="nextReviewDate"
                label="Next Review Date"
                type="date"
                variant="outlined"
                density="compact"
                :error-messages="errors.nextReviewDate"
                class="form-field"
                color="primary"
                hint="Recommended date for the next performance review"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <DialogActions
        :loading="isSubmitting"
        :disabled="!performanceRating || selectedEmployees.length === 0"
        submit-text="Submit Review"
        submit-icon="mdi-check-circle"
        :on-cancel="() => dialogStore.closeAndResetDialog()"
        :on-submit="submitReview"
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
import type { PerformanceRating } from "../../../types";
import SelectedEmployeesSummary from "./SelectedEmployeesSummary.vue";
import DialogActions from "./DialogActions.vue";
import { useBulkDialogForm } from "../../../composables/useBulkDialogForm";

const dialogStore = useDialogStore();
const { selectedEmployees } = useBulkDialogForm();

// Form validation schema
const giveReviewSchema = z
  .object({
    performanceRating: z.string().min(1, "Please select a performance rating"),
    reviewDate: z.string().min(1, "Please select the review date"),
    reviewPeriodStart: z
      .string()
      .min(1, "Please select the review period start date"),
    reviewPeriodEnd: z
      .string()
      .min(1, "Please select the review period end date"),
    achievements: z.string().optional(),
    strengths: z.string().optional(),
    areasForImprovement: z.string().optional(),
    developmentGoals: z.string().optional(),
    managerFeedback: z.string().optional(),
    nextReviewDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate that review period end is after start
      if (data.reviewPeriodStart && data.reviewPeriodEnd) {
        return (
          new Date(data.reviewPeriodEnd) >= new Date(data.reviewPeriodStart)
        );
      }
      return true;
    },
    {
      message: "Review period end date must be after start date",
      path: ["reviewPeriodEnd"],
    }
  )
  .refine(
    (data) => {
      // Validate that review date is within or after the review period
      if (data.reviewDate && data.reviewPeriodEnd) {
        return new Date(data.reviewDate) >= new Date(data.reviewPeriodEnd);
      }
      return true;
    },
    {
      message: "Review date should be after the review period ends",
      path: ["reviewDate"],
    }
  )
  .refine(
    (data) => {
      // Validate that next review date is after current review date
      if (data.reviewDate && data.nextReviewDate) {
        return new Date(data.nextReviewDate) > new Date(data.reviewDate);
      }
      return true;
    },
    {
      message: "Next review date must be after the current review date",
      path: ["nextReviewDate"],
    }
  );

type GiveReviewFormData = z.infer<typeof giveReviewSchema>;

// VeeValidate form setup
const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: toTypedSchema(giveReviewSchema),
  initialValues: {
    performanceRating: "",
    reviewDate: new Date().toISOString().split("T")[0],
    reviewPeriodStart: "",
    reviewPeriodEnd: "",
    achievements: "",
    strengths: "",
    areasForImprovement: "",
    developmentGoals: "",
    managerFeedback: "",
    nextReviewDate: "",
  } as GiveReviewFormData,
});

// Define form fields
const [performanceRating] = defineField("performanceRating");
const [reviewDate] = defineField("reviewDate");
const [reviewPeriodStart] = defineField("reviewPeriodStart");
const [reviewPeriodEnd] = defineField("reviewPeriodEnd");
const [achievements] = defineField("achievements");
const [strengths] = defineField("strengths");
const [areasForImprovement] = defineField("areasForImprovement");
const [developmentGoals] = defineField("developmentGoals");
const [managerFeedback] = defineField("managerFeedback");
const [nextReviewDate] = defineField("nextReviewDate");

// State
const isSubmitting = ref(false);

// Options
const performanceRatingOptions = [
  { title: "Exceeds Expectations", value: "Exceeds Expectations" },
  { title: "Meets Expectations", value: "Meets Expectations" },
  { title: "Needs Improvement", value: "Needs Improvement" },
  { title: "Unsatisfactory", value: "Unsatisfactory" },
  { title: "Unrated", value: "Unrated" },
];

// Methods
const getRatingColor = (rating: PerformanceRating) => {
  switch (rating) {
    case "Exceeds Expectations":
      return "success";
    case "Meets Expectations":
      return "primary";
    case "Needs Improvement":
      return "warning";
    case "Unsatisfactory":
      return "error";
    case "Unrated":
      return "grey";
    default:
      return "grey";
  }
};

const calculateDefaultDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Set default review period to current year
  const periodStart = new Date(currentYear, 0, 1); // January 1st
  const periodEnd = new Date(currentYear, 11, 31); // December 31st

  // Set default next review date to one year from now
  const defaultNextReview = new Date(now);
  defaultNextReview.setFullYear(defaultNextReview.getFullYear() + 1);

  reviewDate.value = now.toISOString().split("T")[0];
  reviewPeriodStart.value = periodStart.toISOString().split("T")[0];
  reviewPeriodEnd.value = periodEnd.toISOString().split("T")[0];
  nextReviewDate.value = defaultNextReview.toISOString().split("T")[0];
};

const prefillFromSelectedEmployees = () => {
  if (selectedEmployees.value.length === 1) {
    const employee = selectedEmployees.value[0];

    // Prefill form with existing employee data if available
    performanceRating.value = employee.performanceRating || "";

    // Set review period based on last review or default to current year
    if (employee.lastReviewDate) {
      const lastReview = new Date(employee.lastReviewDate);
      reviewPeriodStart.value = lastReview.toISOString().split("T")[0];
    }

    if (employee.nextReviewDate) {
      nextReviewDate.value = employee.nextReviewDate;
    }

    // Prefill development notes if available
    if (employee.developmentNotes) {
      developmentGoals.value = employee.developmentNotes;
    }
  }
};

const submitReview = async () => {
  isSubmitting.value = true;

  try {
    // Check if there are selected employees
    if (selectedEmployees.value.length === 0) {
      console.error("No employees selected");
      isSubmitting.value = false;
      return;
    }

    // Validate the form
    const { valid } = await validate();
    if (!valid) {
      isSubmitting.value = false;
      return;
    }

    // Create review data object
    const reviewData = {
      performanceRating: performanceRating.value as PerformanceRating,
      reviewDate: reviewDate.value,
      reviewPeriodStart: reviewPeriodStart.value,
      reviewPeriodEnd: reviewPeriodEnd.value,
      achievements: achievements.value || undefined,
      strengths: strengths.value || undefined,
      areasForImprovement: areasForImprovement.value || undefined,
      developmentGoals: developmentGoals.value || undefined,
      managerFeedback: managerFeedback.value || undefined,
      nextReviewDate: nextReviewDate.value || undefined,
      // Auto-calculated fields that the store will handle
      reviewStatus: "current", // Will be auto-calculated based on dates
      lastReviewDate: reviewDate.value, // This review becomes the last review
    };

    // Use the bulk submit review method from the store
    const employeeIds = selectedEmployees.value
      .map((emp) => emp._id)
      .filter((id) => id) as string[];

    // TODO: Implement bulkSubmitPerformanceReview method in the store
    // This method should:
    // 1. Create a new PerformanceReview record
    // 2. Update employee's performanceRating, lastReviewDate, nextReviewDate
    // 3. Auto-calculate reviewStatus and daysOverdue based on dates
    // 4. Add the review to the employee's performanceHistory
    // appStore.bulkSubmitPerformanceReview(employeeIds, reviewData);
    console.log(
      "Submitting performance review for employees:",
      employeeIds,
      "with data:",
      reviewData
    );

    // Close the dialog and reset form
    dialogStore.closeAndResetDialog();
    resetForm();
  } catch (error) {
    console.error("Error submitting performance review:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Initialize form when component mounts
onMounted(() => {
  calculateDefaultDates();
  prefillFromSelectedEmployees();
});
</script>

<style scoped>
/* Component-specific styles only - common styles are in global CSS */
</style>
