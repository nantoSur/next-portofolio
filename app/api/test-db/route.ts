// app/api/test-db/route.ts
import { sql } from "@/lib/db"; // pastikan path ini benar

export async function GET() {
  try {
    const result = await sql`SELECT 1 + 1 AS result`;
    return Response.json({ success: true, result });
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
