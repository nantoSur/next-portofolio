import { z } from "zod";

// ✅ Validasi untuk CreateSkillInput
export const createSkillSchema = z.object({
  name: z.string().min(2, "Skill name is required"),
  category: z.string().min(2, "Category is required"),
});

// ✅ Validasi untuk UpdateSkillInput
export const updateSkillSchema = createSkillSchema.extend({
  id: z.string().uuid("Invalid skill ID"),
});
