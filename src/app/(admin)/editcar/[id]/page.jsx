"use client";
import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import {
  Upload,
  Car,
  Users,
  Briefcase,
  DollarSign,
  MapPin,
  Loader2,
} from "lucide-react";
import Breadcrumbs from "@/app/component/breadcrumb/Breadcrumbs";
import SectionHead from "@/app/component/breadcrumb/SectionHead";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

const EditCarPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggages, setLuggages] = useState(0);
  const [carImage, setCarImage] = useState(null);
  const [baseFare, setBaseFare] = useState(0);
  const [farePerKm, setFarePerKm] = useState(0);
  const [carType, setCarType] = useState("Standard");
  const [loading, setLoading] = useState(false);
  const [oldImageUrl, setOldImageUrl] = useState("");

  const { quill, quillRef } = useQuill();

  
  useEffect(() => {
    if (!id) return;
    const fetchCar = async () => {
      try {
        const res = await axios.get(`/api/get-car/${id}`);
        const data = res.data.data;

        setCarName(data.title);
        setPassengers(data.number_of_passengers);
        setLuggages(data.number_of_luggage);
        setBaseFare(data.base_fare);
        setFarePerKm(data.fare_per_kilometer);
        setCarType(data.car_type);
        setOldImageUrl(data.car_image);

        if (quill) {
          quill.clipboard.dangerouslyPasteHTML(data.description || "");
        } else {
          setDescription(data.description);
        }
      } catch (error) {
        toast.error("Failed to fetch car details");
      }
    };
    fetchCar();
  }, [id, quill]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setDescription(quill.root.innerHTML);
      });
    }
  }, [quill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("carName", carName);
    formData.append("description", description);
    formData.append("passengers", passengers);
    formData.append("luggages", luggages);
    formData.append("baseFare", baseFare);
    formData.append("farePerKm", farePerKm);
    formData.append("carType", carType);
    if (carImage) formData.append("carImage", carImage);

    try {
      const response = await axios.patch(`/api/edit-car/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response?.data?.message || "Car updated successfully");
      router.push("/viewallcars");
    } catch (error) {``
      toast.error("Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCarImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setCarImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="ml-0 lg:ml-72 mt-6 p-8 max-w-4xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <SectionHead
          icon={<Car className="text-black" size={30} />}
          headertext="Edit Car"
        />
      </h2>

      <Breadcrumbs
        items={[
          { name: "Home", href: "/panel" },
          { name: "Cars", href: "/viewallcars" },
          { name: "Edit Car", href: `/admin/editcar/${id}` },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Car Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Toyota Corolla"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <div
            ref={quillRef}
            className="bg-white rounded-lg border border-gray-300"
          />
        </div>

        {/* Passengers & Luggages */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
              <Users size={18} /> Number of Passengers
            </label>
            <input
              type="number"
              min={1}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
              <Briefcase size={18} /> Number of Luggages
            </label>
            <input
              type="number"
              min={0}
              value={luggages}
              onChange={(e) => setLuggages(Number(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Car Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Car Image (Drag & Drop or Click to Upload)
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("carImageInput").click()}
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer h-40 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            {carImage ? (
              <img
                src={URL.createObjectURL(carImage)}
                alt="Car"
                className="h-full object-contain rounded-lg"
              />
            ) : oldImageUrl ? (
              <img
                src={oldImageUrl}
                alt="Car"
                className="h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <Upload size={26} className="mb-1 text-blue-500" />
                <span>Drag & Drop image or click to select</span>
              </div>
            )}
          </div>
          <input
            id="carImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Base Fare & Fare per km */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
              <DollarSign size={18} /> Base Fare
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={baseFare}
              onChange={(e) => setBaseFare(Number(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={18} /> Fare Per Kilometer
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={farePerKm}
              onChange={(e) => setFarePerKm(Number(e.target.value))}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Car Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Car Type
          </label>
          <select
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="Luxury">Luxury</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Economy">Economy</option>
            <option value="Next Available">Next Available</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 flex justify-center items-center rounded-lg font-medium transition-transform duration-200 transform hover:scale-102"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Car className="inline mr-2" size={20} />
              Update Car
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditCarPage;
