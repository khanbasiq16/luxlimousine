"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Eye, Trash2, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [bulkStatus, setBulkStatus] = useState(""); 

  const itemsPerPage = 10;
  const statusOptions = ["Pending", "Confirmed", "Cancelled"];

  // -----------------------------
  // Fetch bookings from API
  // -----------------------------
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/get-all-bookings"); 
        const data = await res.json();

        if (data.success) {
         
          const mappedBookings = data.bookings.map(b => ({
            id: b.id,
            customerName: b.customer_name,
            car: b.car_name,
            date: b.booking_date,
            status: capitalize(b.booking_status),
            paymentStatus: capitalize(b.payment_status),
          }));

          setBookings(mappedBookings);
        } else {
          toast.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);



  const filteredBookings = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.car.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);


  const toggleSelect = (id) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(currentBookings.map((b) => b.id));
    }
  };

  const deleteSelected = () => {
    setLoading(true);
    setTimeout(() => {
      setBookings((prev) =>
        prev.filter((b) => !selectedBookings.includes(b.id))
      );
      toast.success("Selected bookings deleted");
      setSelectedBookings([]);
      setLoading(false);
    }, 800);
  };

const handleStatusChange = async (bookingId, newStatus) => {
  try {
    const { data } = await axios.post("/api/update-single-booking", {
      bookingId,
      status: newStatus, 
    });

    if (data.success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );

      toast.success(`Status updated to ${newStatus}`);
      setEditingStatusId(null);
    } else {
      toast.error(data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
    toast.error("Server error while updating status");
  }
};


const handleBulkStatusChange = async (status) => {
  if (selectedBookings.length === 0) {
    toast.error("Please select at least one booking");
    return;
  }

  try {
    const { data } = await axios.post("/api/update-bulk-bookings", {
      bookingIds: selectedBookings,
      status, 
    });

    if (data.success) {
  
      setBookings((prev) =>
        prev.map((b) =>
          selectedBookings.includes(b.id) ? { ...b, status } : b
        )
      );

      toast.success(data.message);
      setSelectedBookings([]);
      setBulkStatus("");

    } else {
      toast.error(data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating bulk bookings:", error);
    toast.error("Server error while updating status");
  }
};


  const getStatusBadge = (status, bookingId) => {
    const colors = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    if (editingStatusId === bookingId) {
      return (
        <select
          value={status}
          onChange={(e) => handleStatusChange(bookingId, e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-black transition"
          autoFocus
          onBlur={() => setEditingStatusId(null)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <span
        onClick={() => setEditingStatusId(bookingId)}
        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:scale-105 transform transition ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const colors = {
      Paid: "bg-green-100 text-green-800",
      Unpaid: "bg-red-100 text-red-800",
      Refunded: "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>
    );
  };

 
  return (
  
     <div className="ml-0 lg:ml-72 mt-6 p-8 bg-white rounded-xl border border-gray-100">
    <h2 className="text-3xl font-bold mb-8 text-gray-800">All Bookings</h2>

    {loading ? (
      // Agar loading hai to ye UI dikhe
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <span className="ml-3 text-gray-600 font-medium">Loading bookings...</span>
      </div>
    ) : (
      // Agar loading false hai to pura data UI dikhe
      <>
        {/* Search & Bulk Actions */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="relative flex gap-2">
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
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

            <select
              value={bulkStatus}
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black transition"
            >
              <option value="">Bulk Status</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={deleteSelected}
            disabled={selectedBookings.length === 0}
            className={`px-3 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${
              selectedBookings.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 transition"
            }`}
          >
            <Trash2 size={18} />
            Delete Selected
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 ">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === currentBookings.length &&
                      currentBookings.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Car</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings?.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b hover:bg-gray-50 transition rounded-md "
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(b.id)}
                        onChange={() => toggleSelect(b.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{b.customerName}</td>
                    <td className="p-3">{b.car}</td>
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">{getStatusBadge(b.status, b.id)}</td>
                    <td className="p-3">{getPaymentBadge(b.paymentStatus)}</td>
                    <td className="p-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                        onClick={() => router.push(`/viewbokingdetails/${b.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No bookings found
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
              className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded-lg transition ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>
  );
};

export default Page;
