import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 }
    );
  }

  const user = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: (role || "STUDENT") as "STUDENT" | "TEACHER" | "ADMIN",
  };

  const token = createSessionToken(user);

  const response = NextResponse.json({ user, token });

  response.cookies.set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
