import { NextResponse } from "next/server";

// POST method to set userInitData in a cookie
export async function POST(req) {
  const data = await req.json();
  const { userInitData, aiInitData } = data;

  const response = NextResponse.json({
    message: "Game data set successfully",
    data: userInitData,
  });

  if (userInitData) {
    response.cookies.set("userInitData", JSON.stringify(userInitData), {
      httpOnly: true, // Prevent JavaScript access
      maxAge: 60 * 60, // 1 hour
      path: "/", // Make the cookie available across the site
    });
  }
  if (aiInitData) {
    response.cookies.set("aiInitData", JSON.stringify(aiInitData), {
      httpOnly: true, // Prevent JavaScript access
      maxAge: 60 * 60, // 1 hour
    });
  }

  return response;
}

// GET method to retrieve userInitData from the cookie
export async function GET(req) {
  console.log("Received GET request"); // Log when GET is called

  const userCookie = req.cookies.get("userInitData");
  const aiCookie = req.cookies.get("aiInitData");
  if (userCookie) {
    console.log("Cookie:", userCookie);
  }
  if (aiCookie) {
    console.log("Cookie:", aiCookie);
  }

  if (!userCookie && !aiCookie) {
    return NextResponse.json(
      {
        userDataSet: false,
        userInitData: null,
        aiDataSet: false,
        aiInitData: null,
      },
      { status: 200 }
    );
  }
  if (!aiCookie && userCookie) {
    try {
      const userInitData = JSON.parse(userCookie.value); // Access the value property
      console.log("Parsed userInitData:", userInitData);
      return NextResponse.json(
        {
          userDataSet: true,
          userInitData: userInitData,
          aiDataSet: false,
          aiInitData: null,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error parsing userInitData:", error);
      return NextResponse.json(
        { message: "Error retrieving game data" },
        { status: 500 }
      );
    }
  }

  if (!userCookie && aiCookie) {
    try {
      const aiInitData = JSON.parse(aiCookie.value); // Access the value property
      console.log("Parsed aiInitData:", aiInitData);
      return NextResponse.json(
        {
          userDataSet: false,
          userInitData: null,
          aiDataSet: true,
          aiInitData: aiInitData,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error parsing aiInitData:", error);
      return NextResponse.json(
        { message: "Error retrieving game data" },
        { status: 500 }
      );
    }
  }

  try {
    const userInitData = JSON.parse(userCookie.value); // Access the value property
    console.log("Parsed userInitData:", userInitData);
    const aiInitData = JSON.parse(aiCookie.value); // Access the value property
    console.log("Parsed AiInitData:", aiInitData);
    return NextResponse.json(
      {
        userDataSet: true,
        userInitData: userInitData,
        aiDataSet: true,
        aiInitData: aiInitData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing userInitData:", error);
    return NextResponse.json(
      { message: "Error retrieving game data" },
      { status: 500 }
    );
  }
}

// DELETE method to clear the userInitData cookie
export async function DELETE(req) {
  const response = NextResponse.json({ message: "Game data cookie deleted" });

  // Clear the userInitData cookie
  response.cookies.set("userInitData", "", {
    expires: new Date(0), // Set expiration to the past
    path: "/", // Match the path used when setting the cookie
  });
  response.cookies.set("aiInitData", "", {
    expires: new Date(0), // Set expiration to the past
  });

  return response;
}
