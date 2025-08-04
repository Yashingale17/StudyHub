// src/components/Admin/Sidebar.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart,
  LogOut,
  User,
  UserCheck,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ListOrdered,
} from "lucide-react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import DashboardLinkItems from "../../Components/DashboardLinkItems";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Auth/Authslice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showInstructorsSubMenu, setShowInstructorsSubMenu] = useState(
    location.pathname.startsWith("/admin/instructors")
  );
  const [showCoursesSubMenu, setShowCoursesSubMenu] = useState(
    location.pathname.startsWith("/admin/courses")
  );

    const handleLogout = () => {
    dispatch(logout());                 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };


  // Admin name
  let adminName = "Admin";
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.userName) {
      adminName = userData.userName;
    }
  } catch (e) {
    console.error("Invalid user data in localStorage");
  }

  return (
    <div className="bg-white shadow-md w-full p-4 flex flex-col h-full">
      {/* Branding */}
      <div className="text-2xl font-bold text-blue-600 mb-8">StudyHub Admin</div>

      {/* Admin Info */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 mb-6 shadow-sm">
        <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
          <User size={20} />
        </div>
        <div className="leading-snug">
          <p className="text-sm text-gray-400">Welcome back</p>
          <p className="text-[18px] font-medium text-blue-800">{adminName}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <DashboardLinkItems to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <DashboardLinkItems to="/admin/users" icon={<Users />} label="Users" />

        {/* Instructors Dropdown */}
        <button
          onClick={() => setShowInstructorsSubMenu(!showInstructorsSubMenu)}
          className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md ${location.pathname.startsWith("/admin/instructors")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <div className="flex items-center gap-3">
            <UserCheck />
            Instructors
          </div>
          {showInstructorsSubMenu ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {showInstructorsSubMenu && (
          <div className="pl-10 flex flex-col gap-2 text-sm">
            <NavLink
              to="/admin/instructors/add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <PlusCircle size={16} />
              Add Instructor
            </NavLink>

            <NavLink
              to="/admin/instructors"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ListOrdered size={16} />
              See All Instructors
            </NavLink>
          </div>
        )}


        <button
          onClick={() => setShowCoursesSubMenu(!showCoursesSubMenu)}
          className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md ${location.pathname.startsWith("/admin/courses")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen />
            Courses
          </div>
          {showCoursesSubMenu ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {showCoursesSubMenu && (
          <div className="pl-10 flex flex-col gap-2 text-sm">
            <NavLink
              to="/admin/courses/add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <PlusCircle size={16} />
              Add Course
            </NavLink>

            <NavLink
              to="/admin/courses"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ListOrdered size={16} />
              See All Courses
            </NavLink>

            <NavLink
              to="/admin/addContent"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <PlusCircle size={16} />
              Add Course Content
            </NavLink>


            <NavLink
              to="/admin/content"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ListOrdered size={16} />
              Course Content
            </NavLink>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div onClick={handleLogout} className="absolute bottom-6 w-56">
        <button className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
