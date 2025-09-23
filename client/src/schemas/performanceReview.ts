import { z } from "zod";

// Performance Review Conduct Schema
export const giveReviewSchema = z
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

// Performance Review Schedule Schema
export const scheduleReviewSchema = z
  .object({
    reviewDate: z.string().min(1, "Please select a review date"),
    reviewPeriodStart: z
      .string()
      .min(1, "Please select a review period start date"),
    reviewPeriodEnd: z
      .string()
      .min(1, "Please select a review period end date"),
    reviewerId: z.string().min(1, "Please select a reviewer"),
    reviewType: z.string().min(1, "Please select a review type"),
    nextReviewDate: z.string().optional(),
    reviewNotes: z.string().optional(),
    priority: z.string().optional(),
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
      // Validate that next review date is after review date
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

// Type exports
export type GiveReviewFormData = z.infer<typeof giveReviewSchema>;
export type ScheduleReviewFormData = z.infer<typeof scheduleReviewSchema>;
