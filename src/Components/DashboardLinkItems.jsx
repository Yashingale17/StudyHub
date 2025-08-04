// src/components/Admin/DashboardLinkItems.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const DashboardLinkItems = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
          isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default DashboardLinkItems;
