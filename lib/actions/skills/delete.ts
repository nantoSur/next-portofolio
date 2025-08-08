// lib/actions/skills/delete.ts
"use server";

import { sql } from "@/lib/db";

export async function deleteSkill(id: string) {
  try {
    await sql`DELETE FROM skills WHERE id = ${id}`;
    return { success: true };
  } catch (err) {
    console.error("❌ Gagal menghapus skill:", err);
    throw new Error("Gagal menghapus skill");
  }
}
