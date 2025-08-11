// page work
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

import { SkillTransferSelect } from "@/components/ui/dashboard/shared/SkillTransferSelect";

import { useState, useEffect } from "react";
import ListInput from "@/components/ui/dashboard/form/ListInput";

import { WorkExperienceSchema } from "@/lib/validations/work-experience-schema";
import type { WorkExperienceForm } from "@/lib/types/work-experience";
import type { Skill } from "@/lib/types/skill";

// Props dari modal
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WorkExperienceForm) => Promise<void>;
  initialData?: WorkExperienceForm | null;
  allSkills: Skill[];
}

// Komponen Modal
export function WorkExperienceModal({
  open,
  onClose,
  onSubmit,
  initialData,
  allSkills,
}: Props) {
  const [form, setForm] = useState<WorkExperienceForm>({
    id: undefined,
    role: "",
    company: "",
    location: "",
    logoUrl: "",
    startDate: "",
    endDate: "",
    summary: [],
    achievements: [] as string[],
    skillIds: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkExperienceForm, string>>
  >({});

  // Reset form saat initialData berubah atau modal dibuka
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: undefined,
        role: "",
        company: "",
        location: "",
        logoUrl: "",
        startDate: "",
        endDate: "",
        summary: [],
        achievements: [],
        skillIds: [],
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: "summary" | "achievements"
  ) => {
    const lines = e.target.value.split("\n").filter(Boolean);
    setForm({ ...form, [field]: lines });
  };

  const handleSkillChange = (ids: string[]) => {
    setForm({ ...form, skillIds: ids });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = WorkExperienceSchema.safeParse(form);
    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Partial<Record<keyof WorkExperienceForm, string>> = {};
      Object.entries(zodErrors).forEach(([key, messages]) => {
        if (messages?.length) {
          fieldErrors[key as keyof WorkExperienceForm] = messages[0];
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setErrors({});
      await onSubmit(form); // <- ini akan panggil createWorkExperience atau updateWorkExperience
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto w-[700px] max-w-3xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Work Experience" : "Add Work Experience"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              name="company"
              value={form.company}
              onChange={handleChange}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input name="role" value={form.role} onChange={handleChange} />
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
            />
            {errors.logoUrl && (
              <p className="text-sm text-red-500">{errors.logoUrl}</p>
            )}
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              name="endDate"
              type="date"
              value={form.endDate || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <ListInput
              label="Summary"
              items={form.summary}
              onChange={(newList) => setForm({ ...form, summary: newList })}
            />
          </div>

          <div>
            <ListInput
              label="Achievements (1 per baris)"
              items={form.achievements ?? []}
              onChange={(newAchievements) =>
                setForm({ ...form, achievements: newAchievements })
              }
            />
          </div>

          <div>
            <Label>Skills</Label>

            <SkillTransferSelect
              options={allSkills.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
              selected={form.skillIds}
              onChange={(newIds) => setForm({ ...form, skillIds: newIds })}
            />
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
