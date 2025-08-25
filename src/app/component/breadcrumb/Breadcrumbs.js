"use client"
import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center">
          {idx !== 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
          {idx === items.length - 1 ? (
            <span className="text-gray-800 font-medium">{item.name}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
