"use client";
import { useEffect, useState } from "react";

export default function Game() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined" && isMounted) {
      const loadGame = async () => {
        console.log("Loading game...");
        // Check if the script already exists
        if (!document.getElementById("game-script")) {
          const script = document.createElement("script");
          script.src = "/emscripten-build.js";
          script.id = "game-script";
          script.async = true;

          document.body.appendChild(script);
        }
      };

      loadGame();

      // Cleanup function to remove the script on unmount
      return () => {
        const script = document.getElementById("game-script");
        if (script) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isMounted]);

  if (!isMounted) {
    return null; // or a loading indicator
  }

  return (
    <div>
      <canvas id="canvas" width="800" height="600"></canvas>
    </div>
  );
}
