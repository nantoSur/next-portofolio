"use client";

import { getSkills } from "@/lib/actions/skills"; // add
import { Skill } from "@/lib/types/skill"; //add
import { useCallback, useEffect, useState } from "react";
import {
  getWorkExperiences,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
} from "@/lib/actions/work-experience";
import { Button } from "@/components/ui/dashboard/primitives/button";
import { Input } from "@/components/ui/dashboard/primitives/input";
import {
  ChevronDown,
  ChevronUp,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { WorkExperienceModal } from "./WorkExperienceModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/dashboard/primitives/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dashboard/primitives/dialog";

import {
  type WorkExperienceForm,
  type WorkExperience,
} from "@/lib/types/work-experience";
import Image from "next/image";

export default function WorkExperiencePage() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [data, setData] = useState<WorkExperience[]>([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<WorkExperience | null>(null);
  const [viewing, setViewing] = useState<WorkExperience | null>(null);
  const [deleting, setDeleting] = useState<WorkExperience | null>(null);
  const [sortField, setSortField] = useState<"company" | "role" | "startDate">(
    "startDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    try {
      const res = await getWorkExperiences({ search, limit, page });
      setData(res.data); // ✅ Data aslinya tetap WorkExperience
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data work experience");
    }
  }, [search, limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await getSkills(); // ✅ pakai fungsi yang benar
        setAllSkills(skills);
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data skills");
      }
    };

    fetchSkills(); // panggil saat mount
  }, []);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === "startDate") {
      return sortOrder === "asc"
        ? new Date(aVal ?? "").getTime() - new Date(bVal ?? "").getTime()
        : new Date(bVal ?? "").getTime() - new Date(aVal ?? "").getTime();
    }

    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSubmit = async (form: WorkExperienceForm) => {
    console.log("Form data submitted:", form);

    try {
      if (form.id) {
        await updateWorkExperience(form.id, form);
        toast.success("Data berhasil diperbarui");
      } else {
        await createWorkExperience(form);
        toast.success("Data berhasil dibuat");
      }
      fetchData();
      setOpenModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteWorkExperience(deleting.id!);
      toast.success("Data berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleting(null);
    }
  };

  function formatDateDMY(dateString?: string) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Data Work Experience</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search company or role"
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
            <SelectTrigger className="w-[120px]">
              <span className="text-sm">{limit} item</span>
            </SelectTrigger>
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
              setSortField("startDate");
              setSortOrder("desc");
            }}
          >
            Clear Filter
          </Button>
        </div>

        <Button onClick={() => setOpenModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-2">No</th>
              {["company", "role", "startDate", "endDate"].map((field) => (
                <th
                  key={field}
                  className="text-left px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(field as typeof sortField)}
                >
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  <span className="ml-1">
                    {sortField === field ? (
                      sortOrder === "asc" ? (
                        <ChevronUp className="inline w-3 h-3" />
                      ) : (
                        <ChevronDown className="inline w-3 h-3" />
                      )
                    ) : (
                      <ChevronUp className="inline w-3 h-3 opacity-30 rotate-180" />
                    )}
                  </span>
                </th>
              ))}
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-2">{item.company}</td>
                <td className="px-4 py-2">{item.role}</td>
                <td className="px-4 py-2">{formatDateDMY(item.startDate)}</td>
                <td className="px-4 py-2">
                  {item.endDate ? formatDateDMY(item.endDate) : "Present"}
                </td>

                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewing(item)}
                  >
                    <EyeIcon className="w-4 h-4" /> {/* 👈 Tambahkan ini */}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditing(item);
                      setOpenModal(true);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleting(item)}
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
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {openModal && (
        <WorkExperienceModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
          initialData={
            editing
              ? {
                  ...editing,
                  skillIds: editing.skills.map((s) => s.id),
                  summary: editing.summary ?? [], // fallback jika undefined
                  achievements: editing.achievements ?? [], // fallback jika undefined
                }
              : null
          }
          allSkills={allSkills}
        />
      )}

      {deleting && (
        <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          >
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                Hapus Data
              </DialogTitle>
            </DialogHeader>
            <p className="mb-4">
              Yakin ingin menghapus pengalaman kerja di{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {deleting.company}
              </strong>
              ?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewing && (
        <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="max-w-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <DialogHeader>
              <DialogTitle>Detail Work Experience</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-sm">
              {/* Logo Centered */}
              {viewing.logoUrl && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={viewing.logoUrl}
                    alt={`${viewing.company} logo`}
                    width={96}
                    height={96}
                    className="object-contain rounded shadow-md"
                  />
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Company:
                  </strong>
                  <p className="mt-1">{viewing.company}</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Role:
                  </strong>
                  <p className="mt-1">{viewing.role}</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Location:
                  </strong>
                  <p className="mt-1">{viewing.location || "-"}</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Start Date:
                  </strong>
                  <p className="mt-1">{formatDateDMY(viewing.startDate)}</p>
                </div>

                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    End Date:
                  </strong>
                  <p className="mt-1">
                    {viewing.endDate
                      ? formatDateDMY(viewing.endDate)
                      : "Present"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Skills:
                  </strong>
                  <p className="mt-1">
                    {viewing.skills.length > 0
                      ? viewing.skills.map((s) => s.name).join(", ")
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Summary & Achievements */}
              <div>
                <strong className="text-gray-900 dark:text-gray-100">
                  Summary:
                </strong>
                {viewing.summary?.length ? (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {viewing.summary.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1">-</p>
                )}
              </div>

              <div>
                <strong className="text-gray-900 dark:text-gray-100">
                  Achievements:
                </strong>
                {viewing.achievements?.length ? (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {viewing.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1">-</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewing(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
