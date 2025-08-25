"use client";
import { Clearbookinginstance } from "@/store/Slices/BookingSlice";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Checkoutform = ({ clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()

  const dispatch = useDispatch()

  const { booking } = useSelector((state) => state.Booking);


const handleSubmit = async (event) => {
  event.preventDefault();
  if (!stripe || !elements) return;

  setLoading(true);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    // confirmParams: {
    //   return_url: `${window.location.origin}/success`,
    // },
    redirect: "if_required",
  });


  if (error) {
    console.error(error.message);
    toast.error(error.message || "Payment failed");
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    try {
       const res = await axios.post("/api/create-booking", { booking });

        if(res.data.success){
          toast.success(res.data.message) 
          dispatch(Clearbookinginstance())
          
    router.push(`${window.location.origin}/success`);
        }
    } catch (apiError) {
      console.error("API error:", apiError);
    }
  }
  setLoading(false);
};

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Complete Your Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        <PaymentElement />

        <button
          type="submit"
          disabled={!stripe || !elements || loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : `Pay Now $${amount}`}
        </button>

        {message && <div className="text-red-500 text-sm text-center">{message}</div>}
      </form>
    </div>
  );
};

export default Checkoutform;
