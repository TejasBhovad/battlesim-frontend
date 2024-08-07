import { NextResponse } from "next/server";
import { model } from "@/utils/gemini";
import { generateText } from "ai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const authSecret = process.env.AUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { gameState } = data;
    console.log("Game state in API:", gameState);

    const requiredParams = ["game_map", "player_battlions", "credits"];
    for (const param of requiredParams) {
      if (!gameState || !gameState[param]) {
        return NextResponse.json(
          { error: `Missing required gameState parameter: ${param}` },
          { status: 400 }
        );
      }
    }

    const prompt = `The game state is as follows: ${JSON.stringify(
      gameState
    )}. Return only a JSON object in the following format: 
    const aiData = {
      battalions: [
        {
          type: "warrior",
          avgCenter: [1, 1],
          troops: [
            [1, 1],
            [0, 1],
            [1, 0],
          ],
        },
        {
          type: "archer",
          avgCenter: [1, 2],
          troops: [
            [1, 2],
            [0, 2],
            [1, 3],
          ],
        },
      ],
    };`;

    const { text } = await generateText({
      model: model,
      prompt: prompt,
      system:
        "You are playing a game of Tower Defense. Your aim is to defend your base from enemy battalions. Return only a JSON object with the specified format, dont include it in anything lese direct json object.",
    });
    // const { object } = await generateObject({
    //   model: model,
    //   schema: z.object({
    //     battalions: z.array(
    //       z.object({
    //         type: z.string(),
    //         avgCenter: z.array(z.number()),
    //         troops: z.array(z.array(z.number())),
    //       })
    //     ),
    //   }),
    //   prompt: prompt,
    // });
    const cleanedText = text
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    // Parse the cleaned string to a JavaScript object
    const jsonObject = JSON.parse(cleanedText);
    console.log("Response:", jsonObject);
    return NextResponse.json(jsonObject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data", details: error.message },
      { status: 400 }
    );
  }
}
