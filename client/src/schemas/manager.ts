import { z } from "zod";

// Assign Manager Schema
export const assignManagerSchema = z.object({
  managerId: z.string().min(1, "Please select a manager"),
  assignmentNotes: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

// Type export
export type AssignManagerFormData = z.infer<typeof assignManagerSchema>;
