import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.REMOTE_FILE;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch resource" },
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();
    const res = new Response(Buffer.from(data), {
      headers: {
        "Content-Type": "application/js",
        "Content-Disposition": "inline",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
