// // "use client";
// // import React, { useEffect, useState, useRef, useContext } from "react";
// // import { SourceCordinatesContext } from "../../context/SourceCordinates";
// // import { DestinationCordinatesContext } from "../../context/DestinationCordinates";


// // const BASE_MAPBOX_RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve/";
// // const session_token = "8e4f51b2-8a63-4ac0-9187-91fd3770f7d2";

// // const AutoCompletetrAdress = () => {
// //   const [source, setSource] = useState("");
// //   const { setSourceCordinate } = useContext(SourceCordinatesContext);

// //   // multiple destination inputs (ui state)
// //   const [destInputs, setDestInputs] = useState([{ value: "", suggestions: [] }]);
// //   const { destinations, setDestinations } = useContext(DestinationCordinatesContext);

// //   const sourceTyping = useRef(false);
// //   const typingRefs = useRef({}); // per destination input index: boolean

// //   // --- common fetch suggest ---
// //   const fetchSuggest = async (query) => {
// //     const response = await fetch(`/api/search-address?q=${encodeURIComponent(query)}`, {
// //       headers: { "Content-Type": "application/json" },
// //     });
// //     const result = await response.json();
// //     return result?.result?.suggestions || [];
// //   };

// //   const updateDestInput = (index, key, value) => {
// //     setDestInputs((prev) => prev.map((d, i) => (i === index ? { ...d, [key]: value } : d)));
// //   };

// //   // debounce source
// //   const [sourceList, setSourceList] = useState([]);
// //   useEffect(() => {
// //     if (!sourceTyping.current) return;
// //     const t = setTimeout(async () => {
// //       if (!source) return setSourceList([]);
// //       try {
// //         const list = await fetchSuggest(source);
// //         setSourceList(list);
// //       } catch (e) {
// //         console.error(e);
// //       }
// //     }, 800);
// //     return () => clearTimeout(t);
// //   }, [source]);

// //   // debounce destination inputs
// //   useEffect(() => {
// //     const timers = [];
// //     destInputs.forEach((d, idx) => {
// //       if (!typingRefs.current[idx]) return;
// //       const timer = setTimeout(async () => {
// //         if (!d.value) return updateDestInput(idx, "suggestions", []);
// //         try {
// //           const list = await fetchSuggest(d.value);
// //           updateDestInput(idx, "suggestions", list);
// //         } catch (e) {
// //           console.error(e);
// //         }
// //       }, 800);
// //       timers.push(timer);
// //     });
// //     return () => timers.forEach(clearTimeout);
// //   }, [destInputs]);

// //   // --- click handlers ---
// //   const onSourceClick = async (item) => {
// //     sourceTyping.current = false;
// //     setSource(item.full_address);
// //     setSourceList([]);
// //     const res = await fetch(
// //       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
// //     );
// //     const result = await res.json();
// //     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
// //     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];
// //     setSourceCordinate({ lng, lat });
// //   };

// //   const onDestClick = async (item, idx) => {
// //     typingRefs.current[idx] = false;
// //     updateDestInput(idx, "value", item.full_address);
// //     updateDestInput(idx, "suggestions", []);

// //     const res = await fetch(
// //       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
// //     );
// //     const result = await res.json();
// //     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
// //     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];

// //     // place coord at same index in destinations array
// //     setDestinations((prev) => {
// //       const copy = [...prev];
// //       copy[idx] = { lng, lat };
// //       return copy;
// //     });
// //   };

// //   return (
// //     <div className="mt-5">
// //       {/* SOURCE */}
// //       <div className="mb-5 relative">
// //         <label className="text-gray-400">Where From?</label>
// //         <input
// //           type="text"
// //           className="bg-white p-1 border w-full rounded-md outline-none focus:border-yellow-300"
// //           value={source}
// //           onChange={(e) => {
// //             sourceTyping.current = true;
// //             setSource(e.target.value);
// //           }}
// //         />
// //         {sourceList.length > 0 && (
// //           <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
// //             {sourceList.map((item, i) => (
// //               <div
// //                 key={i}
// //                 className="p-2 hover:bg-gray-100 cursor-pointer"
// //                 onClick={() => onSourceClick(item)}
// //               >
// //                 {item.full_address}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* DESTINATIONS */}
// //       {destInputs.map((d, index) => (
// //         <div key={index} className="mb-5 relative">
// //           <label className="text-gray-400">Drop {index + 1}</label>
// //           <input
// //             type="text"
// //             className="bg-white p-1 border w-full rounded-md outline-none focus:border-yellow-300"
// //             value={d.value}
// //             onChange={(e) => {
// //               typingRefs.current[index] = true;
// //               updateDestInput(index, "value", e.target.value);
// //             }}
// //           />
// //           {d.suggestions.length > 0 && (
// //             <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
// //               {d.suggestions.map((item, i) => (
// //                 <div
// //                   key={i}
// //                   className="p-2 hover:bg-gray-100 cursor-pointer"
// //                   onClick={() => onDestClick(item, index)}
// //                 >
// //                   {item.full_address}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       ))}

