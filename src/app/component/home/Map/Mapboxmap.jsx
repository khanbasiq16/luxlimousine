// "use client";
// import React, { useContext, useEffect, useRef } from "react";
// import Map, { Marker } from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";
// import Markers from "./Markers";
// import Mapboxroute from "./Mapboxroute";
// import DistanceTime from "./DistanceTime";
// import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
// import { SourceCordinatesContext } from "../../context/SourceCordinates";
// import { DirectionsContext } from "../../context/DirectionDataContext";
// import { UserLocationContext } from "../../context/UserlocationContext";

// const MAPBOX_DRIVING_ENDPOINT =
//   "https://api.mapbox.com/directions/v5/mapbox/driving/";
// const session_token = "8e4f51b2-8a63-4ac0-9187-91fd3770f7d2";

// const Mapboxmap = () => {
//   const mapref = useRef(null);
//   const { destinationCordinates, setDestinationCordinates } = useContext(
//     DestinationCordinatesContext
//   );
//   const { userLocation } = useContext(UserLocationContext);
//   const { sourceCordinates, setSourceCordinate } = useContext(
//     SourceCordinatesContext
//   );
//   const { directionData, setDirectionData } = useContext(DirectionsContext);

//   // Source Markers
//   useEffect(() => {
//     if (sourceCordinates?.lat && sourceCordinates?.lng) {
//       mapref.current?.flyTo({
//         center: [sourceCordinates.lng, sourceCordinates.lat],
//         duration: 2500,
//       });
//     }
//   }, [sourceCordinates]);

//   // Destination Markers
//   useEffect(() => {
//     if (destinationCordinates?.lat && destinationCordinates?.lng) {
//       mapref.current?.flyTo({
//         center: [destinationCordinates.lng, destinationCordinates.lat],
//         duration: 2500,
//       });
//     }

//     if (sourceCordinates && destinationCordinates) {
//       getdirections();
//     }
//   }, [destinationCordinates]);

//   const getdirections = async () => {
//     const res = await fetch(
//       `${MAPBOX_DRIVING_ENDPOINT}${sourceCordinates?.lng},${sourceCordinates?.lat};${destinationCordinates?.lng},${destinationCordinates?.lat}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!res.ok) {
//       console.error("Failed to fetch directions");
//       return;
//     }

//     const result = await res.json();
//     console.log("Directions:", result);
//     setDirectionData(result);
//   };

//   return (
//     <div className="p-5 relative">
//       <h2 className="text-lg font-bold mb-2">Map</h2>

//       <div className="rounded-sm overflow-hidden">
//         {userLocation && (
//           <Map
//             ref={mapref}
//             mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
//             initialViewState={{
//               longitude: userLocation.lng,
//               latitude: userLocation.lat,
//               zoom: 14,
//             }}
//             style={{ width: "100%", height: 450, borderRadius: 20 }}
//             mapStyle="mapbox://styles/mapbox/streets-v9"
//           >
//             <Markers />

//             {directionData && directionData.routes && (
//               <Mapboxroute
//                 coordinates={directionData.routes[0]?.geometry?.coordinates}
//               />
//             )}
//           </Map>
//         )}

//         {directionData && directionData.routes && (
//           <div className="min-w-[30%] absolute top-14 right-6 flex justify-between items-center bg-black p-4 rounded-lg">
//             <DistanceTime />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Mapboxmap;

// "use client";
// import React, { useContext, useEffect, useRef } from "react";
// import Map from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";
// import Markers from "./Markers";
// import Mapboxroute from "./Mapboxroute";
// import DistanceTime from "./DistanceTime";
// import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
// import { SourceCordinatesContext } from "../../context/SourceCordinates";
// import { DirectionsContext } from "../../context/DirectionDataContext";
// import { UserLocationContext } from "../../context/UserlocationContext";

// const MAPBOX_DRIVING_ENDPOINT =
//   "https://api.mapbox.com/directions/v5/mapbox/driving/";

// const Mapboxmap = () => {
//   const mapref = useRef(null);
//   const { destinationCordinates } = useContext(DestinationCordinatesContext);
//   const { userLocation } = useContext(UserLocationContext);
//   const { sourceCordinates } = useContext(SourceCordinatesContext);
//   const { directionData, setDirectionData } = useContext(DirectionsContext);

//   // Fly when source changes
//   useEffect(() => {
//     if (sourceCordinates?.lat && sourceCordinates?.lng) {
//       mapref.current?.flyTo({
//         center: [sourceCordinates.lng, sourceCordinates.lat],
//         duration: 2500,
//       });
//     }
//   }, [sourceCordinates]);

