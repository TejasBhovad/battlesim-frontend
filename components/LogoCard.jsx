import React from "react";
import Image from "next/image";
const LogoCard = () => {
  return (
    <div className="w-auto h-8 flex gap-2">
      <Image
        src="/pixelart/battleSim.png"
        width={50}
        height={50}
        alt="logo"
        className="w-full h-full"
      />

      <span className="w-auto text-xl flex items-center justify-center">
        <span className="text-white">b</span>
        <span className="text-red-500/70">A</span>
        <span className="text-white">ttleS</span>
        <span className="text-red-500/70">i</span>
        <span className="text-white">m</span>
      </span>
    </div>
  );
};

export default LogoCard;
