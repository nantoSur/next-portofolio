"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dashboard/primitives/dialog";
import { Input } from "@/components/ui/dashboard/primitives/input";
import { Label } from "@/components/ui/dashboard/primitives/label";
import { Button } from "@/components/ui/dashboard/primitives/button";
import { useState, useEffect } from "react";
import { UserSchema } from "@/lib/validations/user-schema";
import { z } from "zod";
import { DuplicateEmailError } from "@/lib/utils/errors";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "@/lib/validations/user-schema";

type User = z.infer<typeof UserSchema> & { id?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>; // ubah ke async
  initialData?: User | null;
};

export function UserModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
    level: "user",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
    } else {
      setForm({ name: "", email: "", password: "", level: "user" });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Validasi client-side
  //   const schema = initialData
  //     ? UserSchema.omit({ password: true })
  //     : UserSchema;

  //   const result = schema.safeParse(form);

  //   if (!result.success) {
  //     const zodErrors = result.error.flatten().fieldErrors;
  //     const fieldErrors: Partial<Record<keyof User, string>> = {};
  //     Object.entries(zodErrors).forEach(([key, messages]) => {
  //       if (messages?.length) fieldErrors[key as keyof User] = messages[0];
  //     });
  //     setErrors(fieldErrors);
  //     return;
  //   }

  //   try {
  //     setErrors({});
  //     await onSubmit(form); // ← kalau berhasil, baru lanjut
  //     onClose(); // ← hanya ditutup kalau berhasil
  //   } catch (err) {
  //     const message = err instanceof Error ? err.message : "Terjadi kesalahan";
  //     if (message.includes("Email sudah ada")) {
  //       setErrors((prev) => ({ ...prev, email: message }));
  //     } else {
  //       alert(message);
  //     }
  //   }

  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const schema = UserSchema.refine(
    //   (data) => {
    //     if (initialData && data.password && data.password.length < 6) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "Password minimal 6 karakter",
    //     path: ["password"],
    //   }
    // );
    // Gunakan schema yang sesuai
    const schema = initialData ? UpdateUserSchema : CreateUserSchema;

    const result = schema.safeParse(form);

    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Partial<Record<keyof User, string>> = {};
      Object.entries(zodErrors).forEach(([key, messages]) => {
        if (messages?.length) fieldErrors[key as keyof User] = messages[0];
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setErrors({});
      await onSubmit(form); // bisa lempar error jika email sudah digunakan
      onClose(); // hanya dipanggil kalau tidak error
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      if (
        err instanceof DuplicateEmailError ||
        message.includes("Email sudah digunakan")
      ) {
        setErrors((prev) => ({ ...prev, email: "Email sudah digunakan" }));
      } else {
        alert(message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          {/* password */}
          <div>
            <Label htmlFor="password">
              Password{" "}
              {initialData && (
                <span className="text-xs text-gray-500">
                  (Kosongkan jika tidak diubah)
                </span>
              )}
            </Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="level">Level</Label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.level && (
              <p className="text-sm text-red-500">{errors.level}</p>
            )}
          </div>
          <div className="pt-2 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
