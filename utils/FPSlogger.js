"use client";
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

const startFpsLogging = (updateFpsCallback) => {
  const calculateFps = () => {
    const currentTime = performance.now();
    frameCount++;

    // Calculate the time elapsed since the last frame
    const elapsed = currentTime - lastFrameTime;

    // If one second has passed, update the FPS
    if (elapsed >= 1000) {
      fps = frameCount; // Update the FPS value
      frameCount = 0; // Reset frame count
      lastFrameTime = currentTime; // Update last frame time
      updateFpsCallback(fps); // Call the callback with the new FPS value
    }

    requestAnimationFrame(calculateFps); // Request the next frame
  };

  // Start the FPS calculation
  requestAnimationFrame(calculateFps);

  // Return a function to get the current FPS
  return () => fps;
};

// Export the single function
export default startFpsLogging;
