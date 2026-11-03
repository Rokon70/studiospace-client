import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// Challenge 1: after BetterAuth login, issue a JWT and store it in an HTTPOnly cookie.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = jwt.sign(
    { email: session.user.email, name: session.user.name, image: session.user.image ?? "" },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

// Logout: clear the JWT cookie
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
