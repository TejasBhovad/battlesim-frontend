import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const GridSelect = ({ credits: initialCredits = 500, setUserState }) => {
  const router = useRouter();
  const rows = 15;
  const cols = 15;
  const totalTiles = rows * cols;

  const troopsList = [
    {
      name: "Warrior",
      cost: 25,
      color: "bg-green-500",
      image: "/pixelart/warrior.png",
    },
    {
      name: "Archer",
      cost: 35,
      color: "bg-green-500",
      image: "/pixelart/archer.png",
    },
    {
      name: "Erase",
      cost: 0,
      color: "bg-green-500",
      image: "/pixelart/grass.png",
    }, // Erase option
  ];

  const [troops, setTroops] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [battalions, setBattalions] = useState([]);
  const [troopsSubmitted, setTroopsSubmitted] = useState(false);

  // State to hold items in each tile, initialized with the "Erase" troop
  const [gridItems, setGridItems] = useState(
    Array(totalTiles).fill({
      name: "Erase",
      color: "bg-gray-500",
      image: "/pixelart/grass.png",
    })
  );

  // State to hold the selected troop
  const [selectedTroop, setSelectedTroop] = useState(troopsList[0]);

  // State to hold the remaining credits
  const [remainingCredits, setRemainingCredits] = useState(initialCredits);

  // State to track if the mouse is pressed
  const [isMouseDown, setIsMouseDown] = useState(false);

  // State to prevent spamming
  const [isProcessing, setIsProcessing] = useState(false);

  // State to track if the alert has been shown
  const [alertShown, setAlertShown] = useState(false);

  // Function to handle adding/removing an item from a tile
  const toggleItemInTile = (index) => {
    if (isProcessing) return; // Prevent further processing if already in progress

    const newGridItems = [...gridItems];
    const currentTroop = newGridItems[index];

    setIsProcessing(true); // Start processing

    if (selectedTroop.name === "Erase") {
      // If the selected troop is "Erase", remove the troop and restore credits
      if (currentTroop.name !== "Erase") {
        const troopCost =
          troopsList.find((troop) => troop.name === currentTroop.name)?.cost ||
          0;
        newGridItems[index] = {
          name: "Erase",
          color: "bg-gray-500",
          image: "/pixelart/grass.png",
        }; // Set to "Erase" troop
        setRemainingCredits((prev) => prev + troopCost); // Restore credits
      }
    } else if (currentTroop.name !== selectedTroop.name) {
      // If the tile doesn't have the selected troop, add it
      if (remainingCredits >= selectedTroop.cost) {
        newGridItems[index] = {
          name: selectedTroop.name,
          color: selectedTroop.color,
          image: selectedTroop.image,
        };
        setRemainingCredits((prev) => prev - selectedTroop.cost);
        setAlertShown(false); // Reset alert shown state
      } else {
        // If there are not enough credits, show an alert if not already shown
        if (!alertShown) {
          alert("Insufficient credits!");
          setAlertShown(true); // Set alert shown state
        }
      }
    }

    setGridItems(newGridItems);
    setIsProcessing(false); // End processing
  };

  const handleMouseDown = (index) => {
    if (troopsSubmitted) return;
    setIsMouseDown(true);
    toggleItemInTile(index);
  };

  const handleMouseUp = () => {
    if (troopsSubmitted) return;
    setIsMouseDown(false);
  };

  const handleMouseEnter = (index) => {
    if (troopsSubmitted) return;
    if (isMouseDown) {
      toggleItemInTile(index);
    }
  };

  useEffect(() => {
    // Find all non-null items and set them to troops with their respective positions and types
    const troops = gridItems.reduce((acc, item, index) => {
      if (item.name !== "Erase") {
        acc.push({
          type: item.name,
          position: { x: index % cols, y: Math.floor(index / cols) },
        });
      }
      return acc;
    }, []);
    setTroops(troops);
  }, [gridItems]);

  const handleSubmit = () => {
    setTroopsSubmitted(true);
    // Group troops into clusters
    const clusters = groupTroopsIntoClusters(troops);
    setClusters(clusters);

    // Update gridItems with cluster colors
    const newGridItems = [...gridItems];
    clusters.forEach((cluster, clusterIndex) => {
      cluster.forEach((troop) => {
        const index = troop.position.y * cols + troop.position.x;
        newGridItems[index] = {
          name: troop.type,
          color: `hsl(${clusterIndex * 40}, 70%, 50%)`,
          image: troopsList.find((t) => t.name === troop.type)?.image,
        };
      });
    });
    setGridItems(newGridItems);

    // Group clusters into battalions
    const battalions = clusters.map((cluster) => {
      const type = cluster[0].type;
      const troops = cluster.map((troop) => [
        troop.position.x,
        troop.position.y,
      ]);
      const avgCenter = calculateAverageCenter(troops);
      return { type, troops, avgCenter };
    });
    setBattalions(battalions);
  };

  const handleUserSubmit = () => {
    setUserState(battalions);
  };
  const groupTroopsIntoClusters = (troops) => {
    const clusters = [];

    // Helper function to check if troops are in a continuous straight line
    const areInLine = (troops) => {
      if (troops.length < 2) return true;

      const xCoords = troops.map((t) => t.position.x);
      const yCoords = troops.map((t) => t.position.y);

      // Check for vertical, horizontal, or diagonal alignment
      const isVertical = new Set(xCoords).size === 1;
      const isHorizontal = new Set(yCoords).size === 1;
      const isDiagonal =
        new Set(xCoords.map((x, i) => x - yCoords[i])).size === 1;

      // Check if troops are in a continuous line
      if (isVertical || isHorizontal) {
        return (
          Math.max(...xCoords) - Math.min(...xCoords) === troops.length - 1 ||
          Math.max(...yCoords) - Math.min(...yCoords) === troops.length - 1
        );
      } else if (isDiagonal) {
        return (
          Math.max(...xCoords) - Math.min(...xCoords) === troops.length - 1 &&
          Math.max(...yCoords) - Math.min(...yCoords) === troops.length - 1
        );
      }

      return false;
    };

    // Helper function to calculate the center of a cluster
    const getClusterCenter = (cluster) => {
      const xCoords = cluster.map((t) => t.position.x);
      const yCoords = cluster.map((t) => t.position.y);
      const centerX = Math.round(
        (Math.max(...xCoords) + Math.min(...xCoords)) / 2
      );
      const centerY = Math.round(
        (Math.max(...yCoords) + Math.min(...yCoords)) / 2
      );
      return { x: centerX, y: centerY };
    };

    // Group troops into clusters
    troops.forEach((troop) => {
      let suitableCluster = null;

      // Try to find an existing cluster to merge into
      for (let cluster of clusters) {
        const clusterCenter = getClusterCenter(cluster);
        const distance = Math.max(
          Math.abs(troop.position.x - clusterCenter.x),
          Math.abs(troop.position.y - clusterCenter.y)
        );

        // Check if the troop can be added to this cluster
        if (areInLine([...cluster, troop]) && distance <= 2) {
          suitableCluster = cluster;
          break;
        }
      }

      // If a suitable cluster was found, add the troop to it
      if (suitableCluster) {
        suitableCluster.push(troop);
      } else {
        // Otherwise, create a new cluster
        clusters.push([troop]);
      }
    });

    return clusters;
  };

  const calculateAverageCenter = (troops) => {
    const total = troops.reduce(
      (acc, [x, y]) => {
        acc.x += x;
        acc.y += y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    return [
      Math.round(total.x / troops.length),
      Math.round(total.y / troops.length),
    ];
  };

  useEffect(() => {
    console.log("Clusters:", clusters);
    console.log("Battalions:", battalions);
  }, [clusters, battalions]);

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full bg-black gap-2 py-4"
      onMouseUp={handleMouseUp}
    >
      <span className="text-white text-4xl py-2">Place Troops</span>
      <div className="flex items-center max-w-7xl gap-4">
        {troopsSubmitted && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded h-8 flex items-center justify-center"
            onClick={() => router.back()}
          >
            Back
          </button>
        )}
        {!troopsSubmitted && (
          <div className="mr-4 text-white">Credits: {remainingCredits}</div>
        )}

        <select
          value={selectedTroop.name}
          onChange={(e) => {
            setSelectedTroop(
              troopsList.find((troop) => troop.name === e.target.value)
            );
            setAlertShown(false); // Reset alert shown state when changing troop
          }}
          className="px-2 py-1  border-[1px] border-black/5 rounded h-8"
        >
          {troopsList.map((troop, index) => (
            <option key={index} value={troop.name}>
              {troop.name} ({troop.cost})
            </option>
          ))}
        </select>
        {clusters.length > 0 ? (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded  disabled:opacity-50 h-8 flex items-center justify-center"
            onClick={handleUserSubmit}
          >
            Battle
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded  disabled:opacity-50 h-8 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={troops.length === 0}
          >
            Submit
          </button>
        )}
      </div>
      <div className="grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] gap-0 sm:gap-0 w-full sm:w-1/3 aspect-square relative bg-green-600">
        {gridItems.map((item, index) => (
          <div
            key={index}
            className={`border-[1px] border-black/5 flex items-center justify-center cursor-pointer ${
              item ? item.color : "bg-white"
            }`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {/* Display image instead of troop name */}
            {item && item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                draggable="false"
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                  imageRendering: "pixelated", // Ensures pixel art is rendered accurately
                }}
              />
            )}
          </div>
        ))}
        {battalions.map((battalion, index) => {
          const [centerX, centerY] = battalion.avgCenter;
          const centerIndex = centerY * cols + centerX;
          return (
            <div
              key={`center-${index}`}
              className="absolute bg-green-400 w-2 h-2 sm:w-4 sm:h-4 rounded-full border-2 border-black"
              style={{
                backgroundColor: `hsl(${index * 60}, 50%, 50%)`,
                top: `${centerY * (100 / rows)}%`,
                left: `${centerX * (100 / cols)}%`,
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default GridSelect;
