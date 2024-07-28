import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    // Check if the Authorization header is set and matches the AUTH_SECRET
    const authSecret = process.env.AUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { num1, num2 } = data;
    console.log("num1:", num1, "num2:", num2);

    if (typeof num1 !== "number" || typeof num2 !== "number") {
      throw new Error("Both num1 and num2 must be valid numbers.");
    }

    const sum = num1 + num2;
    const multiplication = num1 * num2;

    return NextResponse.json({
      message: "Data processed successfully!",
      sum: sum,
      multiplication: multiplication,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data", details: error.message },
      { status: 400 }
    );
  }
}
