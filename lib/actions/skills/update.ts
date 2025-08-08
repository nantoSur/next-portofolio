// lib/actions/skills/update.ts
"use server";

import { sql } from "@/lib/db";
import { SkillSchema } from "@/lib/validations/skill-schema";
import { treeifyError } from "zod";

export async function updateSkill(data: { id: string; name: string }) {
  const parsed = SkillSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Validasi gagal:", treeifyError(parsed.error));
    throw new Error("Data skill tidak valid");
  }

  const { id, name } = data;

  try {
    await sql`
      UPDATE skills
      SET name = ${name}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return { success: true };
  } catch (err) {
    console.error("❌ Gagal mengupdate skill:", err);
    throw new Error("Gagal mengupdate skill");
  }
}
