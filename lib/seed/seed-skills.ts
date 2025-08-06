import dotenv from "dotenv";
dotenv.config();

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedSkills() {
  try {
    // Cek koneksi
    const result = await sql`SELECT NOW()`;
    console.log("✅ DB connected at", result[0].now);

    // Buat tabel jika belum ada
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
         updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Data dummy
    const skillNames = [
      "Node.js",
      "PostgreSQL",
      "Docker",
      "FreePBX",
      "Yeastar",
      "Networking",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ];

    for (const name of skillNames) {
      await sql`
        INSERT INTO skills (name)
        VALUES (${name})
        ON CONFLICT (name) DO NOTHING;
      `;
    }

    console.log("✅ Skills seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedSkills();
