"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dashboard/primitives/dialog";
import { Button } from "@/components/ui/dashboard/primitives/button";
import type { HeroSection } from "@/lib/types/hero-section";
import { updateHeroSection } from "@/lib/actions/hero-section/update";
import { toast } from "sonner";

interface HeroSectionModalProps {
  open: boolean;
  onClose: () => void;
  initialData: HeroSection;
}

export function HeroSectionModal({
  open,
  onClose,
  initialData,
}: HeroSectionModalProps) {
  const [form, setForm] = useState({
    id: "",
    title: "",
    highlight: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        title: initialData.title || "",
        highlight: initialData.highlight || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateHeroSection(form);

    setLoading(false);

    if (result.success) {
      toast.success("Data berhasil diperbarui!");
      onClose(); // Tutup modal
    } else {
      toast.error("Gagal memperbarui data");
      console.error(result.error);
    }
  };

  return (
    // <Dialog open={open} onOpenChange={() => {}} modal={true}>
    //   <DialogContent className="sm:max-w-lg">
    //     <DialogHeader>
    //       <DialogTitle>Edit Hero Section</DialogTitle>
    //     </DialogHeader>

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <div>
    //         <label className="text-sm font-medium">Title</label>
    //         <input
    //           name="title"
    //           value={form.title}
    //           onChange={handleChange}
    //           className="w-full border rounded px-3 py-2 text-sm"
    //           required
    //         />
    //       </div>

    //       <div>
    //         <label className="text-sm font-medium">Highlight</label>
    //         <input
    //           name="highlight"
    //           value={form.highlight}
    //           onChange={handleChange}
    //           className="w-full border rounded px-3 py-2 text-sm"
    //           required
    //         />
    //       </div>

    //       <div>
    //         <label className="text-sm font-medium">Description</label>
    //         <textarea
    //           name="description"
    //           value={form.description}
    //           onChange={handleChange}
    //           className="w-full border rounded px-3 py-2 text-sm"
    //           rows={4}
    //           required
    //         />
    //       </div>

    //       <div className="flex justify-end gap-2 pt-4">
    //         <DialogClose asChild>
    //           <Button type="button" variant="outline" onClick={onClose}>
    //             Batal
    //           </Button>
    //         </DialogClose>
    //         <Button type="submit" disabled={loading}>
    //           {loading ? "Menyimpan..." : "Simpan"}
    //         </Button>
    //       </div>
    //     </form>
    //   </DialogContent>
    // </Dialog>
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent className="sm:max-w-4xl  w-full max-w-full  bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8">
        <DialogHeader>
          <DialogTitle>Edit Hero Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Highlight
            </label>
            <input
              name="highlight"
              value={form.highlight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
