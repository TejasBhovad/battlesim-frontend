import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_KEY,
});
const model = google("models/gemini-1.5-flash");

export { model };
