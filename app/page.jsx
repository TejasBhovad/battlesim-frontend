import React from "react";

import dynamic from "next/dynamic";

// Dynamically import the Game component
const DynamicGame = dynamic(() => import("../components/Game"), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <p>Loading game...</p>, // Optional loading indicator
});
const page = () => {
  return (
    <div className="w-full h-full bg-gray-800 items-center flex justify-center">
      <div className="w-fit h-fit border-2 border-gray-400">
        <DynamicGame />
      </div>
    </div>
  );
};

export default page;
