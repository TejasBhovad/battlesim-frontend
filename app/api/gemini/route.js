import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req) {
  try {
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
      if (!gameState || gameState[param] === undefined) {
        return NextResponse.json(
          { error: `Missing required gameState parameter: ${param}` },
          { status: 400 }
        );
      }
    }

    const prompt = `The game state is as follows: ${JSON.stringify(gameState)}. 
      Based on this state, choose ONE action: "attack", "fallback", or "defend".`;

    const { text } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: prompt,
      system:
        "You are playing a game of Tower Defense. Choose what you would do: attack, fallback, or defend the walls. Warriors should be in front; Archers behind them. Return ONLY one of these three words without quotes or additional text: attack, fallback, defend",
      temperature: 0.2, // Lower temperature for more deterministic output
    });

    // Normalize the response to ensure it's one of the expected actions
    const normalizedAction = text.trim().toLowerCase();
    const validActions = ["attack", "fallback", "defend"];

    if (!validActions.includes(normalizedAction)) {
      console.log(`Unexpected AI response: "${text}"`);
      // Default to a safe action if response is invalid
      return NextResponse.json({
        action: "defend",
        note: "AI response was invalid, defaulted to defend",
      });
    }

    return NextResponse.json({
      action: normalizedAction,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to process data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
