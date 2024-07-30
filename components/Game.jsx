"use client";
import { useEffect, useState } from "react";
import { fetchGameScript } from "@/actions/proxy";

export default function Game() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined" && isMounted) {
      const loadGame = async () => {
        console.log("Loading game...");

        try {
          const scriptContent = await fetchGameScript();

          eval(scriptContent);
        } catch (error) {
          console.error("Error loading game script:", error);
        }
      };

      loadGame();
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
