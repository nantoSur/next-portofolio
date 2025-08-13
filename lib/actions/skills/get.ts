// lib/actions/skills/get.ts
"use server";

import { sql } from "@/lib/services/db";
import type { Skill } from "@/lib/types/skill";

export async function getSkills(): Promise<Skill[]> {
  try {
    const result = await sql<Skill[]>`
      SELECT id, name, created_at, updated_at
      FROM skills
      ORDER BY created_at DESC
    `;
    return result;
  } catch (err) {
    console.error("❌ Gagal mengambil data skills:", err);
    throw new Error("Gagal mengambil data skills");
  }
}