// //       {/* ADD DROP */}
// //       <button
// //         type="button"
// //         onClick={() => setDestInputs((prev) => [...prev, { value: "", suggestions: [] }])}
// //         className="mt-2 bg-black text-white px-4 py-2 rounded-md"
// //       >
// //         + Add Drop
// //       </button>
// //     </div>
// //   );
// // };

// // export default AutoCompletetrAdress;


// "use client";
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SourceCordinatesContext } from "../../context/SourceCordinates";
// import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
// import { UserLocationContext } from "../../context/UserlocationContext";
// import { useSelector } from "react-redux";
// import { UserAddressContext } from "../../context/UserAddressContext";
// import { SourceAddressConext } from "../../context/SourceAddressConext";
// import { DestinationAddressContext } from "../../context/DestinationAddressContext";

// const BASE_MAPBOX_RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve/";
// const session_token = "8e4f51b2-8a63-4ac0-9187-91fd3770f7d2";

// const AutoCompletetrAdress = () => {
 
//   const { setSourceCordinate } = useContext(SourceCordinatesContext);
//   const { userAddress } = useContext(UserAddressContext);
//   const { setSourceAddress } = useContext(SourceAddressConext);
//   const { setDestinationAddress } = useContext(DestinationAddressContext);
  
//   const [source, setSource] = useState(userAddress);
//   const [destInputs, setDestInputs] = useState([{ value: "", suggestions: [] }]);
//   const { setDestinations } = useContext(DestinationCordinatesContext);
  
//   const sourceTyping = useRef(false);
//   const typingRefs = useRef({}); 
  
//   useEffect(() => {
    
//   if(userAddress){
  
//     setSource(userAddress)
//   }
//   }, [userAddress])


//   const fetchSuggest = async (query) => {
//     const response = await fetch(`/api/search-address?q=${encodeURIComponent(query)}`, {
//       headers: { "Content-Type": "application/json" },
//     });
//     const result = await response.json();

//     return result?.result?.features || [];
//   };

//   const updateDestInput = (index, key, value) => {
//     setDestInputs((prev) =>
//       prev.map((d, i) => (i === index ? { ...d, [key]: value } : d))
//     );
//   };


//   const [sourceList, setSourceList] = useState([]);

// useEffect(() => {
//   if (!sourceTyping.current) return;

//   const fetchData = async () => {
//     if (!source) {
//       setSourceList([]);
//       return;
//     }
//     try {
//       const list = await fetchSuggest(source);
//       setSourceList(list);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   fetchData();
// }, [source]);

  
//   useEffect(() => {
//     const timers = [];
//     destInputs.forEach((d, idx) => {
//       if (!typingRefs.current[idx]) return;
//       const timer = setTimeout(async () => {
//         if (!d.value) return updateDestInput(idx, "suggestions", []);
//         try {
//           const list = await fetchSuggest(d.value);
//           updateDestInput(idx, "suggestions", list);
//         } catch (e) {
//           console.error(e);
//         }
//       }, 800);
//       timers.push(timer);
//     });
//     return () => timers.forEach(clearTimeout);
//   }, [destInputs]);

  
  
//   const onSourceClick = async (item) => {
//     sourceTyping.current = false;
//     setSource(item.full_address);
//     setSourceAddress(item.full_address)
//     setSourceList([]);
//     const res = await fetch(
//       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//     );
//     const result = await res.json();
//     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
//     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];
//     setSourceCordinate({ lng, lat });
//   };

//   const onDestClick = async (item, idx) => {
//     typingRefs.current[idx] = false;
//     updateDestInput(idx, "value", item.full_address);
//     setDestinationAddress((prev) => [...prev, { destinaitonaddress: item.full_address }]);
//     updateDestInput(idx, "suggestions", []);

