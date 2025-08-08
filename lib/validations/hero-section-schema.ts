// lib/validations/hero-section-schema.ts
import { z } from "zod";

export const HeroSectionSchema = z.object({
  title: z.string().min(3),
  highlight: z.string().min(1),
  description: z.string().nullable().optional(),
});
