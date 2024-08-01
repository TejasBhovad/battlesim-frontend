"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicGame = dynamic(() => import("../components/Game"), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => (
    <div className="w-full h-full bg-slate-700">
      <span className="text-white text-xl py-2 px-4">Loading...</span>
    </div>
  ), // Optional loading indicator
});

const Page = () => {
  const [gameStatus, setGameStatus] = useState("loading");

  useEffect(() => {
    // This effect runs when the component mounts
    setGameStatus("loaded");
  }, []);

  if (gameStatus === "loading") {
    return <div className="w-full h-full bg-slate-900"></div>;
  }

  return (
    <div className="w-full h-full bg-gray-800 items-center flex justify-center">
      <div className="w-full h-full border-2 border-gray-400">
        <DynamicGame />
      </div>
    </div>
  );
};

export default Page;
