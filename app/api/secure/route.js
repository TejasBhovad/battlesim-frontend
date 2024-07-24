import { NextResponse } from "next/server";

export async function GET(req) {
  // Get the Authorization header from the request
  const authHeader = req.headers.get("Authorization");

  // Check if the Authorization header is set and matches the AUTH_SECRET
  const authSecret = process.env.AUTH_SECRET;

  if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 } // HTTP status code for Unauthorized
    );
  }

  // Return a simple string message
  return NextResponse.json({ message: "Hello, this is your secret message!" });
}
