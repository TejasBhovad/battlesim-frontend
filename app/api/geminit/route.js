import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const authSecret = process.env.AUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${authSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { gameState } = data;
    console.log("Game Credits:", gameState.credits);

    const requiredParams = ["game_map", "player_battlions", "credits"];
    for (const param of requiredParams) {
      if (!gameState || gameState[param] === undefined) {
        return NextResponse.json(
          { error: `Missing required gameState parameter: ${param}` },
          { status: 400 }
        );
      }
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });

    // Create a structured prompt for Gemini
    const prompt = `
      Game state:
      - Credits available: ${gameState.credits}
      - Map: ${JSON.stringify(gameState.game_map)}
      - Player battalions: ${JSON.stringify(gameState.player_battlions)}

      Create a strategic formation of battalions for a tower defense game.
      Warriors should be in front to protect archers who should be placed behind them.
      You have ${gameState.credits} credits to spend.

      Return ONLY a valid JSON object with this exact structure - no explanations, no extra text, just the JSON:
      {
        "battalions": [
          {
            "type": "warrior",
            "avgCenter": [x, y],
            "troops": [
              [x1, y1],
              [x2, y2],
              ...
            ]
          },
          {
            "type": "archer",
            "avgCenter": [x, y],
            "troops": [
              [x1, y1],
              [x2, y2],
              ...
            ]
          }
        ]
      }
    `;

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction:
        "You are an AI playing a tower defense game. Your task is to position battalions strategically. Return ONLY a valid JSON object with the battalions array as specified. No explanations, no extra text, just the JSON object.",
    });

    const responseText = result.response.text();
    console.log("Raw Gemini response:", responseText);

    // Parse the JSON response from Gemini
    let jsonObject;
    try {
      // First try direct parse
      jsonObject = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.log("First parse attempt failed:", parseError.message);

      // Try cleaning markdown code blocks if present
      const cleanedText = responseText
        .replace(/^```(json)?/, "")
        .replace(/```$/, "")
        .trim();

      try {
        jsonObject = JSON.parse(cleanedText);
      } catch (secondParseError) {
        console.error("JSON parsing failed:", secondParseError);
        console.error("Raw Gemini response:", responseText);

        // Return a default response as fallback
        return NextResponse.json({
          battalions: [
            {
              type: "warrior",
              avgCenter: [5, 2],
              troops: [
                [4, 2],
                [5, 2],
                [6, 2],
              ],
            },
            {
              type: "archer",
              avgCenter: [5, 4],
              troops: [
                [4, 4],
                [5, 4],
                [6, 4],
              ],
            },
          ],
          error: "AI response parsing failed, using default formation",
        });
      }
    }

    // Validate the structure of the parsed object
    if (!jsonObject.battalions || !Array.isArray(jsonObject.battalions)) {
      console.error("Invalid response structure:", jsonObject);
      throw new Error(
        "AI response doesn't contain the expected battalions array"
      );
    }

    console.log("Processed response:", jsonObject);
    return NextResponse.json(jsonObject);
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
