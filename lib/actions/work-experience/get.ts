//lib/actions/work-experinces/get.ts
"use server";

import { sql } from "@/lib/db";
import { WorkExperience } from "@/lib/types/work-experience";

type GetWorkExperiencesParams = {
  search?: string;
  limit?: number;
  page?: number;
};

export async function getWorkExperiences({
  search,
  limit = 10,
  page = 1,
}: GetWorkExperiencesParams): Promise<{
  data: WorkExperience[];
  totalPages: number;
}> {
  const offset = (page - 1) * limit;

  // ✅ Query data dengan LEFT JOIN dan JSON_AGG
  const result = await sql`
    SELECT 
      we.id,
      we.company,
      we.role,
      we.location,
      we.logo_url AS "logoUrl",
      we.start_date AS "startDate",
      we.end_date AS "endDate",
      COALESCE(we.summary, '{}') AS summary,
      COALESCE(we.achievements, '{}') AS achievements,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', s.id,
            'name', s.name
          )
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS skills
    FROM work_experiences we
    LEFT JOIN work_experience_skills wes ON wes.work_experience_id = we.id
    LEFT JOIN skills s ON s.id = wes.skill_id
    WHERE ${
      search
        ? sql`we.company ILIKE ${"%" + search + "%"} OR we.role ILIKE ${
            "%" + search + "%"
          }`
        : sql`TRUE`
    }
    GROUP BY we.id
    ORDER BY we.start_date DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;

  // ✅ Query total untuk pagination
  const countResult = await sql`
    SELECT COUNT(DISTINCT we.id) AS total
    FROM work_experiences we
    LEFT JOIN work_experience_skills wes ON wes.work_experience_id = we.id
    LEFT JOIN skills s ON s.id = wes.skill_id
    WHERE ${
      search
        ? sql`we.company ILIKE ${"%" + search + "%"} OR we.role ILIKE ${
            "%" + search + "%"
          }`
        : sql`TRUE`
    };
  `;

  const totalItems = Number(countResult[0].total);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: result.map((row) => ({
      id: row.id,
      company: row.company,
      role: row.role,
      location: row.location,
      logoUrl: row.logoUrl,
      startDate: row.startDate,
      endDate: row.endDate,
      summary: row.summary ?? [],
      achievements: row.achievements ?? [],
      skills: row.skills,
    })),
    totalPages,
  };
}
