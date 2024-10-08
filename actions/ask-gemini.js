"use server";

export const AskGemini = async ({ prompt }) => {
  try {
    const authSecret = process.env.AUTH_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Ensure BASE_URL is set in your environment variables

    const response = await fetch(`${baseUrl}/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSecret}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Response error details:", response);
      throw new Error("Failed to process data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in AskGemini:", error);
    return { error: "Failed to process data", errorDetails: error.message };
  }
};
