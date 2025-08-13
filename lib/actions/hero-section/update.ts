"use server";

import { sql } from "@/lib/services/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const HeroSectionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  highlight: z.string().min(1),

  description: z.string().min(1),
});

export async function updateHeroSection(data: unknown) {
  const parsed = HeroSectionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { id, title, highlight, description } = parsed.data;

  try {
    await sql`
      UPDATE hero_section
      SET title = ${title},
          highlight = ${highlight},
        
          description = ${description},
          updated_at = now() at time zone 'Asia/Jakarta'
      WHERE id = ${id}::uuid
    `;

    revalidatePath("/dashboard/hero-section");
    return { success: true };
  } catch (error) {
    console.error("Gagal update hero section:", error);
    return { success: false, error: "Gagal menyimpan data" };
  }
}
