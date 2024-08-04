"use client";
import { motion, AnimatePresence } from "framer-motion";
import startFpsLogging from "@/utils/FPSlogger";
import { useEffect, useState } from "react";

const ItemList = ({ itemTitle, itemValue }) => {
  return (
    <motion.li
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -10, opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.35 }}
      className="text-white list-none text-sm flex gap-1"
    >
      {itemTitle}:<span className="text-green-400">{itemValue}</span>
    </motion.li>
  );
};

const DeveloperCard = ({ devMode, gameStatus }) => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const getCurrentFps = startFpsLogging(setFps);
    return () => clearInterval(getCurrentFps);
  }, []);

  return (
    <AnimatePresence>
      {devMode && (
        <motion.div
          initial={{ y: -75, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900 text-white text-start h-24 px-4 py-2 absolute flex flex-col text-lg gap-1 rounded-md top-2 left-2"
        >
          <span className="text-red-600">Development Mode</span>
          <ul className="list-none">
            <ItemList itemTitle="Game Status" itemValue={gameStatus} />
            <ItemList itemTitle="Current FPS" itemValue={fps} />
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeveloperCard;
