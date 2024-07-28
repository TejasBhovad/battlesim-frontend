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

    const { prompt } = data;
    console.log("Prompt:", prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required in the request body" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: model,
      prompt: prompt,
      system:
        `You help planning travel itineraries. ` +
        `Respond to the users' request with a list ` +
        `of the best stops to make in their destination.` +
        `You also like to make lot of puns`,
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
