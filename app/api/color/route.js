import { NextResponse } from "next/server";

// Dictionary of colors with their RGB values
const colors = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  brown: [165, 42, 42],
};

export async function GET(req) {
  try {
    // Get a random color from the dictionary
    const randomColor = getRandomColor();

    // Return the random color in RGB format
    return NextResponse.json({ color: randomColor });
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "Failed to get a random color" },
      { status: 500 }
    );
  }
}

function getRandomColor() {
  // Get a random key from the colors dictionary
  const colorKeys = Object.keys(colors);
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  const randomColorKey = colorKeys[randomIndex];

  // Return the RGB values of the random color
  return colors[randomColorKey];
}
