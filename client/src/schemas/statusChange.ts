import { z } from "zod";

// Status Change Schema
export const statusChangeSchema = z.object({
  newStatus: z.string().min(1, "Please select a new status"),
  statusChangeReason: z.string().optional(),
  effectiveDate: z.string().min(1, "Please select an effective date"),
  notifyEmployee: z.boolean().optional(),
  notifyManager: z.boolean().optional(),
});

// Type export
export type StatusChangeFormData = z.infer<typeof statusChangeSchema>;
