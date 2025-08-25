"use client";
import Breadcrumbs from "@/app/component/breadcrumb/Breadcrumbs";
import SectionHead from "@/app/component/breadcrumb/SectionHead";
import axios from "axios";
import { MapPin, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [serviceList, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    city: true,
    state: true,
    country: true,
    latitude: true,
    longitude: true,
    actions: true,
  });

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const response = await axios.get("/api/get-service-areas");
        if (response.data.success) {
          setServiceList(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    getAllServices();
  }, []);

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredServices = serviceList?.filter((s) =>
    s?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const toggleSelect = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedServices.length === currentServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(currentServices.map((s) => s.id));
    }
  };

  const deleteSelected = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedServices.map((id) => axios.delete(`/api/delete-service-area/${id}`))
      );
      toast.success("Selected services deleted successfully");
      const updatedList = serviceList.filter(
        (s) => !selectedServices.includes(s.id)
      );
      setServiceList(updatedList);
      setSelectedServices([]);
    } catch (error) {
      console.error("Error deleting services:", error);
      toast.error("Failed to delete services");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await axios.delete(`/api/delete-service-area/${id}`);
      if (response.data.success) {
        const updated = await axios.get("/api/get-service-areas");
        setServiceList(updated?.data?.data);
        toast.success("Service deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="ml-0 lg:ml-72 mt-6 p-8 bg-white rounded-xl relative border border-gray-100">
      <button
        onClick={() => router.push("/addservicearea")}
        className="px-4 py-2 absolute right-10 top-10 bg-black text-white rounded-lg hover:bg-black transition"
      >
        Add New Service Area
      </button>

      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <SectionHead
          icon={<MapPin className="text-black" size={30} />}
          headertext="View Service Areas"
        />
      </h2>

      <Breadcrumbs
        items={[
          { name: "Home", href: "/panel" },
          { name: "Service Areas", href: "/viewallservices" },
        ]}
      />

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
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
            disabled={selectedServices?.length === 0}
            className={`px-2 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
              selectedServices?.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>

          <select
            onChange={(e) => toggleColumn(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Toggle Column</option>
            <option value="name">Area Name</option>
            <option value="city">City</option>
            <option value="state">State</option>
            <option value="country">Country</option>
            <option value="latitude">Latitude</option>
            <option value="longitude">Longitude</option>
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
                    selectedServices?.length === currentServices?.length &&
                    currentServices?.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.name && <th className="p-3 text-left">Area Name</th>}
              {visibleColumns.city && <th className="p-3 text-left">City</th>}
              {visibleColumns.state && <th className="p-3 text-left">State</th>}
              {visibleColumns.country && (
                <th className="p-3 text-left">Country</th>
              )}
              {visibleColumns.latitude && (
                <th className="p-3 text-left">Latitude</th>
              )}
              {visibleColumns.longitude && (
                <th className="p-3 text-left">Longitude</th>
              )}
              {visibleColumns.actions && (
                <th className="p-3 text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentServices?.length > 0 ? (
              currentServices?.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  {visibleColumns.name && (
                    <td className="p-3 font-medium">{s.name}</td>
                  )}
                  {visibleColumns.city && <td className="p-3">{s.city}</td>}
                  {visibleColumns.state && <td className="p-3">{s.state}</td>}
                  {visibleColumns.country && <td className="p-3">{s.country}</td>}
                  {visibleColumns.latitude && <td className="p-3">{s.latitude}</td>}
                  {visibleColumns.longitude && <td className="p-3">{s.longitude}</td>}
                  {visibleColumns.actions && (
                    <td className="">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => router.push(`/editservice/${s.id}`)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 ml-2 hover:text-red-800"
                        onClick={() => deleteService(s.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No services found
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
