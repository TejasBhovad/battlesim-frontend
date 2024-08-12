import { NextResponse } from "next/server";
import { model } from "@/utils/gemini";
import { generateText } from "ai";

export async function POST(req) {
  const authHeader = req.headers.get("Authorization");
  const authSecret = process.env.AUTH_SECRET;

  // Check if the Authorization header is set and matches the AUTH_SECRET
  if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { gameState } = data;

  // Validate gameState object
  const requiredParams = [
    "user_moves",
    "ai_moves",
    "user_batalions",
    "ai_batalions",
    "castle_walls",
  ];

  for (const param of requiredParams) {
    if (!gameState || !gameState[param]) {
      return NextResponse.json(
        { error: `Missing required gameState parameter: ${param}` },
        { status: 400 }
      );
    }
  }

  const prompt = `The game state is as follows: ${JSON.stringify(gameState)}`;

  try {
    const { text } = await generateText({
      model: model,
      prompt: prompt,
      system:
        "You are playing a game of Tower Defense. Choose what you would do: attack, fallback, or defend the walls,Warriors should be in front; Archers behind them. Return only the action as a string.",
    });

    // Clean the text response
    const cleanedText = text
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    return NextResponse.json({
      action: cleanedText, // Return action directly
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data", details: error.message },
      { status: 400 }
    );
  }
}
