"use server";
import { sql } from "@/lib/db";
import { WorkExperienceForm } from "@/lib/types/work-experience";

export async function updateWorkExperience(
  id: string,
  data: WorkExperienceForm
) {
  await sql.begin(async (tx) => {
    await tx`
      UPDATE work_experiences
      SET
        role = ${data.role},
        company = ${data.company},
        location = ${data.location || null},
        logo_url = ${data.logo_url || null},
        start_date = ${data.start_date || null},
        end_date = ${data.end_date || null},
        summary = ${data.summary || []},
        achievements = ${data.achievements || []},
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
