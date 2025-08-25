"use client";
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchCarsStart } from "@/store/Slices/CarSlice";
import toast from "react-hot-toast";
import { Users, Briefcase, Loader2 } from "lucide-react";
import { DirectionsContext } from "../../context/DirectionDataContext";
import { SelectedCarAmountContext } from "../../context/SelectedCarAmountContext";
import { CarContext } from "../../context/CarContext";

const Car = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true); 

  const dispatch = useDispatch();
  const { carlist } = useSelector((state) => state.Car);

  const { directionData } = useContext(DirectionsContext);
     const { carAmount, setCarAmount } = useContext(SelectedCarAmountContext);
     const { cardata, setCardata } = useContext(CarContext);

    const getCostOfCar = (farePerKm, baseFare) => {
    const distance = directionData?.routes?.[0]?.distance || 0; 
    const distanceInKm = distance / 1000;

    const fare = Number(farePerKm) || 0;
    const base = Number(baseFare) || 0;

    const total = base + fare * distanceInKm;

    return total.toFixed(2);
  };

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/get-all-cars");
        if(res.data.success){
          dispatch(fetchCarsStart(res?.data?.data || res.data));
        }
      } catch (err) {
        toast.error("No cars found");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [dispatch]);

  return (
    <div className="mt-5">
      <h2 className="font-semibold text-lg mb-4">Select Car</h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-gray-600 w-8 h-8" />
        </div>
      )}

    
      {!loading && carlist?.length > 0 && (
        <div className="flex overflow-x-auto space-x-5 scrollbar-hide pb-4">
          {carlist.map((item) => (
            <div
              key={item.id}
              onClick={() => {
    if (!directionData?.routes?.[0]) {
      toast.error("Please enter your source and destination first!");
      return;
    }
    setSelectedCar(item.id);
    setCarAmount(getCostOfCar(item.fare_per_km, item.base_fare));
    setCardata(item)
  }}
              className={`relative bg-white shadow-md hover:shadow-lg rounded-xl min-w-[260px] max-w-[260px] flex-shrink-0 p-4 border 
                ${
                  selectedCar === item.id
                    ? "border-black border-2"
                    : "border-gray-200"
                } 
                cursor-pointer transition-all duration-300 ease-in-out`}
            >
              {directionData?.routes?.[0]?.distance && (
                <span className="absolute top-3 right-3 bg-black text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                  ${getCostOfCar(item.fare_per_km, item.base_fare)}
                </span>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.car_type}</p>
              </div>

              <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={item?.car_image}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="text-center">
                <div className="flex justify-between items-center text-gray-600">
                  <p className="text-sm text-gray-500">
                    Base Fare:{" "}
                    <span className="font-semibold text-gray-800">${item.base_fare}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Per Km:{" "}
                    <span className="font-semibold text-gray-800">${item.fare_per_kilometer}</span>
                  </p>
                </div>

                <div className="flex justify-end gap-6 mt-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={18} />
                    <span className="text-sm">{item.number_of_passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={18} />
                    <span className="text-sm">{item.number_of_luggage}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No cars found */}
      {!loading && carlist?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No cars available.</p>
      )}
    </div>
  );
};

export default Car;
