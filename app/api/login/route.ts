//app/api/login/route
import { sql } from "@/lib/services/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password }: LoginRequestBody = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id, email, password, level
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const user = result[0];
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET belum di-set di .env.local");

    // const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    //   expiresIn: "1d",
    // });

    const token = jwt.sign(
      { id: user.id, email: user.email, level: user.level }, // <-- pastikan ada level
      secret,
      { expiresIn: "1d" }
    );

    // Simpan cookie httpOnly, path "/", maxAge 1 hari
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // localhost = false
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
