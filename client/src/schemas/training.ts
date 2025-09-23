import { z } from "zod";

// Update Training Status Schema
export const updateTrainingStatusSchema = z.object({
  trainingStatus: z.string().min(1, "Please select a training status"),
  trainingProgram: z.string().optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  trainingNotes: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

// Type export
export type UpdateTrainingStatusFormData = z.infer<
  typeof updateTrainingStatusSchema
>;
