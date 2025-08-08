import dotenv from "dotenv";
dotenv.config();

import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedWorkExperience() {
  try {
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
        ${"TechNova"},
        ${"Jakarta"},
        ${"Cloud Engineer"},
        ${"https://yourproject.supabase.co/storage/v1/object/public/logos/technova.png"},
        ${"2024-01-01"},
        ${"2025-01-01"},
        ${sql`ARRAY[${"Reduced call drop rate by 30%"}, ${"Migrated 20+ on-prem systems to cloud"}]::text[]`},
        ${sql`ARRAY[${"Implemented CI/CD pipelines with GitHub Actions"}, ${"Cut deployment time by 50%"}]::text[]`}
      )
      RETURNING id
    `;

    console.log("✅ Work experience seeded with ID:", result[0].id);
  } catch (error) {
    console.error("❌ Failed to seed work experience:", error);
  } finally {
    await sql.end();
  }
}

seedWorkExperience();
