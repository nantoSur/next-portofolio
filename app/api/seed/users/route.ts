// app/api/seed/users/route.ts
import { NextResponse } from "next/server";
import { createUsersTable } from "@/lib/seed/createTableUsers";
import { seedUsers } from "@/lib/seed/seedUsers";

export async function GET() {
  try {
    await createUsersTable();
    await seedUsers();

    return NextResponse.json({ message: "Users table created and seeded." });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed users." },
      { status: 500 }
    );
  }
}
