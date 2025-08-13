"use server";

import { sql } from "@/lib/services/db";
import type { User } from "@/lib/types/user";
import bcrypt from "bcrypt";
import { treeifyError } from "zod";
import { DuplicateEmailError } from "@/lib/utils/errors";
import { UserSchema } from "@/lib/validations/user-schema";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  level: "admin" | "user";
}) {
  const parsed = UserSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Validasi gagal:", treeifyError(parsed.error));
    throw new Error("Data user tidak valid");
  }

  const { name, email, password, level } = parsed.data;

  try {
    const existingUser = await sql<User[]>`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existingUser.length > 0) {
      return { success: false, error: "EMAIL_EXISTS" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, password, level)
      VALUES (${name}, ${email}, ${hashedPassword}, ${level})
      RETURNING id
    `;

    return { success: true, userId: result[0]?.id };
  } catch (err: unknown) {
    if (!(err instanceof DuplicateEmailError)) {
      console.error("❌ Gagal menyimpan user:", err);
    }
    throw err;
  }
}
