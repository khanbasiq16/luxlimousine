"use client"
import React, { useContext, useEffect } from 'react'
import Booking from '../component/home/Booking/Booking'
import Mapboxmap from '../component/home/Map/Mapboxmap'
import { useDispatch } from 'react-redux'
import { setUserLocation } from '@/store/Slices/UserSlice'

import { usePathname, useRouter } from 'next/navigation'
import { UserContext } from '../component/context/UserContext'

const page = () => {
  const dispatch = useDispatch()
 const { setUserData } = useContext(UserContext);

const router = useRouter()
const pathname = usePathname()

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            // Mapbox Reverse Geocoding API
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );

            const data = await res.json();

            if (data?.features?.length > 0) {
              const fullAddress = data.features[0].place_name; // 🏠 Full address string

              dispatch(
                setUserLocation({
                  lat,
                  lng,
                  address: fullAddress,
                })
              );
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [dispatch]);


  useEffect(() => {
    const checkUser = async () => {
      try {
      
          const res = await fetch("/api/get-user", {
            method: "GET",
            credentials: "include",
          });

         
          const data = await res.json();

          console.log(data?.user)

          setUserData(data?.user)

          
         
    
      } catch (err) {
        console.error("Error checking user:", err);
       
      } 
    };

    checkUser();
  }, []);


  return (
   <div className="h-screen">
  
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="border border-blue-100">
          <Booking />
        </div>

        <div className="col-span-2  order-first lg:order-last">
          <Mapboxmap />
        </div>
      </div>
    </div>
  )
}

export default page