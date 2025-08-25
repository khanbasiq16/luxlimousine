"use client"
import React, { useContext } from "react";
import { DirectionsContext } from "../../context/DirectionDataContext";

const DistanceTime = () => {
  const { directionData } = useContext(DirectionsContext);

  const distanceKm = directionData?.routes?.[0]?.distance
    ? (directionData.routes[0].distance / 1000).toFixed(2)
    : "0";

  const durationMins = directionData?.routes?.[0]?.duration
    ? (directionData.routes[0].duration / 60).toFixed(2)
    : "0";

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <div className="text-white">Distance:</div>
        <div className="text-gray-500 font-semibold">{distanceKm} km</div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="text-white">Time:</div>
        <div className="text-gray-500 font-semibold">{durationMins} mins</div>
      </div>
    </>
  );
};

export default DistanceTime;
