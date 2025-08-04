import dotenv from "dotenv";
dotenv.config();

import postgres from "postgres";

console.log("🔍 POSTGRES_URL =", process.env.POSTGRES_URL);

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function createTableHeroSection() {
  try {
    // ✅ Cek koneksi
    const result = await sql`SELECT NOW()`;
    console.log("✅ DB time:", result);

    // ✅ Buat table jika belum ada
    await sql`
      CREATE TABLE IF NOT EXISTS hero_section (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        highlight TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Tabel hero_section berhasil dibuat/ada");

    // ✅ Insert data dummy (bisa kamu ganti nanti)
    await sql`
      INSERT INTO hero_section (title, highlight, subtitle, description)
      VALUES (
        'Hi, I am John Doe',
        'VoIP Specialist',
        'Helping businesses migrate to modern IP PBX systems',
        'Experienced in Yeastar, FreePBX, Proxmox, and managing both on-prem and cloud PBX systems.'
      )
      ON CONFLICT DO NOTHING;
    `;
    console.log("✅ Data hero_section berhasil disisipkan");

    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal menjalankan test:", error);
    process.exit(1);
  }
}

createTableHeroSection();
