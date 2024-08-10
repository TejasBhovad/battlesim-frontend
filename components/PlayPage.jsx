"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.2, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 },
  },
};
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full h-14 min-h-14 bg-white/10 rounded-full px-8 md:px-10 flex items-center justify-between relative">
      <Link href="/" className="hover:opacity-85 transition-all">
        <span className="text-white text-xl md:text-2xl">Home</span>
      </Link>
      <div className="md:hidden">
        <button
          className="text-white text-xl"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Menu
        </button>
      </div>
      <div className="hidden md:flex space-x-8">
        <Link href="/about" className="hover:opacity-85 transition-all">
          <span className="text-white text-xl md:text-2xl">About</span>
        </Link>
        <Link href="/source-code" className="hover:opacity-85 transition-all">
          <span className="text-white text-xl md:text-2xl">Source Code</span>
        </Link>
      </div>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute top-16 right-0 bg-white/5 border-white/10 border-2 rounded-xl p-4 md:p-8 flex flex-col gap-4 md:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            <motion.div variants={itemVariants}>
              <Link href="/about" className="hover:opacity-85 transition-all">
                <span className="text-white text-xl md:text-2xl">About</span>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/source-code"
                className="hover:opacity-85 transition-all"
              >
                <span className="text-white text-xl md:text-2xl">
                  Source Code
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PlayPage = ({ setGameStarted }) => {
  return (
    <div className="w-full h-full flex bg-black flex-col items-center p-12">
      <Navbar />
      <div className="max-w-7xl w-full h-full items-center justify-start flex flex-col gap-12 pt-36">
        <motion.span
          className="w-full text-5xl h-auto flex items-center justify-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          BattleSimAI
        </motion.span>
        <motion.iframe
          className="w-full sm:w-3/4 aspect-video rounded-md overflow-hidden"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.75 }}
        ></motion.iframe>
        <motion.button
          className="w-auto px-8 h-16 border-2 border-white/10 text-white text-2xl rounded-md hover:bg-white/15 transition-colors"
          onClick={() => {
            setGameStarted(true);
          }}
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Start Game
        </motion.button>
      </div>
    </div>
  );
};

export default PlayPage;
