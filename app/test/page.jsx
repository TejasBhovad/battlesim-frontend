"use client";
import React, { useState } from "react";
import Link from "next/link";
const Page = () => {
  const [gameData, setGameData] = useState(null);
  const [message, setMessage] = useState("");

  // Function to set game data
  const setGameDataHandler = async () => {
    const data = {
      gameData: {
        troops: 100,
        startPosition: {
          x: 10,
          y: 20,
        },
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
      setMessage(result.message);
      setGameData(result.data);
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
    </div>
  );
};

export default Page;
