"use server";
export async function fetchGameScript() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_SECRET}`, // Add your authorization token here
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load the game script");
    }

    return await response.text();
  } catch (error) {
    console.error("Error loading game script:", error);
    throw error;
  }
}
