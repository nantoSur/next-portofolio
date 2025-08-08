"use server";

import { sql } from "@/lib/db";

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return { success: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Gagal menghapus user dari database";

    console.error("🔥 Gagal menghapus user:", errorMessage);
    throw new Error(errorMessage);
  }
}
