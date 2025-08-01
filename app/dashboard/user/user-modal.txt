"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dashboard/dialog";
import { Input } from "@/components/ui/dashboard/input";
import { Label } from "@/components/ui/dashboard/label";
import { Button } from "@/components/ui/dashboard/button";
import { useState, useEffect } from "react";
import { UserSchema } from "@/lib/validations/user-schema";
import { z } from "zod";

type User = z.infer<typeof UserSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = initialData
      ? UserSchema.omit({ password: true }) // saat edit, password tidak divalidasi
      : UserSchema;

    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof User, string>> = {};
      const zodErrors = result.error.flatten().fieldErrors;

      Object.entries(zodErrors).forEach(([key, messages]) => {
        const typedKey = key as keyof User;
        if (messages && messages.length > 0) {
          fieldErrors[typedKey] = messages[0];
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
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
          {!initialData && (
            <div>
              <Label htmlFor="password">Password</Label>
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
          )}
          <div>
            <Label htmlFor="level">Level</Label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.level && (
              <p className="text-sm text-red-500">{errors.level}</p>
            )}
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full">
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
