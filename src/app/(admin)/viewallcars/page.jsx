"use client";
import Breadcrumbs from "@/app/component/breadcrumb/Breadcrumbs";
import SectionHead from "@/app/component/breadcrumb/SectionHead";
  import { fetchCarsStart } from "@/store/Slices/CarSlice";
import axios from "axios";
import { Car, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const { carlist } = useSelector((state) => state.Car);
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    const getAllCars = async () => {
      try {
        const response = await axios.get("/api/get-all-cars");
        if (response.data.success) {
          dispatch(fetchCarsStart(response.data.data));
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };

    getAllCars();
  }, [dispatch]);

  const [selectedCars, setSelectedCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setloading] = useState(false);
  const itemsPerPage = 10;

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    image: true,
    baseFare: true,
    farePerKm: true,
    actions: true,
  });

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredCars = carlist?.filter((car) =>
    car?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCars?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars?.slice(indexOfFirstItem, indexOfLastItem);

  const toggleSelect = (id) => {
    setSelectedCars((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCars.length === currentCars.length) {
      setSelectedCars([]);
    } else {
      setSelectedCars(currentCars.map((car) => car.id));
    }
  };

  const deleteSelected = async () => {
  try {
    setloading(true);

    await axios.post("/api/bulk-delete-cars", {
      ids: selectedCars,  
    });

    toast.success("Selected cars deleted successfully");

    const updatedList = carlist.filter(
      (car) => !selectedCars.includes(car.id)
    );
    dispatch(fetchCarsStart(updatedList));

    setSelectedCars([]);
  } catch (error) {
    console.error("Error deleting cars:", error);
    toast.error("Failed to delete cars");
  } finally {
    setloading(false);
  }
};

  const deletecar = async (id) => { 
    try {
      const response = await axios.delete(`/api/delete-car/${id}`);
      if (response.data.success) {
        const updated = await axios.get("/api/get-all-cars");
      dispatch(fetchCarsStart(updated?.data?.data)); 
        toast.success("Car deleted successfully");
      } else {
        console.error("Error deleting car:", response.data.message);
        toast.error(response.data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car");
    }
  }

  return (
    <div className="ml-0 lg:ml-72 mt-6 p-8 bg-white rounded-xl relative border border-gray-100">
        <button
            onClick={() => router.push("/addcar")}
            className="px-4 py-2 absolute right-10 top-10 bg-black text-white rounded-lg hover:bg-black transition"
          >
            Add New Car
          </button>
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <SectionHead
          icon={<Car className="text-black" size={30} />}
          headertext="View Cars"
        />


      </h2>
        

         <Breadcrumbs
        items={[
          { name: "Home", href: "/panel" },
          { name: "Cars", href: "/viewallcars" },
         
        ]}
      />

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search cars..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}

            />

          
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* Column Filter */}
        <div className="flex items-center gap-2">

            <button
          onClick={deleteSelected}
          disabled={selectedCars?.length === 0}

          className={`px-2 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
            selectedCars?.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
         {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 size={18} /> } 
        </button>

        <select
          onChange={(e) => toggleColumn(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Toggle Column</option>
          <option value="title">Car Name</option>
          <option value="image">Image</option>
          <option value="baseFare">Base Fare</option>
          <option value="farePerKm">Fare / Km</option>
          <option value="actions">Actions</option>
        </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedCars?.length === currentCars?.length &&
                    currentCars?.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.title && (
                <th className="p-3 text-left">Car Name</th>
              )}
              {visibleColumns.image && <th className="p-3 text-left">Image</th>}
              {visibleColumns.baseFare && (
                <th className="p-3 text-left">Base Fare</th>
              )}
              {visibleColumns.farePerKm && (
                <th className="p-3 text-left">Fare / Km</th>
              )}
              {visibleColumns.actions && (
                <th className="p-3 text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentCars?.length > 0 ? (
              currentCars?.map((car) => (
                <tr
                  key={car.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(car.id)}
                      onChange={() => toggleSelect(car.id)}
                    />
                  </td>
                  {visibleColumns.title && (
                    <td className="p-3 font-medium">{car.title}</td>
                  )}
                  {visibleColumns.image && (
                    <td className="p-3">
                      <img
                        src={car.car_image}
                        alt={car.title}
                        className="w-14 h-14 object-contain rounded-lg border"
                      />
                    </td>
                  )}
                  {visibleColumns.baseFare && (
                    <td className="p-3">${Number(car.base_fare).toFixed(2)}</td>
                  )}
                  {visibleColumns.farePerKm && (
                    <td className="p-3">
                      ${Number(car.fare_per_kilometer).toFixed(2)}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className=" ">
                      <button  className="text-blue-600 hover:text-blue-800"
                       onClick={() => router.push(`/editcar/${car.id}`)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 ml-2 hover:text-red-800"
                        onClick={() => deletecar([car.id])}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded-lg ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
