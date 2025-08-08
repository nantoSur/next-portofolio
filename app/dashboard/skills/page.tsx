"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/dashboard/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dashboard/dialog";
import { Button } from "@/components/ui/dashboard/button";
import { Input } from "@/components/ui/dashboard/input";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/actions/skills";

import SkillModal from "./SkillModal";
import { z } from "zod";
import { SkillSchema } from "@/lib/validations/skill-schema";

export type DBSkill = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SkillForm = z.infer<typeof SkillSchema> & { id?: string };

export default function SkillsPage() {
  const [skills, setSkills] = useState<DBSkill[]>([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillForm | null>(null);
  const [sortField, setSortField] = useState<"name" | "created_at">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error("❌ Failed to fetch skills:", err);
      toast.error("Gagal mengambil data skills");
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSkillSubmit = async (formData: SkillForm) => {
    try {
      if (formData.id) {
        await updateSkill({ id: formData.id, name: formData.name });
        toast.success("Skill berhasil diperbarui");
      } else {
        await createSkill(formData.name); // ⬅ kirim langsung string
        toast.success("Skill berhasil ditambahkan");
      }
      setOpenModal(false);
      setEditingSkill(null);
      await fetchSkills();
    } catch (err) {
      console.error("❌ Error saving skill:", err);
      toast.error("Gagal menyimpan skill");
    }
  };

  // const handleDelete = async (skill: DBSkill) => {
  //   const confirm = window.confirm(`Hapus skill "${skill.name}"?`);
  //   if (!confirm) return;

  //   try {
  //     await deleteSkill(skill.id);
  //     toast.success("Skill berhasil dihapus");
  //     await fetchSkills();
  //   } catch (err) {
  //     toast.error("Gagal menghapus skill");
  //   }
  // };
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSkillToDelete, setSelectedSkillToDelete] =
    useState<DBSkill | null>(null);

  const handleDeleteConfirm = async () => {
    if (!selectedSkillToDelete) return;
    try {
      await deleteSkill(selectedSkillToDelete.id);
      toast.success("Skill berhasil dihapus");
      setDeleteConfirmOpen(false);
      setSelectedSkillToDelete(null);
      await fetchSkills();
    } catch {
      toast.error("Gagal menghapus skill");
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    let aVal: string | Date = a[sortField];
    let bVal: string | Date = b[sortField];

    if (sortField === "created_at") {
      aVal = new Date(a.created_at);
      bVal = new Date(b.created_at);
    } else {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedSkills = sortedSkills.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(sortedSkills.length / limit);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Data Skills</h1>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Cari nama skill"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">{limit} / page</SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setLimit(5);
              setPage(1);
              setSortField("created_at");
              setSortOrder("desc");
            }}
          >
            Reset
          </Button>
        </div>

        <Button
          onClick={() => {
            setEditingSkill(null);
            setOpenModal(true);
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Skill
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2">No</th>
              {["name", "created_at"].map((field) => (
                <th
                  key={field}
                  className="text-left px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(field as "name" | "created_at")}
                >
                  {field === "created_at" ? "Created At" : "Name"}
                  <span className="inline-block ml-1">
                    {sortField === field ? (
                      sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3 inline" />
                      ) : (
                        <ChevronDown className="w-3 h-3 inline" />
                      )
                    ) : (
                      <ChevronUp className="w-3 h-3 inline opacity-30 rotate-180" />
                    )}
                  </span>
                </th>
              ))}
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSkills.map((skill, index) => (
              <tr key={skill.id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-2">{skill.name}</td>
                <td className="px-4 py-2">
                  {new Date(skill.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingSkill({ id: skill.id, name: skill.name });
                      setOpenModal(true);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedSkillToDelete(skill);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <p>
          Page {page} dari {totalPages}
        </p>
        <div className="space-x-2">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Sebelumnya
          </Button>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      <SkillModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingSkill(null);
        }}
        onSubmit={handleSkillSubmit}
        initialData={editingSkill}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Hapus Skill</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground px-1">
            Apakah Anda yakin ingin menghapus skill{" "}
            <span className="font-semibold text-foreground">
              {selectedSkillToDelete?.name}
            </span>
            ?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-md px-6"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="rounded-md px-6"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
