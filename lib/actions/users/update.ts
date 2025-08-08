"use server";

import { sql } from "@/lib/db";
import bcrypt from "bcrypt";
import { treeifyError } from "zod";
import { UpdateUserSchema } from "@/lib/validations/user-schema";

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
