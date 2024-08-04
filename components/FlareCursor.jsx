"use client";
import "@/app/styles/cursor.css";
import React, { useState, useEffect } from "react";

const FlareCursor = () => {
  const cursorImage = "/ui/arrow.png";
  const pointerImage = "/ui/pointer.png";
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isScaled, setIsScaled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });

    const target = e.target;
    const targetStyle = window.getComputedStyle(target);

    const pointerCondition =
      targetStyle.getPropertyValue("cursor") === "pointer" ||
      target.tagName.toLowerCase() === "button" ||
      targetStyle.getPropertyValue("cursor") === `url("${pointerImage}")`;

    // console.log("Pointer Condition:", pointerCondition);
    setIsPointer(pointerCondition);
  };

  const handleMouseLeave = () => {
    setPosition({ x: -50, y: -50 }); // Move the cursor out of view
  };

  const handleMouseEnter = (e) => {
    const target = e.target;
    if (target && target.tagName && target.tagName.toLowerCase() === "button") {
      setIsScaled(true);
    }
  };

  const handleMouseLeaveButton = () => {
    setIsScaled(false);
  };

  const handleClick = (e) => {
    const target = e.target;
    if (target && target.tagName && target.tagName.toLowerCase() === "button") {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200); // Reset click state after 200ms
    }
  };

  useEffect(() => {
    document.body.style.cursor = "none"; // Hide the default cursor

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter, true);
    window.addEventListener("mouseleave", handleMouseLeaveButton, true);
    window.addEventListener("click", handleClick, true);

    return () => {
      document.body.style.cursor = ""; // Reset the cursor style

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter, true);
      window.removeEventListener("mouseleave", handleMouseLeaveButton, true);
      window.removeEventListener("click", handleClick, true);
    };
  }, []);

  const flareSize = isPointer ? 0 : 30;

  const isNearEdge = (x, y) => {
    const edgeThreshold = 40; // Adjust this value as needed
    return (
      x < edgeThreshold ||
      y < edgeThreshold ||
      x > window.innerWidth - edgeThreshold ||
      y > window.innerHeight - edgeThreshold
    );
  };

  const cursorStyle = isPointer
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "30px",
        height: "30px",
        backgroundImage: `url(${pointerImage})`,
        backgroundSize: "cover",
        imageRendering: "pixelated",
        opacity: isNearEdge(position.x, position.y) ? 0 : 1,
        transition: "opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      }
    : {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${flareSize}px`,
        height: `${flareSize}px`,
        backgroundImage: `url(${cursorImage})`,
        backgroundSize: "cover",
        imageRendering: "pixelated",
        opacity: isNearEdge(position.x, position.y) ? 0 : 1,
        transform: isScaled ? "scale(1.5)" : "scale(1)",
        transition:
          "opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s ease",
      };

  const clickStyle = isClicked
    ? {
        transform: "scale(0.8)",
        transition: "transform 0.2s ease",
      }
    : {};

  //   console.log("Cursor Style:", cursorStyle);

  return (
    <div
      className={`flare ${isPointer ? "pointer" : ""}`}
      style={{ ...cursorStyle, ...clickStyle }}
    ></div>
  );
};

export default FlareCursor;
