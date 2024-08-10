"use client";
import { InitGemini } from "@/actions/init-gemini";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion"; // Import Framer Motion
import DeveloperCard from "@/components/DeveloperCard";
import GridSelect from "@/components/GridSelect";
import PlayPage from "@/components/PlayPage";
const DynamicGame = dynamic(() => import("../components/Game"), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => (
    <div className="w-auto h-auto bg-slate-700 flex items-center justify-center">
      <span className="text-white text-xl py-2 px-4">Loading...</span>
    </div>
  ), // Optional loading indicator
});

const Page = () => {
  const CREDITS = 500;
  const [gameStatus, setGameStatus] = useState("loading");
  const [devMode, setDevMode] = useState(
    process.env.NEXT_PUBLIC_DEV_MODE === "true"
  );
  const [userState, setUserState] = useState(null);
  const [aiState, setAiState] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);

  const deleteGameDataHandler = async () => {
    try {
      const response = await fetch("/api/init", {
        method: "DELETE",
      });

      const result = await response.json();
    } catch (error) {
      console.error("Error deleting game data:", error);
      setMessage("Failed to delete game data.");
    }
  };

  useEffect(() => {
    // This effect runs when the component mounts
    setGameStatus("downloaded");
    deleteGameDataHandler();
  }, []);

  const responseInitHandler = async () => {
    const gameState = {
      game_map: {
        size: [15, 15],
        // castle position is the bottom right corner
        castle: [14, 14],
        // walls are placed around the castle
        walls: [
          [14, 13],
          [13, 14],
        ],
      },
      player_battlions: userState,
      credits: CREDITS,
    };
    console.log("gameState Passed:", gameState);
    const response = await InitGemini({
      gameState: gameState,
    });
    console.log("Response:", response);
    setAiState(response);
  };

  const setUserStateCookie = async (userState) => {
    const data = {
      userInitData: {
        battalions: userState,
      },
    };

    try {
      const response = await fetch("/api/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // setGameData(result.response);/
    } catch (error) {
      console.error("Error setting game data:", error);
      setMessage("Failed to set game data.");
    }
  };

  const setAiStateCookie = async (aiState) => {
    try {
      const response = await fetch("/api/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiInitData: aiState }),
      });

      const result = await response.json();
      // setAiState(result.data);
    } catch (error) {
      console.error("Error setting game data:", error);
      setMessage("Failed to set game data.");
    }
  };

  useEffect(() => {
    console.log("userState:", userState);
    if (userState !== null) {
      setUserStateCookie(userState);
      responseInitHandler();
    }
  }, [userState]);

  useEffect(() => {
    console.log("aiState:", aiState);
    if (aiState !== null) {
      setAiStateCookie(aiState);
    }
  }, [aiState]);
  if (!gameStarted && !devMode) {
    return (
      <PlayPage setGameStarted={setGameStarted} gameStarted={gameStarted} />
    );
  }
  if (gameStatus === "loading") {
    return <div className="w-full h-full bg-slate-900"></div>;
  }

  if (userState === null) {
    return (
      <div className="w-full h-full bg-gray-800 items-center flex justify-center">
        <GridSelect
          setUserState={setUserState}
          setAiState={setAiState}
          credits={CREDITS}
        />
      </div>
    );
  }
  if (aiState === null) {
    // loading for aiState
    return (
      <div className="w-full h-full bg-gray-800 items-center flex justify-center">
        <span className="text-white text-xl py-2 px-4">Loading...</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-gray-800 items-center flex justify-center">
      <DeveloperCard devMode={devMode} gameStatus={gameStatus} />

      <motion.div
        className="w-full h-full flex flex-col"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25, delay: 0.35 }}
      >
        <DynamicGame
          devMode={devMode}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        />
      </motion.div>
    </div>
  );
};

export default Page;
