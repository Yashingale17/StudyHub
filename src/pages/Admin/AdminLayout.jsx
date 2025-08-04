// src/pages/Admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-64 h-full">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="relative w-64 h-full bg-white shadow-lg transform animate-slideIn transition-transform duration-300 ease-out">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 right-3 text-gray-500 hover:text-gray-800 transition-colors md:hidden"
            >
              <X size={24} className="text-red-600" />
            </button>
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-black transition-all"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Routed Admin Page */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
