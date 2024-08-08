"use client";
import { useEffect, useState, useRef } from "react";
import { fetchGameScript } from "@/actions/proxy";
import { useControls } from "leva";

export default function Game({ devMode, gameStatus, setGameStatus }) {
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef(null);
  const DEV_MODE = devMode;

  const defaultScaleFactor = window.innerWidth > 1080 ? 0.6 : 0.7;

  const { scaleFactor } = useControls({
    scaleFactor: {
      value: defaultScaleFactor,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
  });

  const canvasWidth = window.innerWidth * scaleFactor;
  const canvasHeight = canvasWidth * (9 / 16);

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

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
  }, [scaleFactor]);

  if (!isMounted) {
    return null; // or a loading indicator
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-full"
        style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
      >
        <canvas
          id="canvas"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
