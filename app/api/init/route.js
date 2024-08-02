import { NextResponse } from "next/server";

// POST method to set gameData in a cookie
export async function POST(req) {
  const data = await req.json();
  const { gameData } = data;

  const response = NextResponse.json({
    message: "Game data set successfully",
    data: gameData,
  });

  // Set the gameData cookie
  response.cookies.set("gameData", JSON.stringify(gameData), {
    httpOnly: true, // Prevent JavaScript access
    maxAge: 60 * 60, // 1 hour
    path: "/", // Make the cookie available across the site
  });

  return response;
}

// GET method to retrieve gameData from the cookie
export async function GET(req) {
  console.log("Received GET request"); // Log when GET is called

  const cookie = req.cookies.get("gameData");

  if (cookie) {
    console.log("Cookie:", cookie);
  }

  if (!cookie) {
    return NextResponse.json(
      { dataSet: false, gameState: null },
      { status: 200 }
    );
  }

  try {
    const gameData = JSON.parse(cookie.value); // Access the value property
    console.log("Parsed gameData:", gameData);
    return NextResponse.json(
      { dataSet: true, gameState: gameData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing gameData:", error);
    return NextResponse.json(
      { message: "Error retrieving game data" },
      { status: 500 }
    );
  }
}

// DELETE method to clear the gameData cookie
export async function DELETE(req) {
  const response = NextResponse.json({ message: "Game data cookie deleted" });

  // Clear the gameData cookie
  response.cookies.set("gameData", "", {
    expires: new Date(0), // Set expiration to the past
    path: "/", // Match the path used when setting the cookie
  });

  return response;
}