//     const res = await fetch(
//       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//     );
//     const result = await res.json();
//     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
//     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];

//     setDestinations((prev) => {
//       const copy = [...prev];
//       copy[idx] = { lng, lat };
//       return copy;
//     });
//   };

//   return (
//     <div className="mt-5 space-y-6 h-[40vh] overflow-y-auto">
//       {/* SOURCE */}
//       <div className="relative">
//         <label className="text-gray-600 font-medium">Where From?</label>
//         <input
//           type="text"
//           className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//           value={source}
//           onChange={(e) => {
//             sourceTyping.current = true;
//             setSource(e.target.value);
//           }}
//         />
//         {sourceList.length > 0 && (
//           <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
//             {sourceList.map((item, i) => (
//               <div
//                 key={i}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => onSourceClick(item)}
//               >
//                 {item.full_address}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

     
//       <AnimatePresence>
//         {destInputs.map((d, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className="relative"
//           >
//             <label className="text-gray-600 font-medium"> {index > 0 ?"Enter Your Next Destination ?" :"Where To ?"}</label>
//             <input
//               type="text"
//               className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//               value={d.value}
//               onChange={(e) => {
//                 typingRefs.current[index] = true;
//                 updateDestInput(index, "value", e.target.value);
//               }}
//             />
//             {d.suggestions.length > 0 && (
//               <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
//                 {d.suggestions.map((item, i) => (
//                   <div
//                     key={i}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => onDestClick(item, index)}
//                   >
//                     {item.full_address}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       {/* ADD DROP BUTTON */}
//       <motion.button
//         type="button"
       
//         onClick={() =>
//           setDestInputs((prev) => [...prev, { value: "", suggestions: [] }])
//         }
//         className="w-full border-2 border-black text-black font-medium px-4 py-2 rounded-lg transition hover:bg-black hover:text-white"
//       >
//         + Add Drop
//       </motion.button>
//     </div>
//   );
// };

// export default AutoCompletetrAdress;


// "use client";
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SourceCordinatesContext } from "../../context/SourceCordinates";
// import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
// import { UserAddressContext } from "../../context/UserAddressContext";
// import { SourceAddressConext } from "../../context/SourceAddressConext";
// import { DestinationAddressContext } from "../../context/DestinationAddressContext";

// const BASE_MAPBOX_RETRIEVE_URL =
//   "https://api.mapbox.com/search/searchbox/v1/retrieve/";
// const session_token = "8e4f51b2-8a63-4ac0-9187-91fd3770f7d2";

// const AutoCompletetrAdress = () => {
//   const { setSourceCordinate } = useContext(SourceCordinatesContext);
//   const { userAddress } = useContext(UserAddressContext);
//   const { setSourceAddress } = useContext(SourceAddressConext);
//   const { setDestinationAddress } = useContext(DestinationAddressContext);
//   const { setDestinations } = useContext(DestinationCordinatesContext);

//   const [source, setSource] = useState(userAddress);
//   const [sourceList, setSourceList] = useState([]);
//   const [destInputs, setDestInputs] = useState([
//     { value: "", suggestions: [] },
//   ]);

//   const sourceTyping = useRef(false);
//   const typingRefs = useRef({});

//   useEffect(() => {
//     if (userAddress) {
//       setSource(userAddress);
//     }
//   }, [userAddress]);

//   // common fetch
//   const fetchSuggest = async (query) => {
//     const response = await fetch(
//       `/api/search-address?q=${encodeURIComponent(query)}`,
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//     const result = await response.json();
//     console.log(result)
//     return result?.result?.features || [];
//   };

//   // update destination input
//   const updateDestInput = (index, key, value) => {
//     setDestInputs((prev) =>
//       prev.map((d, i) => (i === index ? { ...d, [key]: value } : d))
//     );
//   };


//   useEffect(() => {
//     if (!sourceTyping.current) return;

//     const fetchData = async () => {
//       if (!source) {
//         setSourceList([]);
//         return;
//       }
//       try {
//         const list = await fetchSuggest(source);
       
//         setSourceList(list);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     fetchData();
//   }, [source]);

