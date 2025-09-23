import { z } from "zod";

// Rehire Employee Schema
export const rehireEmployeeSchema = z.object({
  rehireDate: z.string().min(1, "Please select a rehire date"),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(1, "Please enter a position"),
  jobLevel: z.string().min(1, "Please select a job level"),
  salary: z.number().min(1, "Please enter a valid salary"),
  employmentType: z.string().min(1, "Please select an employment type"),
  managerId: z.string().optional(),
  rehireNotes: z.string().optional(),
});

// Type export
export type RehireEmployeeFormData = z.infer<typeof rehireEmployeeSchema>;
