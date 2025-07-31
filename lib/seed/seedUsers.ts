// lib/seed/seedUsers.ts
import { sql } from "../db";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: passwordAdmin,
      level: "admin",
    },
  ];

  // Tambahkan 19 user biasa
  for (let i = 1; i <= 19; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: await bcrypt.hash(`user${i}pass`, 10),
      level: "user",
    });
  }

  // Masukkan ke database, hindari duplicate email
  for (const user of users) {
    await sql`
      INSERT INTO users (name, email, password, level)
      VALUES (${user.name}, ${user.email}, ${user.password}, ${user.level})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  console.log("✅ Seeded 20 users.");
}
