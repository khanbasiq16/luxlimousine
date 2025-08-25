// "use client"
// import { store } from "@/store/store";
// import React, { useEffect, useState } from "react";
// import { Provider } from "react-redux";
// import { SourceCordinatesContext } from "../component/context/SourceCordinates";
// import { DestinationCordinatesContext } from "../component/context/DestinationCordinates";
// import { DirectionsContext } from "../component/context/DirectionDataContext";
// import { SelectedCarAmountContext } from "../component/context/SelectedCarAmountContext";
// import { UserLocationContext } from "../component/context/UserlocationContext";

// const HomeProvider = ({children}) => {
//    const [userLocation, setUserLocation] = useState();
//   const [sourceCordinates, setSourceCordinate] = useState();
//   const [destinationCordinates, setDestinationCordinates] = useState();
//   const [directionData, setDirectionData] = useState([]);
//   // const [mutdestinations, setDestinations] = useState([]);
//   const [carAmount, setCarAmount] = useState();

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   return (
//     <>
//       <Provider store={store}>
//          <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
//       <SourceCordinatesContext.Provider value={{ sourceCordinates, setSourceCordinate }}>
//         <DestinationCordinatesContext.Provider value={{ destinationCordinates, setDestinationCordinates }}>
//           <DirectionsContext.Provider value={{ directionData, setDirectionData }}>
//             <SelectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>

//         {children}
//             </SelectedCarAmountContext.Provider>
//         </DirectionsContext.Provider>
//         </DestinationCordinatesContext.Provider>
//         </SourceCordinatesContext.Provider>
//         </UserLocationContext.Provider>
//         </Provider>
//     </>
//   );
// };

// export default HomeProvider


"use client";
import { Provider } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { store } from "@/store/store";
import React, { useContext, useEffect, useState } from "react";

import { SourceCordinatesContext } from "../component/context/SourceCordinates";
import { DestinationCordinatesContext } from "../component/context/DestinationCordinates";
import { DirectionsContext } from "../component/context/DirectionDataContext";
import { SelectedCarAmountContext } from "../component/context/SelectedCarAmountContext";
import { UserLocationContext } from "../component/context/UserlocationContext";
import { UserAddressContext } from "../component/context/UserAddressContext";
import { SourceAddressConext } from "../component/context/SourceAddressConext";
import { DestinationAddressContext } from "../component/context/DestinationAddressContext";
import { UserContext } from "../component/context/UserContext";

import { usePathname } from "next/navigation";
import Navbar from "../component/home/Navbar";
import { CarContext } from "../component/context/CarContext";
import { Menu, X } from "lucide-react";

const HomeProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState();
  const [cardata, setCardata] = useState();
  const [userdata, setUserData] = useState();
  const [userAddress, setUserAddress] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState([]);
  const [sourceCordinates, setSourceCordinate] = useState();
  const [destinations, setDestinations] = useState([]);
  const [directionData, setDirectionData] = useState({});
  const [carAmount, setCarAmount] = useState();
const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

       
        setUserLocation({ lat, lng });

        try {
          
          const res = await fetch(
            `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );
          const data = await res.json();

          if (data?.features?.length > 0) {
            console.log(data.features[0].properties.full_address)
            setUserAddress(data.features[0].properties.full_address);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);
  return (
    <Provider store={store}>
      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      <CarContext.Provider value={{ cardata, setCardata }}>
      <UserContext.Provider value={{ userdata, setUserData }}>
      <UserAddressContext.Provider value={{ userAddress, setUserAddress }}>
      <SourceAddressConext.Provider value={{ sourceAddress, setSourceAddress }}>
      <DestinationAddressContext.Provider value={{ destinationAddress, setDestinationAddress }}>
        <SourceCordinatesContext.Provider value={{ sourceCordinates, setSourceCordinate }}>
          <DestinationCordinatesContext.Provider value={{ destinations, setDestinations }}>
            <DirectionsContext.Provider value={{ directionData, setDirectionData }}>
              <SelectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
                 <button
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  className="p-2 absolute left-4 top-3"
>
  <AnimatePresence mode="wait" initial={false}>
    {isSidebarOpen ? (
      <motion.div
        key="close"
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <X size={24} />
      </motion.div>
    ) : (
      <motion.div
        key="menu"
        initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Menu size={24} />
      </motion.div>
    )}
  </AnimatePresence>
</button>
              {isSidebarOpen && !["/payment", "/success"].includes(pathname) && <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />}
                <div className="mt-10">

                {children}
                </div>
              </SelectedCarAmountContext.Provider>
            </DirectionsContext.Provider>
          </DestinationCordinatesContext.Provider>
        </SourceCordinatesContext.Provider>
        </DestinationAddressContext.Provider>
        </SourceAddressConext.Provider>
        </UserAddressContext.Provider>
        </UserContext.Provider>
        </CarContext.Provider> 
      </UserLocationContext.Provider>
    </Provider>
  );
};

export default HomeProvider;
