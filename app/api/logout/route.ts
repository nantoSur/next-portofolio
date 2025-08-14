import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0, // hapus cookie
  });

  return NextResponse.json({ success: true });
}
