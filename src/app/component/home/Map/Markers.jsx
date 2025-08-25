"use client";
import React, { useContext } from "react";
import { Marker } from "react-map-gl/mapbox";
import { UserLocationContext } from "../../context/UserlocationContext";
import { SourceCordinatesContext } from "../../context/SourceCordinates";
import { DestinationCordinatesContext } from "../../context/DestinationCordinates";


const Markers = () => {
  const { userLocation } = useContext(UserLocationContext);
  const { sourceCordinates } = useContext(SourceCordinatesContext);
  const { destinations } = useContext(DestinationCordinatesContext);

  return (
    <div>
      {userLocation && (
        <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
          <img src="/pin.png" className="h-10" alt="You" />
        </Marker>
      )}

      {sourceCordinates && (
        <Marker longitude={sourceCordinates.lng} latitude={sourceCordinates.lat} anchor="bottom">
          <img src="/pin.png" className="h-10" alt="Source" />
        </Marker>
      )}

      {Array.isArray(destinations) &&
        destinations.map((d, idx) =>
          d?.lng && d?.lat ? (
            <Marker key={idx} longitude={d.lng} latitude={d.lat} anchor="bottom">
              <img src="/pin.png" className="h-10" alt={`Drop ${idx + 1}`} />
            </Marker>
          ) : null
        )}
    </div>
  );
};

export default Markers;
