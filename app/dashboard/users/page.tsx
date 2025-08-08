"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/dashboard/select";
import { Button } from "@/components/ui/dashboard/button";
import { Input } from "@/components/ui/dashboard/input";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user-actions";
import { UserModal } from "./UserModal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dashboard/dialog";
import { z } from "zod";
import { UserSchema } from "@/lib/validations/user-schema";

type DBUser = {
  id: string;
  name: string;
  email: string;
  level: "admin" | "user";
  created_at: string;
  updated_at: string;
};

type UserForm = z.infer<typeof UserSchema> & { id?: string };

export default function UserPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserForm | null>(null);
  const [deletingUser, setDeletingUser] = useState<DBUser | null>(null);
  const [sortField, setSortField] = useState<
    "name" | "email" | "level" | "created_at"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    try {
      const res = await getUsers({ search, limit, page });
      setUsers(res.data ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Gagal mengambil data user");
    }
  }, [search, limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field: "name" | "email" | "level" | "created_at") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleUserSubmit = async (formData: UserForm) => {
    if (formData.id) {
      await updateUser(formData.id, formData);
      toast.success("User berhasil diperbarui");
    } else {
      const result = await createUser(formData);
      if (!result.success) {
        if (result.error === "EMAIL_EXISTS") {
          throw new Error("Email sudah digunakan");
        }
        throw new Error("Gagal menyimpan user");
      }
      toast.success("User berhasil dibuat");
    }

    fetchData();
    setOpenModal(false);
    setEditingUser(null);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      toast.success("User berhasil dihapus");
      fetchData();
    } catch (err) {
      console.error("❌ Gagal menghapus user:", err);
      toast.error("Gagal menghapus user");
    } finally {
      setDeletingUser(null);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aVal: string | Date = a[sortField];
    let bVal: string | Date = b[sortField];

    if (sortField === "created_at") {
      aVal = new Date(a.created_at);
      bVal = new Date(b.created_at);
    } else {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Data User</h1>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search name or email"
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
            <SelectTrigger className="w-[140px]">
              <span className="text-sm text-gray-700">{limit} item</span>
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
              setSortField("created_at");
              setSortOrder("desc");
            }}
          >
            Clear Filter
          </Button>
        </div>

        <Button onClick={() => setOpenModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-2">No</th>
              {(["name", "email", "level", "created_at"] as const).map(
                (field) => (
                  <th
                    key={field}
                    className="text-left px-4 py-2 cursor-pointer select-none"
                    onClick={() => handleSort(field)}
                  >
                    {field === "created_at"
                      ? "Created At"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    <span className="ml-1 inline-block">
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
                )
              )}
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.level}</td>
                <td className="px-4 py-2">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const { id, name, email, level } = user;
                      setEditingUser({ id, name, email, level, password: "" });
                      setOpenModal(true);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeletingUser(user)}
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
        <UserModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingUser(null);
          }}
          onSubmit={handleUserSubmit}
          initialData={editingUser}
        />
      )}

      {deletingUser && (
        <Dialog
          open={!!deletingUser}
          onOpenChange={() => setDeletingUser(null)}
        >
          <DialogContent
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Hapus User</DialogTitle>
            </DialogHeader>
            <p>
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{deletingUser.name}</strong>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingUser(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
