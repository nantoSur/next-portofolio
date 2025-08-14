import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies as nextCookies } from "next/headers";

export async function GET() {
  // ✅ await dulu cookies()
  const cookieStore = await nextCookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ user: null });

  try {
    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
