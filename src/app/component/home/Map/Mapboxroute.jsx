import React from "react";
import { Layer, Source } from "react-map-gl/mapbox";

const Mapboxroute = ({ coordinates }) => {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) return null;

  return (
    <Source
      type="geojson"
      data={{
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates, // [[lng,lat], ...]
        },
      }}
    >
      <Layer
        id="route"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": "#3b82f6", "line-width": 4 }}
      />
    </Source>
  );
};

export default Mapboxroute;
