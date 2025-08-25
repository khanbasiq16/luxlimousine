"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const menuItems = [
    {
      key: "cars",
      title: "Cars",
      subItems: [
        {
          label: "Create Car",
          onClick: () => {
            router.push("/addcar");

            setIsOpen(false);
          },
        },
        {
          label: "View Cars",
          onClick: () => {
            router.push("/viewallcars");
            setIsOpen(false);
          },
        },
      ],
    },
    {
      key: "bookings",
      title: "Bookings",
      onClick: () => {
        router.push("/showallbookings");
        setIsOpen(false);
      },
    },
    {
      key: "services",
      title: "Service Areas",
      subItems: [
        {
          label: "Create Service Area",
          onClick: () => {
            router.push("/addservicearea");
            setIsOpen(false);
          },
        },
        {
          label: "View Service Area",
          onClick: () => {
            router.push("/viewallservices");

            setIsOpen(false);
          },
        },
      ],
    },
  ];

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 shadow-md transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
    >
      <div className="p-5 font-bold text-xl border-b border-gray-200 flex justify-between items-center">
  <img src="/logo.webp" alt="Logo" className="h-20 w-auto" />
  
  {/* Close button for mobile */}
  <button className="lg:hidden" onClick={() => setIsOpen(false)}>
    ✖
  </button>
</div>

      <nav className="mt-4">
        {/* Dashboard */}
        <button
          className="w-full text-left px-5 py-3 hover:bg-gray-100 flex items-center justify-between font-semibold"
          onClick={() => router.push("/panel")}
          type="button"
        >
          Dashboard
        </button>

        {/* Menu Items */}
        {menuItems.map(({ key, title, subItems, onClick }) => (
          <div key={key}>
            {subItems ? (
              <>
                {/* Has subItems => show arrow and toggle */}
                <button
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 flex items-center justify-between font-semibold"
                  onClick={() => toggleMenu(key)}
                  type="button"
                >
                  {title}
                  <span
                    className={`transform transition-transform duration-300 ${
                      openMenus[key] ? "rotate-90" : ""
                    }`}
                  >
                    <ChevronRight size={18} />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openMenus[key] ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <ul className="pl-8 border-l border-gray-300 text-gray-700">
                    {subItems.map(({ label, onClick }, idx) => (
                      <li key={idx}>
                        <button
                          className="block py-2 hover:text-blue-600 w-full text-left"
                          onClick={onClick}
                          type="button"
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              /* No subItems => direct click */
              <button
                className="w-full text-left px-5 py-3 hover:bg-gray-100 font-semibold"
                onClick={onClick}
                type="button"
              >
                {title}
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