//   // Destination suggestions (instant fetch without debounce)
//   useEffect(() => {
//     destInputs.forEach(async (d, idx) => {
//       if (!typingRefs.current[idx]) return;
//       if (!d.value) {
//         updateDestInput(idx, "suggestions", []);
//         return;
//       }
//       try {
//         const list = await fetchSuggest(d.value);
//         updateDestInput(idx, "suggestions", list);
//       } catch (e) {
//         console.error(e);
//       }
//     });
//   }, [destInputs]);

//   // Click handlers
//   const onSourceClick = async (item) => {
//     sourceTyping.current = false;
//     setSource(item.full_address);
//     setSourceAddress(item.full_address);
//     setSourceList([]);

//     const res = await fetch(
//       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//     );
//     const result = await res.json();
//     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
//     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];
//     setSourceCordinate({ lng, lat });
//   };

//   const onDestClick = async (item, idx) => {
//     typingRefs.current[idx] = false;
//     updateDestInput(idx, "value", item.full_address);
//     setDestinationAddress((prev) => [
//       ...prev,
//       { destinaitonaddress: item.full_address },
//     ]);
//     updateDestInput(idx, "suggestions", []);

//     const res = await fetch(
//       `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
//     );
//     const result = await res.json();
//     const lng = result?.features?.[0]?.geometry?.coordinates?.[0];
//     const lat = result?.features?.[0]?.geometry?.coordinates?.[1];

//     setDestinations((prev) => {
//       const copy = [...prev];
//       copy[idx] = { lng, lat };
//       return copy;
//     });
//   };

//   return (
//     <div className="mt-5 space-y-6 h-[40vh] overflow-y-auto">
//       {/* SOURCE */}
//       <div className="relative">
//         <label className="text-gray-600 font-medium">Where From?</label>
//         <input
//           type="text"
//           className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//           value={source}
//           onChange={(e) => {
//             sourceTyping.current = true;
//             setSource(e.target.value);
//           }}
//         />
//         {sourceList.length > 0 && (
//           <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
//             {sourceList.map((item, i) => (
//               <div
//                 key={i}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => onSourceClick(item)}
//               >
//                 {item?.properties?.full_address}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* DESTINATIONS */}
//       <AnimatePresence>
//         {destInputs.map((d, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className="relative"
//           >
//             <label className="text-gray-600 font-medium">
//               {index > 0 ? "Enter Your Next Destination ?" : "Where To ?"}
//             </label>
//             <input
//               type="text"
//               className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//               value={d.value}
//               onChange={(e) => {
//                 typingRefs.current[index] = true;
//                 updateDestInput(index, "value", e.target.value);
//               }}
//             />
//             {d.suggestions.length > 0 && (
//               <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
//                 {d.suggestions.map((item, i) => (
//                   <div
//                     key={i}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => onDestClick(item, index)}
//                   >
//                       {item?.properties?.full_address}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       {/* ADD DROP BUTTON */}
//       <motion.button
//         type="button"
//         onClick={() =>
//           setDestInputs((prev) => [...prev, { value: "", suggestions: [] }])
//         }
//         className="w-full border-2 border-black text-black font-medium px-4 py-2 rounded-lg transition hover:bg-black hover:text-white"
//       >
//         + Add Drop
//       </motion.button>
//     </div>
//   );
// };

// export default AutoCompletetrAdress;


"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SourceCordinatesContext } from "../../context/SourceCordinates";
import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
import { UserAddressContext } from "../../context/UserAddressContext";
import { SourceAddressConext } from "../../context/SourceAddressConext";
import { DestinationAddressContext } from "../../context/DestinationAddressContext";

