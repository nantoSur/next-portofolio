"use server";

import { sql } from "@/lib/db";
import type { User } from "@/lib/types/user";
import bcrypt from "bcrypt";
import { treeifyError } from "zod";
import { DuplicateEmailError } from "@/lib/errors";

import { UserSchema, UpdateUserSchema } from "@/lib/validations/user-schema";

// Get list users
export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: User[]; totalPages: number }> {
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;

  const [users, countResult] = await Promise.all([
    sql<User[]>`
      SELECT id, name, email, level, created_at, updated_at
      FROM users
      WHERE name ILIKE ${searchQuery} OR email ILIKE ${searchQuery}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count
      FROM users
      WHERE name ILIKE ${searchQuery} OR email ILIKE ${searchQuery}
    `,
  ]);

  const totalCount = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { data: users, totalPages };
}

// Create user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  level: "admin" | "user";
}) {
  // Validasi awal dengan Zod
  const parsed = UserSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Validasi gagal:", treeifyError(parsed.error));
    throw new Error("Data user tidak valid");
  }

  const { name, email, password, level } = parsed.data;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await sql<User[]>`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existingUser.length > 0) {
      // throw new DuplicateEmailError(); // 💡 pakai error khusus
      return { success: false, error: "EMAIL_EXISTS" }; // ✅
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert data ke database
    const result = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, password, level)
      VALUES (${name}, ${email}, ${hashedPassword}, ${level})
      RETURNING id
    `;

    return { success: true, userId: result[0]?.id };
  } catch (err: unknown) {
    // Jangan log DuplicateEmailError karena sudah ditangani di UI
    if (!(err instanceof DuplicateEmailError)) {
      console.error("❌ Gagal menyimpan user:", err);
    }

    throw err;
  }
}

// Delete user
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

// Update user
export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    password?: string;
    level: "admin" | "user";
  }
) {
  try {
    // 🔧 Hapus password jika kosong agar tidak ikut divalidasi
    if (data.password === "") {
      delete data.password;
    }

    const parsed = UpdateUserSchema.safeParse(data);
    if (!parsed.success) {
      console.error("❌ Validasi gagal:", treeifyError(parsed.error));
      throw new Error("Data user tidak valid");
    }

    const { name, email, password, level } = parsed.data;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}, level = ${level}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, level = ${level}
        WHERE id = ${id}
      `;
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Update user error:", err);
    throw new Error("Gagal memperbarui user");
  }
}
