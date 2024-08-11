import React from "react";
import Image from "next/image";
const GeminiLabel = () => {
  return (
    <div className="w-auto px-4 h-8 flex gap-2 select-none absolute top-48 bg-cyan-100/10 items-center justify-center py-1 rounded-full">
      <span className="w-auto text-sm h-full text-gray-500">powered by</span>
      <Image
        src="/gemini.png"
        width={50}
        height={24}
        alt="logo"
        className="w-auto h-2/3 flex items-center justify-center -translate-y-1 "
      />
    </div>
  );
};

export default GeminiLabel;
