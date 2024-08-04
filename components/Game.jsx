"use client";
import { useEffect, useState } from "react";
import { fetchGameScript } from "@/actions/proxy";

export default function Game({ devMode, gameStatus, setGameStatus }) {
  const [isMounted, setIsMounted] = useState(false);
  const DEV_MODE = devMode;
  useEffect(() => {
    setIsMounted(true);

    if (DEV_MODE && isMounted) {
      // Check if the script already exists
      if (!document.getElementById("game-script")) {
        const script = document.createElement("script");
        script.src = "/emscripten-build.js";
        script.id = "game-script";
        script.async = true;
        setGameStatus("script loaded");
        document.body.appendChild(script);
        setGameStatus("game loaded");
      }
    }
    if (!DEV_MODE && isMounted) {
      if (typeof window !== "undefined" && isMounted) {
        const loadGame = async () => {
          console.log("Loading game...");

          try {
            const scriptContent = await fetchGameScript();

            eval(scriptContent);
            setGameStatus("game evaluated");
          } catch (error) {
            console.error("Error loading game script:", error);
          }
        };

        loadGame();
        setGameStatus("game loaded");
      }
    }

    if (DEV_MODE) {
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
    <div className="w-auto flex items-center justify-center h-auto ">
      <canvas id="canvas" width="800" height="600"></canvas>
    </div>
  );
}
