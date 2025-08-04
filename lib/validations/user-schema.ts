import { z } from "zod";

// Schema dasar tanpa password
const BaseUserSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  level: z.enum(["admin", "user"]),
});

// Untuk validasi umum (dengan password wajib)
export const UserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .min(6, { message: "Tambah user Password minimal 6 karakter" }),
});

// Untuk create user (password wajib)
export const CreateUserSchema = UserSchema;

// Untuk update user (password opsional tapi kalau ada harus valid)
export const UpdateUserSchema = BaseUserSchema.extend({
  password: z
    .union([
      z
        .string()
        .min(6, { message: "Untuk update Password minimal 6 karakter" }),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),
});
