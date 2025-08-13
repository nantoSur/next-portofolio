"use server";

import { sql } from "@/lib/services/db";
import type { User } from "@/lib/types/user";

// Get list users
export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: User[]; totalPages: number }> {
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;

  const [users, countResult] = await Promise.all([
    sql<User[]>`
      SELECT id, name, email, level, created_at, updated_at
      FROM users
      WHERE name ILIKE ${searchQuery} OR email ILIKE ${searchQuery}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count
      FROM users
      WHERE name ILIKE ${searchQuery} OR email ILIKE ${searchQuery}
    `,
  ]);

  const totalCount = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { data: users, totalPages };
}
