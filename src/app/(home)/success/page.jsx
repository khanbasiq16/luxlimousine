"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Success Icon */}
      <CheckCircle className="text-black w-20 h-20 mb-4" />

    
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
    

<p className="text-gray-700 mb-2 text-center px-64">
  Thank you for choosing our service. Your payment has been received successfully.  
  Your car is on its way and will arrive shortly get ready for a comfortable ride!
</p>
 


   
      <Link
        href="/bookings"
        className="px-6 py-3 bg-black text-white font-medium rounded-md   transition"
      >
        View My Bookings
      </Link>
    </div>
  );
};

export default page;
