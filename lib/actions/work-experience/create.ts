"use server";

import { sql } from "@/lib/db";
import { WorkExperienceForm } from "@/lib/types/work-experience";

// 🔒 Utility untuk konversi string atau array menjadi string[]
const safeArray = (value?: string[] | string | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      // fallback: pisah berdasarkan koma
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export async function createWorkExperience(data: WorkExperienceForm) {
  const {
    company = "",
    location,
    role = "",
    logoUrl,
    startDate = "",
    endDate,
    summary,
    achievements,
    skillIds,
  } = data;

  // 🧪 Validasi minimal data yang dibutuhkan
  if (!company || !role || !startDate) {
    throw new Error("Company, role, and start date are required.");
  }

  // 🧼 Sanitasi input
  const safeEndDate = endDate?.trim() || null;
  const safeSummary = safeArray(summary);
  const safeAchievements = safeArray(achievements);
  const safeSkillIds = safeArray(skillIds);

  // 🐞 Debug log
  console.log("📦 Data sebelum insert:");
  console.log("Company:", company);
  console.log("Location:", location);
  console.log("Role:", role);
  console.log("Start Date:", startDate);
  console.log("End Date:", safeEndDate);
  console.log("Summary (array):", safeSummary);
  console.log("Achievements (array):", safeAchievements);
  console.log("Skill IDs (uuid[]):", safeSkillIds);

  console.log("🧪 Type summary:", typeof summary, Array.isArray(summary));
  console.log(
    "🧪 Type safeSummary:",
    typeof safeSummary,
    Array.isArray(safeSummary)
  );
  console.log("🧪 Value safeSummary:", safeSummary);

  try {
    // 🧾 Insert ke tabel utama
    const result = await sql`
    INSERT INTO work_experiences (
      company,
      location,
      role,
      logo_url,
      start_date,
      end_date,
      summary,
      achievements
    ) VALUES (
      ${company},
      ${location ?? null},
      ${role},
      ${logoUrl ?? null},
      ${startDate},
      ${safeEndDate},
      ${sql.array(safeSummary)}, 
      ${sql.array(safeAchievements)}
    )
    RETURNING id
  `;

    const workExperienceId = result[0].id;

    // 🔗 Insert relasi skill jika ada
    if (safeSkillIds.length > 0) {
      await sql`
    INSERT INTO work_experience_skills (work_experience_id, skill_id)
    SELECT ${workExperienceId}, unnest(${sql.array(safeSkillIds)})::uuid[]
  `;
    }

    console.log("✅ Work experience berhasil disimpan.");
  } catch (error) {
    console.error("❌ Error inserting work experience:", error);
    throw new Error("Gagal menyimpan data pengalaman kerja.");
  }
}
