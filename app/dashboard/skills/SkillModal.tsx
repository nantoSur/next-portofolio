"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dashboard/primitives/dialog";
import { Input } from "@/components/ui/dashboard/primitives/input";
import { Button } from "@/components/ui/dashboard/primitives/button";

interface SkillForm {
  id?: string;
  name: string;
}

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (formData: SkillForm) => Promise<void>;
  initialData?: SkillForm | null;
}

export default function SkillModal({
  open,
  onClose,
  onOpenChange,
  onSubmit,
  initialData,
}: SkillModalProps) {
  const [form, setForm] = useState<SkillForm>({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "" });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="g-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Skill" : "Tambah Skill"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Nama Skill
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Contoh: React, PostgreSQL"
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
