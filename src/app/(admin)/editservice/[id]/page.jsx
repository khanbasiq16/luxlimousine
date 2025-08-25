"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import Breadcrumbs from "@/app/component/breadcrumb/Breadcrumbs";
import SectionHead from "@/app/component/breadcrumb/SectionHead";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

const BASE_MAPBOX_RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve/";
const session_token = "8e4f51b2-8a63-4ac0-9187-91fd3770f7d2"; // random UUID

const EditServiceAreaPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [areaName, setAreaName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const typingRef = useRef(false);

  // fetch service area data
  useEffect(() => {
    const fetchServiceArea = async () => {
      try {
        const response = await axios.get(`/api/get-service-area/${id}`);
        const data = response?.data?.service_area;

        setAreaName(data?.name || "");
        setCity(data?.city || "");
        setState(data?.state || "");
        setCountry(data?.country || "");
        setLatitude(data?.latitude || "");
        setLongitude(data?.longitude || "");
      } catch (error) {
        toast.error("Failed to fetch service area");
        console.error(error);
      }
    };

    if (id) fetchServiceArea();
  }, [id]);

  // 🔎 search from Mapbox
  const getAddress = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      setSearchLoading(true);
      const response = await fetch(`/api/search-address?q=${query}`);
      const result = await response.json();
      setSuggestions(result?.result?.suggestions || []);
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!typingRef.current) return;
    const timer = setTimeout(() => {
      getAddress(areaName);
    }, 800);
    return () => clearTimeout(timer);
  }, [areaName]);

  const handleAreaNameChange = (value) => {
    typingRef.current = true;
    setAreaName(value);
  };

  const handleSelectSuggestion = async (item) => {
    typingRef.current = false;
    setAreaName(item.full_address);
    setSuggestions([]);

    try {
      const res = await fetch(
        `${BASE_MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await res.json();

      const feature = data?.features?.[0];
      if (feature) {
        const coords = feature.geometry.coordinates;
        setLatitude(coords[1]);
        setLongitude(coords[0]);

        const context = feature.properties?.context || {};

        
        setCity(context.place?.name || "");
        setState(context.region?.name || "");
        setCountry(context.country?.name || "");
      }
    } catch (error) {
      console.error("Error retrieving address:", error);
    }
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/api/edit-service-area/${id}`, {
        name: areaName,
        city,
        state,
        country,
        latitude,
        longitude,
      });

      toast.success(response?.data?.message || "Service Area updated");
      router.push("/viewallservices");
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-0 lg:ml-72 mt-6 p-8 max-w-4xl border border-gray-200 relative">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <SectionHead
          icon={<MapPin className="text-black" size={30} />}
          headertext="Edit Service Area"
        />
      </h2>

      <Breadcrumbs
        items={[
          { name: "Home", href: "/panel" },
          { name: "Service Areas", href: "/viewallservices" },
          { name: "Edit Service Area", href: `/edit-service-area/${id}` },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔎 Area Name with Search */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">
            Area Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Downtown"
            value={areaName}
            onChange={(e) => handleAreaNameChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {searchLoading && (
            <Loader2 className="animate-spin w-4 h-4 absolute right-3 top-10 text-gray-500" />
          )}

          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.full_address}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Lat + Lng */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 flex justify-center items-center rounded-lg font-medium "
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <MapPin className="inline mr-2" size={20} />
              Update Service Area
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditServiceAreaPage;
