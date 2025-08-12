"use server";

import { sql } from "@/lib/db";
import type { HeroSection } from "@/lib/types/hero-section";

/**
 * Mengambil data Hero Section terbaru (1 record)
 */
export async function getHeroSection(): Promise<HeroSection | null> {
  try {
    const result = await sql<HeroSection[]>`
      SELECT id, title, highlight, description, created_at, updated_at
      FROM hero_section
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return result[0] ?? null;
  } catch (err) {
    console.error("❌ Gagal mengambil data Hero Section:", err);
    throw new Error("Gagal mengambil data Hero Section");
  }
}

export async function countHeroSection(): Promise<number> {
  try {
    const result = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM hero_section
    `;

    return result[0]?.count ?? 0;
  } catch (err) {
    console.error("❌ Gagal menghitung data Hero Section:", err);
    throw new Error("Gagal menghitung data Hero Section");
  }
}
