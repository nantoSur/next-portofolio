import { z } from "zod";

// ✅ Validasi untuk CreateWorkExperienceInput
export const createWorkExperienceSchema = z.object({
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"), // format: YYYY-MM-DD
  endDate: z.string().optional().or(z.literal("")),
  summary: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  skillIds: z.array(z.string()).min(1, "Please select at least one skill"),
});

// ✅ Validasi untuk UpdateWorkExperienceInput
export const updateWorkExperienceSchema = createWorkExperienceSchema.extend({
  id: z.string().uuid("Invalid work experience ID"),
});
