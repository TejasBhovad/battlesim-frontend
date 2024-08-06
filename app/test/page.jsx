"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InitGemini } from "@/actions/init-gemini";

const Page = () => {
  const [gameData, setGameData] = useState(null);
  const [message, setMessage] = useState("");
  const [aiState, setAiState] = useState(null);

  const handleClick = async () => {
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
      player_battlions: [
        {
          type: "archer",
          troops: [
            [0, 0],
            [1, 0],
            [0, 1],
          ],
        },
        {
          type: "warrior",
          troops: [
            [0, 2],
            [1, 2],
            [0, 3],
          ],
        },
      ],
      credits: 100,
    };
    const response = await InitGemini({
      gameState: gameState,
    });
    console.log("Response Init:", response);
    setAiState(response.object); // Set AI state with the response
  };

  const responseHandler = async () => {
    const aiData = {
      battalions: [
        {
          type: "warrior",
          avgCenter: [1, 1],
          troops: [
            [1, 1],
            [0, 1],
            [1, 0],
          ],
        },
        {
          type: "archer",
          avgCenter: [1, 2],
          troops: [
            [1, 2],
            [0, 2],
            [1, 3],
          ],
        },
      ],
    };
    try {
      const response = await fetch("/api/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiInitData: aiData }),
      });

      const result = await response.json();
      setAiState(result.data);
    } catch (error) {
      console.error("Error setting game data:", error);
      setMessage("Failed to set game data.");
    }
  };

  // Function to set game data
  const setGameDataHandler = async () => {
    const data = {
      userInitData: {
        battalions: [
          {
            type: "warrior",
            count: 10,
            position: [1, 1],
          },
          {
            type: "archer",
            count: 10,
            position: [1, 2],
          },
        ],
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

      setGameData(result.response);
    } catch (error) {
      console.error("Error setting game data:", error);
      setMessage("Failed to set game data.");
    }
  };

  // Function to delete game data
  const deleteGameDataHandler = async () => {
    try {
      const response = await fetch("/api/init", {
        method: "DELETE",
      });

      const result = await response.json();
      setMessage(result.message);
      setGameData(null); // Clear local game data
    } catch (error) {
      console.error("Error deleting game data:", error);
      setMessage("Failed to delete game data.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Game Data Management</h1>
      <div className="space-x-4">
        <button
          onClick={setGameDataHandler}
          className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded"
        >
          Set Game Data
        </button>
        <button
          onClick={handleClick}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
        >
          Init Game
        </button>
        <button
          onClick={deleteGameDataHandler}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
        >
          Delete Game Data
        </button>
        <Link
          href="/api/init"
          className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          View GET
        </Link>
        <button
          onClick={responseHandler}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
        >
          Get Response
        </button>
      </div>
      {message && <p className="mt-4 text-lg">{message}</p>}
      {gameData && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Current Game Data:</h2>
          <pre className="bg-slate-700 p-4 rounded mt-2 overflow-x-auto">
            {JSON.stringify(gameData, null, 2)}
          </pre>
        </div>
      )}
      {aiState && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">AI State:</h2>
          <pre className="bg-slate-700 p-4 rounded mt-2 overflow-x-auto">
            {JSON.stringify(aiState, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Page;
