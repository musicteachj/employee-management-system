import { z } from "zod";

// Convert Employment Type Schema
export const convertEmploymentTypeSchema = z.object({
  employmentType: z.string().min(1, "Please select an employment type"),
  conversionNotes: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

// Type export
export type ConvertEmploymentTypeFormData = z.infer<
  typeof convertEmploymentTypeSchema
>;
