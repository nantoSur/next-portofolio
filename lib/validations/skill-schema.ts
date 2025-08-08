// lib/validations/skill-schema.ts
import { z } from "zod";

export const SkillSchema = z.object({
  name: z.string().min(1, "Nama skill wajib diisi"),
});

export type Skill = z.infer<typeof SkillSchema>;