const AutoCompletetrAdress = () => {
  const { setSourceCordinate } = useContext(SourceCordinatesContext);
  const { userAddress } = useContext(UserAddressContext);
  const { setSourceAddress } = useContext(SourceAddressConext);
  const { setDestinationAddress } = useContext(DestinationAddressContext);
  const { setDestinations } = useContext(DestinationCordinatesContext);

  const [source, setSource] = useState(userAddress || "");
  const [sourceList, setSourceList] = useState([]);
  const [destInputs, setDestInputs] = useState([{ value: "", suggestions: [] }]);

  const sourceTyping = useRef(false);
  const typingRefs = useRef({});

  useEffect(() => {
    if (userAddress) setSource(userAddress);
  }, [userAddress]);

  const fetchSuggest = async (query) => {
    if (!query) return [];
    const response = await fetch(
      `/api/search-address?q=${encodeURIComponent(query)}`,
      { headers: { "Content-Type": "application/json" } }
    );
    const result = await response.json();


    return result?.result?.features || [];
  };

  useEffect(() => {
    if (!sourceTyping.current) return;

    const fetchData = async () => {
      const list = await fetchSuggest(source);
      setSourceList(list);
    };

    fetchData();
  }, [source]);

  useEffect(() => {
    destInputs.forEach(async (d, idx) => {
      if (!typingRefs.current[idx] || !d.value) {
        updateDestInput(idx, "suggestions", []);
        return;
      }
      const list = await fetchSuggest(d.value);
      updateDestInput(idx, "suggestions", list);
    });
  }, [destInputs]);

  const updateDestInput = (index, key, value) => {
    setDestInputs((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [key]: value } : d))
    );
  };

  const onSourceClick = (item) => {
    sourceTyping.current = false;
    const address = item?.properties?.full_address || "";
    setSource(address);
    setSourceAddress(address);
    setSourceList([]);

    const lng = item?.properties?.coordinates?.longitude;
    const lat = item?.properties?.coordinates?.latitude;
    if (lng && lat) setSourceCordinate({ lng, lat });
  };

  const onDestClick = (item, idx) => {
    typingRefs.current[idx] = false;
    const address = item?.properties?.full_address || "";
    updateDestInput(idx, "value", address);
    updateDestInput(idx, "suggestions", []);

    setDestinationAddress((prev) => {
      const copy = [...prev];
      copy[idx] = { destinaitonaddress: address };
      return copy;
    });

    const lng = item?.properties?.coordinates?.longitude;
    const lat = item?.properties?.coordinates?.latitude;
    if (lng && lat) {
      setDestinations((prev) => {
        const copy = [...prev];
        copy[idx] = { lng, lat };
        return copy;
      });
    }
  };

  return (
    <div className="mt-5 space-y-6  ">
      {/* SOURCE */}
      <div className="relative">
        <label className="text-gray-600 font-medium">Where From?</label>
        <input
          type="text"
          className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
          value={source}
          onChange={(e) => {
            sourceTyping.current = true;
            setSource(e.target.value);
          }}
        />

        {sourceList?.length > 0 && (
          <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1  ">
            {sourceList.map((item, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSourceClick(item)}
              >
                {item?.properties?.full_address}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DESTINATIONS */}
      <AnimatePresence>
        {destInputs?.map((d, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <label className="text-gray-600 font-medium">
              {index > 0 ? "Enter Your Next Destination ?" : "Where To ?"}
            </label>
            <input
              type="text"
              className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              value={d.value}
              onChange={(e) => {
                typingRefs.current[index] = true;
                updateDestInput(index, "value", e.target.value);
              }}
            />
            {d.suggestions.length > 0 && (
              <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 ">
                {d.suggestions.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onDestClick(item, index)}
                  >
                    {item?.properties?.full_address}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

     
      <motion.button
        type="button"
        onClick={() =>
          setDestInputs((prev) => [...prev, { value: "", suggestions: [] }])
        }
        className="w-full border-2 border-black text-black font-medium px-4 py-2 rounded-lg transition hover:bg-black hover:text-white"
      >
        + Add Drop
      </motion.button>
    </div>
  );
};

export default AutoCompletetrAdress;


// "use client";
// import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SourceCordinatesContext } from "../../context/SourceCordinates";
// import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
// import { UserAddressContext } from "../../context/UserAddressContext";
// import { SourceAddressConext } from "../../context/SourceAddressConext";
// import { DestinationAddressContext } from "../../context/DestinationAddressContext";

// // debounce helper
// const debounce = (fn, delay = 100) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => fn(...args), delay);
//   };
// };

// const AutoCompletetrAdress = () => {
//   const { setSourceCordinate } = useContext(SourceCordinatesContext);
//   const { userAddress } = useContext(UserAddressContext);
//   const { setSourceAddress } = useContext(SourceAddressConext);
//   const { setDestinationAddress } = useContext(DestinationAddressContext);
//   const { setDestinations } = useContext(DestinationCordinatesContext);

//   const [source, setSource] = useState(userAddress || "");
//   const [sourceList, setSourceList] = useState([]);
//   const [destInputs, setDestInputs] = useState([{ value: "", suggestions: [] }]);

//   const controllerRef = useRef(null);

//   useEffect(() => {
//     if (userAddress) setSource(userAddress);
//   }, [userAddress]);

//   // fetch suggestion with abort
//   const fetchSuggest = useCallback(async (query) => {
//     if (!query) return [];

//     // cancel previous request
//     if (controllerRef.current) controllerRef.current.abort();
//     controllerRef.current = new AbortController();

//     try {
//       const response = await fetch(
//         `/api/search-address?q=${encodeURIComponent(query)}`,
//         {
//           headers: { "Content-Type": "application/json" },
//           signal: controllerRef.current.signal,
//         }
//       );

//       if (!response.ok) return [];
//       const result = await response.json();
//       console.log(result)
//       return result?.result?.features || [];
//     } catch (err) {
//       if (err.name !== "AbortError") console.error(err);
//       return [];
//     }
//   }, []);

//   // debounced source search
//   const handleSourceChange = useCallback(
//     debounce(async (value) => {
//       const list = await fetchSuggest(value);
//       setSourceList(list);
//     }, 100),
//     []
//   );


//   const handleDestChange = useCallback(
//     debounce(async (value, idx) => {
//       const list = await fetchSuggest(value);
//       updateDestInput(idx, "suggestions", list);
//     }, 100),
//     []
//   );

//   const updateDestInput = (index, key, value) => {
//     setDestInputs((prev) =>
//       prev.map((d, i) => (i === index ? { ...d, [key]: value } : d))
//     );
//   };

//   const onSourceClick = (item) => {
//     const address = item?.properties?.full_address || "";
//     setSource(address);
//     setSourceAddress(address);
//     setSourceList([]);

//     const lng = item?.properties?.coordinates?.longitude;
//     const lat = item?.properties?.coordinates?.latitude;
//     if (lng && lat) setSourceCordinate({ lng, lat });
//   };

//   const onDestClick = (item, idx) => {
//     const address = item?.properties?.full_address || "";
//     updateDestInput(idx, "value", address);
//     updateDestInput(idx, "suggestions", []);

//     setDestinationAddress((prev) => {
//       const copy = [...prev];
//       copy[idx] = { destinaitonaddress: address };
//       return copy;
//     });

//     const lng = item?.properties?.coordinates?.longitude;
//     const lat = item?.properties?.coordinates?.latitude;
//     if (lng && lat) {
//       setDestinations((prev) => {
//         const copy = [...prev];
//         copy[idx] = { lng, lat };
//         return copy;
//       });
//     }
//   };

//   return (
//     <div className="mt-5 space-y-6">
//       {/* SOURCE */}
//       <div className="relative">
//         <label className="text-gray-600 font-medium">Where From?</label>
//         <input
//           type="text"
//           className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//           value={source}
//           onChange={(e) => {
//             setSource(e.target.value);
//             handleSourceChange(e.target.value);
//           }}
//         />

//         {sourceList?.length > 0 && (
//           <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1">
//             {sourceList.map((item, i) => (
//               <div
//                 key={i}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => onSourceClick(item)}
//               >
//                 {item?.properties?.full_address}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* DESTINATIONS */}
//       <AnimatePresence>
//         {destInputs?.map((d, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className="relative"
//           >
//             <label className="text-gray-600 font-medium">
//               {index > 0 ? "Enter Your Next Destination ?" : "Where To ?"}
//             </label>
//             <input
//               type="text"
//               className="bg-white p-2 border border-gray-300 w-full rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
//               value={d.value}
//               onChange={(e) => {
//                 updateDestInput(index, "value", e.target.value);
//                 handleDestChange(e.target.value, index);
//               }}
//             />
//             {d.suggestions.length > 0 && (
//               <div className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1">
//                 {d.suggestions.map((item, i) => (
//                   <div
//                     key={i}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => onDestClick(item, index)}
//                   >
//                     {item?.properties?.full_address}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       <motion.button
//         type="button"
//         onClick={() =>
//           setDestInputs((prev) => [...prev, { value: "", suggestions: [] }])
//         }
//         className="w-full border-2 border-black text-black font-medium px-4 py-2 rounded-lg transition hover:bg-black hover:text-white"
//       >
//         + Add Drop
//       </motion.button>
//     </div>
//   );
// };

// export default AutoCompletetrAdress;
