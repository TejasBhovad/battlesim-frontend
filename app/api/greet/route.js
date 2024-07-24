import { NextResponse } from "next/server";

export async function GET(req) {
  // Extract the name query parameter from the URL
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "World";

  // Return a JSON response with a greeting message
  return NextResponse.json({
    message: `Hello, ${name}!`,
    other_data: "This is a JSON response",
  });
}

// URL: http://localhost:3000/api/greet?name=SamA
