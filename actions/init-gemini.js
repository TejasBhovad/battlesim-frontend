"use server";

export const InitGemini = async ({ gameState }) => {
  try {
    const authSecret = process.env.AUTH_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Ensure BASE_URL is set in your environment variables
    console.log("InitGemini:", gameState);
    const response = await fetch(`${baseUrl}/api/geminit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSecret}`,
      },
      body: JSON.stringify({ gameState }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Response error details:", response);
      throw new Error("Failed to process data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in InitGemini:", error);
    return { error: "Failed to process data", errorDetails: error.message };
  }
};
