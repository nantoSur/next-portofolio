"use client";

import { useEffect, useState } from "react";
import { getHeroSection } from "@/lib/actions/hero-section/get";
import type { HeroSection } from "@/lib/types/hero-section";
import { Card } from "@/components/ui/dashboard/card";
import { Button } from "@/components/ui/dashboard/button";
import { ReloadIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { HeroSectionModal } from "./HeroSectionModal";

export default function HeroSectionPage() {
  const [data, setData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const result = await getHeroSection();
      setData(result);
    } catch (err) {
      console.error("❌ Gagal mengambil data hero section:", err);
      toast.error("Gagal mengambil data hero section");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Hero Section</h1>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Memuat...
            </>
          ) : (
            "Muat Ulang"
          )}
        </Button>
      </div>

      {!data ? (
        <p className="text-gray-500">Tidak ada data.</p>
      ) : (
        <Card className="relative rounded-2xl p-6 dark:bg-gray-800">
          {/* Tombol Edit */}
          <Button
            variant="outline"
            className="absolute top-4 right-4 rounded-full px-4 py-2 text-sm text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil1Icon className="w-4 h-4" />
            Edit
          </Button>

          <h2 className="text-lg font-semibold mb-6">Informasi Hero Section</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-gray-500">Title</p>
              <p className="font-medium">{data.title}</p>
            </div>
            <div>
              <p className="text-gray-500">Highlight</p>
              <p className="font-medium">{data.highlight}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-gray-500">Description</p>
              <p className="font-medium">{data.description}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500">Update At</p>
              <p className="text-sm text-gray-600">
                {new Date(data.updated_at).toLocaleString("id")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* MODAL */}
      {data && (
        <HeroSectionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={data}
        />
      )}
    </div>
  );
}