//   // Fly when destinations change
//   useEffect(() => {
//     if (destinationCordinates?.length > 0) {
//       const lastDest = destinationCordinates[destinationCordinates.length - 1];
//       mapref.current?.flyTo({
//         center: [lastDest.lng, lastDest.lat],
//         duration: 2500,
//       });

//       if (sourceCordinates && destinationCordinates.length > 0) {
//         getdirections();
//       }
//     }
//   }, [destinationCordinates]);

//   const getdirections = async () => {
//     if (!sourceCordinates || destinationCordinates.length === 0) return;

//     // Source + all destinations
//     const allCoords = [
//       `${sourceCordinates.lng},${sourceCordinates.lat}`,
//       ...destinationCordinates.map((d) => `${d.lng},${d.lat}`),
//     ].join(";");

//     const res = await fetch(
//       `${MAPBOX_DRIVING_ENDPOINT}${allCoords}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!res.ok) {
//       console.error("Failed to fetch directions");
//       return;
//     }

//     const result = await res.json();
//     console.log("Multi Destination Directions:", result);
//     setDirectionData(result);
//   };

//   return (
//     <div className="p-5 relative">
//       <h2 className="text-lg font-bold mb-2">Map</h2>

//       <div className="rounded-sm overflow-hidden">
//         {userLocation && (
//           <Map
//             ref={mapref}
//             mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
//             initialViewState={{
//               longitude: userLocation.lng,
//               latitude: userLocation.lat,
//               zoom: 14,
//             }}
//             style={{ width: "100%", height: 450, borderRadius: 20 }}
//             mapStyle="mapbox://styles/mapbox/streets-v9"
//           >
//             <Markers />

//             {directionData?.routes && (
//               <Mapboxroute
//                 coordinates={directionData.routes[0]?.geometry?.coordinates}
//               />
//             )}
//           </Map>
//         )}

//         {directionData?.routes && (
//           <div className="min-w-[30%] absolute top-14 right-6 flex justify-between items-center bg-black p-4 rounded-lg text-white">
//             <DistanceTime />
//             <span>
//               Total: {(directionData.routes[0].distance / 1000).toFixed(2)} km
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Mapboxmap;


"use client";
import React, { useContext, useEffect, useRef } from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Markers from "./Markers";
import Mapboxroute from "./Mapboxroute";
import DistanceTime from "./DistanceTime";
import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
import { SourceCordinatesContext } from "../../context/SourceCordinates";
import { DirectionsContext } from "../../context/DirectionDataContext";
import { UserLocationContext } from "../../context/UserlocationContext";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const Mapboxmap = () => {
  const mapref = useRef(null);
  const { destinations } = useContext(DestinationCordinatesContext);
  const { userLocation } = useContext(UserLocationContext);
  const { sourceCordinates } = useContext(SourceCordinatesContext);
  const { directionData, setDirectionData } = useContext(DirectionsContext);

  // Fly to source
  useEffect(() => {
    if (sourceCordinates?.lat && sourceCordinates?.lng) {
      mapref.current?.flyTo({
        center: [sourceCordinates.lng, sourceCordinates.lat],
        duration: 2000,
      });
    }
  }, [sourceCordinates]);

  
  useEffect(() => {
    if (destinations.length > 0) {
      const lastDest = destinations[destinations.length - 1];
      if (lastDest?.lat && lastDest?.lng) {
        mapref.current?.flyTo({
          center: [lastDest.lng, lastDest.lat],
          duration: 2000,
        });
      }
      if(sourceCordinates && destinations) {
      getdirections();
    }
    }
  }, [destinations]);

  const getdirections = async () => {
    if (!sourceCordinates || destinations.length === 0) return;

    const allCoords = [
      `${sourceCordinates.lng},${sourceCordinates.lat}`,
      ...destinations.map((d) => `${d.lng},${d.lat}`),
    ].join(";");

    const res = await fetch(
      `${MAPBOX_DRIVING_ENDPOINT}${allCoords}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );

    if (!res.ok) {
      console.error("Failed to fetch directions");
      return;
    }

    const result = await res.json();

    console.log(result)
    
     setDirectionData(result);

  };

  return (
    <div className="p-5 relative">
      <h2 className="text-lg font-bold mb-2">Map</h2>

      <div className="rounded-sm overflow-hidden">
        {userLocation && (
          <Map
            ref={mapref}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 14,
            }}
            style={{ width: "100%", height: 450, borderRadius: 20 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Markers />
           {directionData && directionData.routes && (
             <Mapboxroute coordinates={directionData?.routes[0]?.geometry?.coordinates} />
            )}
          </Map>
        )}

        {/* { directionData && directionData.route && ( */}
          <div className="min-w-[30%] absolute top-14 right-6 flex justify-between items-center bg-black p-4 rounded-lg text-white">
            <DistanceTime />

          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Mapboxmap;
