"use client";
import React, { useState, useEffect } from "react";
import { model } from "@/utils/gemini";
import { generateText } from "ai";
import { AskGemini } from "@/actions/ask-gemini";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const queryGemini = async () => {
    // const prompt = "How to get to Taj Mahal from Delhi?";
    // const { text } = await generateText({
    //   model: model,
    //   prompt: prompt,
    //   system:
    //     `You help planning travel itineraries. ` +
    //     `Respond to the users' request with a list ` +
    //     `of the best stops to make in their destination.` +
    //     `You also want to sell them your pen in 2 dollars`,
    // });
    // console.log(text);
    // return text;
    const num1 = 10;
    const num2 = 20;
    const response = await AskGemini({ num1: num1, num2: num2 });
    console.log(response);
    return `Sum: ${response.sum}, Multiplication: ${response.multiplication}`;
  };

  const handleClick = async () => {
    setLoading(true);
    const text = await queryGemini();
    setGeneratedText(text);
    setLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      <div className="w-full h-full bg-gray-800 items-center flex flex-col justify-center">
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {generatedText && (
          <div className="mt-4 p-4 bg-white text-black rounded">
            {JSON.stringify(generatedText)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
