import { NextResponse } from "next/server";
import { model } from "@/utils/gemini";
import { generateText } from "ai";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    // Check if the Authorization header is set and matches the AUTH_SECRET
    const authSecret = process.env.AUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { gameState } = data;
    console.log("gameState:", gameState);

    // Validate gameState object
    const requiredParams = [
      "attackers",
      "defenders",
      "wall_health",
      "last_moves",
      "world_size",
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
    const { text } = await generateText({
      model: model,
      prompt: prompt,
      system:
        "You are playing a game of Tower Defense. choose what would you do attack, fallback or defend the walls you have only limted no of troops you can direct them to any tile in given game size",
    });

    return NextResponse.json({
      response: "Success",
      response: text,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data", details: error.message },
      { status: 400 }
    );
  }
}
