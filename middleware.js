import { NextResponse } from "next/server";

export async function middleware(req) {
  // Check if the request is for the /api/proxy route
  if (req.nextUrl.pathname === "/api/proxy") {
    // Check if the request has a valid authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.AUTH_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/proxy"],
};
