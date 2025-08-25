"use client";
import { UserContext } from "@/app/component/context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import axios from "axios";
import Checkoutform from "@/app/component/home/Payment/Checkoutform";
import { User, Car, MapPin, CalendarDays, Mail, Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Page = () => {
  const router = useRouter();
  const { userdata, setUserData } = useContext(UserContext);
  const { booking } = useSelector((state) => state.Booking);

  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (booking?.carAmount) {
      setAmount(booking.carAmount);
      
      axios
        .post("/api/create-intent", { amount: booking.carAmount })
        .then((res) => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
          }
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
        });
    }
  }, [booking]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/get-user", { withCredentials: true });

        if (res.status !== 200) {
          router.replace("/sign-in");
          return;
        }

        setUserData(res.data?.user);
      } catch (err) {
        console.error("Error checking user:", err);
        router.replace("/sign-in");
      }
    };

    checkUser();
  }, [router, setUserData]);

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* LEFT SIDE - Booking Summary */}
        <div className=" rounded-2xl  p-8 space-y-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
            Booking Summary
          </h2>

          {/* Passenger Info */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <User className="w-5 h-5 text-gray-500" /> Passenger
            </h3>
            <p className="text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />{" "}
              {booking?.userdata?.name}
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" /> {booking?.userdata?.email}
            </p>
          </div>

          {/* Car Info */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Car className="w-5 h-5 text-gray-500" /> Car Details
            </h3>
            <p className="text-gray-700">Model: {booking?.cardata?.title}</p>
            <p className="text-gray-700">
              Type: {booking?.cardata?.car_type || "N/A"}
            </p>
            <p className="text-gray-900 font-semibold text-lg">
              Price: ${booking?.carAmount}
            </p>
          </div>

          {/* Trip Info */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MapPin className="w-5 h-5 text-gray-500" /> Trip Details
            </h3>
            <p className="text-gray-700">
              <span className="font-medium">From:</span>

              <li className="ml-2">{booking?.sourceAddress}</li>
            </p>
            <div className="text-gray-700">
              <span className="font-medium">To:</span>
              {Array.isArray(booking?.destinationAddress) &&
              booking.destinationAddress.length > 0 ? (
                <ul className="list-disc list-inside ml-2 space-y-1">
                  {booking.destinationAddress.map((item, index) => (
                    <li key={index}>{item.destinaitonaddress}</li>
                  ))}
                </ul>
              ) : (
                <span> {booking?.destinationAddress || "N/A"}</span>
              )}
            </div>
            <p className="flex items-center gap-2 text-gray-700">
              <CalendarDays className="w-4 h-4" />
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Payment Form */}
        <div className="bg-white rounded-2xl  p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
            Checkout
          </h2>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <Checkoutform clientSecret={clientSecret} amount={amount} />
            </Elements>
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
  </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
