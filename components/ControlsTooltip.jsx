"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ControlsTooltip = () => {
  // Initialize state based on localStorage
  const [showTooltip, setShowTooltip] = useState(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("showTooltip");
      return storedValue === "false" ? false : true; // Default to true if not set
    }
    return true; // Default value when server-side rendering
  });

  // Update localStorage whenever showTooltip changes
  useEffect(() => {
    localStorage.setItem("showTooltip", showTooltip);
  }, [showTooltip]);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <>
      <button
        className={`absolute ${
          showTooltip ? "bottom-36" : "bottom-4"
        } text-white/50 hover:text-white transition-all`}
        onClick={toggleTooltip}
      >
        {showTooltip ? "Hide Controls" : "Show Controls"}
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-4 flex text-white/50 gap-2 rounded-sm px-4 py-2 max-w-full overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, duration: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-sm bg-white/10">
              <Image
                src="/pixelart/wasd.png"
                style={{
                  imageRendering: "pixelated",
                }}
                className="h-12 w-auto"
                width={64}
                height={64}
                alt="WASD Controls"
              />
              <span>Use WASD to move</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 rounded-sm">
              <Image
                src="/pixelart/space.png"
                style={{
                  imageRendering: "pixelated",
                }}
                width={64}
                height={64}
                className="h-12 w-auto p-3"
                alt="Pause Control"
              />
              <span>Use Space to Pause</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 rounded-sm">
              <Image
                src="/pixelart/mouse.png"
                style={{
                  imageRendering: "pixelated",
                }}
                width={64}
                height={64}
                className="h-12 w-auto p-2"
                alt="Pause Control"
              />
              <span>Use Scroll to Zoom</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 rounded-sm">
              <Image
                src="/ui/pointer.png"
                style={{
                  imageRendering: "pixelated",
                }}
                width={64}
                height={64}
                className="h-12 w-auto p-2"
                alt="Pause Control"
              />
              <span>Click to view stats</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ControlsTooltip;
