"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/dashboard/select";
import { Button } from "@/components/ui/dashboard/button";
import { Input } from "@/components/ui/dashboard/input";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/actions/user-actions";
import { UserModal } from "./user-modal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dashboard/dialog";

type User = {
  id: string;
  name: string;
  email: string;
  level: "admin" | "user";
  created_at: string;
  updated_at: string;
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  async function fetchData() {
    try {
      const res = await getUsers({ search, limit, page });
      setUsers(res.data ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Gagal mengambil data user");
    }
  }

  useEffect(() => {
    fetchData();
  }, [search, limit, page]);

  const handleUserSubmit = async (formData: {
    id?: string;
    name: string;
    email: string;
    password: string;
    level: "admin" | "user";
  }) => {
    try {
      if (formData.id) {
        await updateUser(formData.id, formData);
        toast.success("User berhasil diperbarui");
      } else {
        await createUser(formData);
        toast.success("User berhasil dibuat");
      }
      fetchData();
      setOpenModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error("❌ Gagal menyimpan user:", err);
      toast.error("Gagal menyimpan data user");
    }
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
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
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Level</th>
              <th className="text-left px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.level}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingUser(user);
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
          <DialogContent>
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
