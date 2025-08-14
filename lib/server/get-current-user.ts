//lib/server/get-cureent-user

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtUser {
  id: string;
  email: string;
  level: string;
}

export async function getCurrentUser(): Promise<JwtUser | null> {
  const cookieStore = await cookies(); // ✅ tambahkan await
  const token = cookieStore.get("token")?.value; // sekarang bisa pakai .get()
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as JwtUser;
    return user;
  } catch {
    return null;
  }
}
