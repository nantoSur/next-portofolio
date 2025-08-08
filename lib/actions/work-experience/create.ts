"use server";

import { sql } from "@/lib/db";
import { WorkExperienceForm } from "@/lib/types/work-experience";

// Helper agar selalu hasilkan array of string
const safeArray = (value?: string[] | string | null): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
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

  // Validasi minimal
  if (!company || !role || !startDate) {
    throw new Error("Company, role, and start date are required.");
  }

  const safeEndDate = endDate && endDate.trim() !== "" ? endDate : null;
  const safeSummary = safeArray(summary);
  const safeAchievements = safeArray(achievements);
  const safeSkillIds = safeArray(skillIds);

  const summaryArray = sql.array<string>(safeSummary, "text");
  const achievementsArray = sql.array<string>(safeAchievements, "text");

  try {
    // ✅ INSERT ke work_experiences
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
        ${summaryArray},
        ${achievementsArray}
      )
      RETURNING id
    `;

    const workExperienceId = result.rows[0].id;

    // ✅ INSERT ke work_experience_skills (relasi many-to-many)
    if (safeSkillIds.length > 0) {
      await sql`
        INSERT INTO work_experience_skills (work_experience_id, skill_id)
        SELECT ${workExperienceId}, unnest(${sql.array(safeSkillIds, "uuid")})
      `;
    }
  } catch (error) {
    console.error("❌ Error inserting work experience:", error);
    throw new Error("Gagal menyimpan data pengalaman kerja.");
  }
}
