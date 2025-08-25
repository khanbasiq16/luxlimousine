"use client";
import React, { useContext, useEffect, useState } from "react";
import AutoCompletetrAdress from "./AutoCompletetrAdress";
import Car from "./Car";
import Cards from "./Cards";
import { useRouter } from "next/navigation";
import { SelectedCarAmountContext } from "../../context/SelectedCarAmountContext";
import { UserContext } from "../../context/UserContext";
import { SourceAddressConext } from "../../context/SourceAddressConext";
import { DestinationAddressContext } from "../../context/DestinationAddressContext";
import { CarContext } from "../../context/CarContext";
import { DirectionsContext } from "../../context/DirectionDataContext";
import { useDispatch } from "react-redux";
import { CreateBookigninstance } from "@/store/Slices/BookingSlice";
import toast from "react-hot-toast";
import { DestinationCordinatesContext } from "../../context/DestinationCordinates";
import { SourceCordinatesContext } from "../../context/SourceCordinates";


const Booking = () => {
  const router = useRouter();
   const dispatch = useDispatch()
  const { carAmount } = useContext(SelectedCarAmountContext);
    const { userdata } = useContext(UserContext);

      const { sourceAddress } = useContext(SourceAddressConext);
      const { destinationAddress } = useContext(DestinationAddressContext);
       const { cardata, setCardata } = useContext(CarContext);

      const { directionData } = useContext(DirectionsContext);
      const { destinations } = useContext(DestinationCordinatesContext);
      const { sourceCordinates } = useContext(SourceCordinatesContext);



  const [screen, setScreen] = useState(0);

  useEffect(() => {
    function updateScreen() {
      setScreen(window.innerHeight * 0.75);
    }
    updateScreen();



    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);


  const bookingHandler = () => {

  if (!userdata) {
    toast.error("User not logged in!");
    return;
  }

  if (!carAmount || !sourceAddress || !destinationAddress || !cardata || !directionData) {
    toast.error("Some booking data is missing!");
    return;
  }

  dispatch(
    CreateBookigninstance({
      carAmount,
      userdata,
      sourceAddress,
      destinationAddress,
      cardata,
      directionData,
      sourceCordinates:sourceCordinates,
      destinationCordinates:destinations
    })
  );

  router.push("/payment");
};

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Booking</h2>

      <div
        className="border-[1px] rounded-md flex overflow-hidden flex-col justify-between"
        style={{ height: screen }}
      >
        <div className="p-5 overflow-y-auto">
          <AutoCompletetrAdress />
          <Car />
        </div>

        <button
          onClick={bookingHandler}
          disabled={!carAmount}
          type="button"
          className={`w-full text-white py-3 rounded-lg font-medium transition-all duration-300 transform ${
            !carAmount
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:scale-105 hover:bg-gray-900 active:scale-95"
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Booking;
