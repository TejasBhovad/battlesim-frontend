"use client";
import Image from "next/image";
import Link from "next/link";
import LogoCard from "@/components/LogoCard";
import { useState } from "react";
import React from "react";
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

const popInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.65, 0.5, 1] },
  },
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full h-14 min-h-14 bg-white/10 rounded-full px-8 md:px-10 flex items-center justify-between relative">
      <Link href="/" className="hover:opacity-85 transition-all">
        <LogoCard />
      </Link>
      <div className="md:hidden">
        <button
          className="text-white text-lg"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Menu
        </button>
      </div>
      <div className="hidden md:flex space-x-8">
        <Link href="/about" className="hover:opacity-85 transition-all">
          <span className="text-white text-lg md:text-xl">About</span>
        </Link>
        <Link href="/source-code" className="hover:opacity-85 transition-all">
          <span className="text-white text-lg md:text-xl">Source Code</span>
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
                <span className="text-white text-lg md:text-xl">About</span>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/source-code"
                className="hover:opacity-85 transition-all"
              >
                <span className="text-white text-lg md:text-xl">
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

const TroopCard = ({ name, image, index }) => {
  return (
    <motion.div
      variants={popInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="sm:w-48 w-full aspect-square bg-white/10 rounded-lg flex flex-col items-center justify-center p-12 sm:p-2"
    >
      <Image
        src={image}
        width={50}
        height={50}
        alt="troop"
        style={{ imageRendering: "pixelated" }}
        className="h-full w-full aspect-square p-2"
      />
      <span className="text-white text-lg pb-4">{name}</span>
    </motion.div>
  );
};

const Page = () => {
  return (
    <div className="bg-black w-full h-fit text-white flex items-center justify-center">
      <div className="max-w-7xl w-full h-full flex flex-col p-8">
        <Navbar />
        <div className="w-full h-full pt-16 px-2">
          <section className="w-full h-auto flex flex-col gap-3">
            <motion.h1
              className="text-5xl text-left w-full h-auto"
              initial={{ opacity: 0.15, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.25 }}
            >
              What is bAttleSim?
            </motion.h1>
            <motion.p
              className="text-lg text-left w-full h-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.25, delay: 0.2 }}
            >
              Created as part of Gemini Challenge 2024, bAttleSim is a tower
              defense simulation. User is on the attacker’s side and Gemini
              defends its castle. Both are given a set amount of credits and
              there are two types of troops they can be spent on.
            </motion.p>
          </section>
          <section className="w-full h-auto flex flex-col gap-6 pt-8">
            <motion.h1
              className="text-5xl text-left w-full h-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.25, delay: 0.4 }}
            >
              Troops
            </motion.h1>
            <div className="w-full h-auto flex flex-col sm:flex-row gap-4">
              <TroopCard
                name="Knight"
                image="/pixelart/warrior.png"
                index={0}
              />
              <TroopCard name="Archer" image="/pixelart/archer.png" index={1} />
            </div>
          </section>
          <section className="w-full h-auto flex flex-col gap-6 pt-8">
            <motion.h1
              className="text-5xl text-left w-full h-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.25, delay: 0.5 }}
            >
              How it's Made?
            </motion.h1>
            <motion.p
              className="text-lg text-left w-full h-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.25, delay: 0.6 }}
            >
              The actual game was created in C++ using Raylib, then compiled to
              WASM and is finally being rendered on the web using Next.js on
              Vercel.
            </motion.p>
            <motion.div
              variants={popInVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.3,
                ease: [0.2, 0.65, 0.5, 1],
                delay: 0.8,
              }}
            >
              <Image
                src="/diagram.png"
                width={750}
                height={750}
                alt="logo"
                className="w-full h-auto"
              />
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
