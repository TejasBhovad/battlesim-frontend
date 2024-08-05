"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion"; // Import Framer Motion
import DeveloperCard from "@/components/DeveloperCard";
import GridSelect from "@/components/GridSelect";
const DynamicGame = dynamic(() => import("../components/Game"), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => (
    <div className="w-auto h-auto bg-slate-700 flex items-center justify-center">
      <span className="text-white text-xl py-2 px-4">Loading...</span>
    </div>
  ), // Optional loading indicator
});

const Page = () => {
  const [gameStatus, setGameStatus] = useState("loading");
  const [devMode, setDevMode] = useState(process.env.NEXT_PUBLIC_DEV_MODE);
  const [userState, setUserState] = useState(null);
  const [aiState, setAiState] = useState(null);
  useEffect(() => {
    // This effect runs when the component mounts
    setGameStatus("downloaded");
  }, []);

  if (gameStatus === "loading") {
    return <div className="w-full h-full bg-slate-900"></div>;
  }
  // UNCOMMENT
  // if (userState === null) {
  //   return (
  //     <div className="w-full h-full bg-gray-800 items-center flex justify-center">
  //       <GridSelect setUserState={setUserState} setAiState={setAiState} />
  //     </div>
  //   );
  // }
  return (
    <div className="w-full h-full bg-gray-800 items-center flex justify-center">
      <DeveloperCard devMode={devMode} gameStatus={gameStatus} />

      <motion.div
        className="w-auto h-auto flex flex-col"
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
