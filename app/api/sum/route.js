import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the incoming JSON data
    const data = await req.json();

    // Extract the two numbers from the request body
    const { num1, num2 } = data;

    // Validate that both num1 and num2 are provided and are numbers
    if (typeof num1 !== "number" || typeof num2 !== "number") {
      throw new Error("Both num1 and num2 must be valid numbers.");
    }

    // Calculate sum and multiplication
    const sum = num1 + num2;
    const multiplication = num1 * num2;

    // Return the results
    return NextResponse.json({
      message: "Data processed successfully!",
      sum: sum,
      multiplication: multiplication,
    });
  } catch (error) {
    // Handle errors (e.g., JSON parsing errors or validation errors)
    return NextResponse.json(
      { error: "Failed to process data", details: error.message },
      { status: 400 }
    );
  }
}
