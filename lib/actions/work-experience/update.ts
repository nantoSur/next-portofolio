"use server";

import { sql } from "@/lib/db";
import { WorkExperienceForm } from "@/lib/types/work-experience";
import { v4 as uuidv4 } from "uuid"; // Pastikan import ini sudah ada

// Helper untuk ubah undefined jadi null
function safeValue<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

// Helper untuk pastikan array string (tidak undefined)
function safeArray(value?: string[] | null): string[] {
  if (!value) return [];
  return value;
}

// Utility untuk amanin tanggal
function safeDate(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return value;
}

export async function updateWorkExperience(
  id: string,
  data: WorkExperienceForm
) {
  await sql.begin(async (tx) => {
    await tx`
      UPDATE work_experiences
      SET
        role = ${safeValue(data.role)},
        company = ${safeValue(data.company)},
        location = ${safeValue(data.location)},
        logo_url = ${safeValue(data.logoUrl)},
         start_date = ${safeDate(data.startDate)},
        end_date = ${safeDate(data.endDate)},
        summary = ${sql.array(safeArray(data.summary))},
        achievements = ${sql.array(safeArray(data.achievements))},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    // Delete old skills
    await tx`DELETE FROM work_experience_skills WHERE work_experience_id = ${id}`;

    // Insert new skills
    for (const skillId of data.skillIds) {
      await tx`
        INSERT INTO work_experience_skills (id, work_experience_id, skill_id)
        VALUES (${uuidv4()}, ${id}, ${skillId})
      `;
    }
  });
}
