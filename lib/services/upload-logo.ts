"use server";

import { supabaseServer } from "@/lib/services/supabase-client";

export async function uploadLogo(file: File) {
  const supabase = supabaseServer();

  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const bucketName = "nanto-portofolio-logo";

  // Pastikan bucket sudah ada
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === bucketName)) {
    await supabase.storage.createBucket(bucketName, { public: true });
  }

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  // Ambil public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data.publicUrl;
}
