// /lib/validations/work-experience-schema.ts
import { z } from "zod";

export const WorkExperienceSchema = z.object({
  id: z.string().uuid().optional(), // optional for create, required for update
  role: z.string().min(1, { message: "Role wajib diisi" }),
  company: z.string().min(1, { message: "Company wajib diisi" }),
  location: z.string().optional(),
  logoUrl: z
    .string()
    .url({ message: "Logo harus berupa URL yang valid" })
    .optional()
    .or(z.literal("")),
  startDate: z.string().min(1, { message: "Tanggal mulai wajib diisi" }),
  endDate: z.string().optional().or(z.literal("")),
  summary: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  skillIds: z.array(z.string().uuid()).optional(), // relasi many-to-many ke skills
});

export type WorkExperienceForm = z.infer<typeof WorkExperienceSchema>;
