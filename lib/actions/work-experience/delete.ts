"use server";
import { sql } from "@/lib/db";

export async function deleteWorkExperience(id: string) {
  await sql`
    DELETE FROM work_experiences WHERE id = ${id}
  `;
}
