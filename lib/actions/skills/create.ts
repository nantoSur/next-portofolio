// lib/actions/skills/create.ts
"use server";
import { sql } from "@/lib/services/db";

export async function createSkill(name: string) {
  try {
    const result = await sql<{ id: string }[]>`
      INSERT INTO skills (name)
      VALUES (${name})
      RETURNING id
    `;
    return result[0];
  } catch (err: unknown) {
    console.error("❌ Gagal menyimpan skill:", err);
    throw new Error("Gagal menyimpan skill ke database");
  }
}
