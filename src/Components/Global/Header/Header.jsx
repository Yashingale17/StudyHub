import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaRegEnvelope, FaMapMarkerAlt, FaChevronDown, FaTimes } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { LiaAngleDownSolid } from "react-icons/lia";
import { logout } from '../../../redux/Auth/Authslice';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import logo from "./logo-1.svg";
import menuIcon from "./Menu-icon.svg";
import business from "./buss.svg";
import Design from "./art.svg";
import Music from "./music.svg";
import DanceMark from "./Dance.svg";
import Account from "./Acc.svg";
import style from "./head.module.css";
import { fetchCourses } from '../../../redux/Users/UserActions/UserAction';



const Header = ({ onFilterChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navRef = useRef(null);
const cartCount = useSelector((state) => state.cart.items?.length) || 0;


  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const adminStatus = userData?.role === "ADMIN";
    setIsAdmin(adminStatus);
  }, [isAuthenticated]);

  const navItems = [
    { label: 'Home', path: '/', dropdown: false },
    {
      label: 'Pages',
      dropdown: true,
      submenu: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact Us', path: '/contact' }
      ]
    },
    {
      label: 'Courses',
      dropdown: true,
      submenu: {
        'Courses': [{ label: 'Courses', path: '/courses' }],
        'Instructor': [
          { label: 'Instructor', path: '/instructors' },
          { label: "Instructor-Pannel", path: "/instructor-pannel" }
        ],
        'Others': [
          { label: 'Login', path: '/login' },
          { label: 'Register', path: '/register' }
        ]
      }
    },
    { label: 'Dashboard', path: '/dashboard', dropdown: false },
    { label: 'Blog', path: '/blog', dropdown: false },
    ...(isAdmin ? [
      {
        label: 'Admin',
        path: '/admin/dashboard',
        dropdown: false,
        adminOnly: true
      }
    ] : [])
  ];

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);


  const { courses = [], allCourses = [] } = useSelector((state) => state.userData || {});

  console.log(courses)
  console.log(allCourses)

  const categoryList = [
    { id: 1, label: 'Music', icon: Music, apiValue: 'Music' },
    { id: 3, label: 'Accounting', icon: Account, apiValue: 'Accounting' },
    { id: 4, label: 'Business', icon: business, apiValue: 'Business' },
    { id: 5, label: 'Dance', icon: DanceMark, apiValue: 'Dance' },
    { id: 7, label: 'Marketing', icon: DanceMark, apiValue: 'Marketing' },
    { id: 8, label: 'Design & Arts', icon: Design, apiValue: 'Design and Art' },
  ];

  const categoryCounts = React.useMemo(() => {
    const counts = {};

    categoryList.forEach(item => {
      counts[item.id] = 0;
    });

    allCourses.forEach(course => {
      const matchedCategory = categoryList.find(
        cat => course.categoryName?.toLowerCase() === cat.apiValue.toLowerCase()
      );

      if (matchedCategory) {
        counts[matchedCategory.id]++;
      }
    });

    return counts;
  }, [allCourses]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  React.useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <div className='fixed top-0 left-0 right-0 z-[999]'>
      {/* Topbar */}
      <div className='px-7 bg-dark-blue hidden md:block'>
        <div className='py-1 lg:mx-6.5 mx-0 text-white flex justify-between'>
          <div className='flex items-center gap-7.5'>
            <div className='flex items-center gap-1'>
              <FaRegEnvelope />
              <span className='font-inter text-sm leading-loose'>info@studyhub.com</span>
            </div>
            <div className='flex items-center gap-1 leading-loose'>
              <FiPhone />
              <span className='font-inter text-sm'>+61 012 012 445</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <FaMapMarkerAlt />
            <span className="font-inter text-sm leading-loose">684 West College St. Sun City, USA</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className={`bg-[#FFFFFF] ${style.customeShadow}`}>
        <div className={`flex px-7 mx-0 lg:mx-6.5 items-center ${style.navBar}`}>
          <div className='flex items-center gap-16.5 w-full md:w-[20%] xl:w-auto mx-md:w-1/2'>
            <div className="w-32 md:w-36 lg:w-34 flex-shrink-0">
              <img src={logo} className="w-full cursor-pointer" alt="StudyHub" onClick={() => navigate('/')} />
            </div>
            <div
              className="py-5 relative"
              ref={categoryRef}
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <div
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className='hidden xl:flex items-center txt-color py-1.5 px-4 border cursor-pointer rounded-sm menu-border gap-2.5 light-bg'
              >
                <img src={menuIcon} alt="menu" />
                <span className='txt-color text-lg font-inter font-medium'>Category</span>
                <LiaAngleDownSolid />
              </div>

              <div
                className={`absolute top-full min-w-[410px] left-0 mt-[-1px] grid grid-cols-2 bg-white rounded-md shadow-lg px-2.5 py-4 z-50 transition-all duration-500 ease-in-out
      ${isCategoryOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-y-[-10px]'}`}
              >
                {categoryList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onFilterChange) {
                        onFilterChange({
                          category: [item.id],
                          tags: [],
                          level: [],
                          price: [],
                        });
                      }
                      navigate(`/courses?category=${item.id}`, { replace: true });
                      setIsCategoryOpen(false);
                    }}
                    className="flex items-center p-3 mx-2.5 my-0.5 hover:bg-gray-100 rounded gap-3 cursor-pointer"
                  >
                    <img src={item.icon} alt={item.label} className="w-[50px] h-[50px]" />
                    <div className='flex flex-col'>
                      <span className="text-[16px] font-inter font-medium">{item.label}</span>
                      <span className='text-[14px] font-inter font-normal text-gray-500'>
                        {categoryCounts[item.id] || 0} courses
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div
            ref={navRef}
            onClickCapture={() => setOpenDropdown(null)}
            className="hidden lg:flex justify-center w-full md:w-[65%] xl:w-[43%]"
          >
            <nav className="flex justify-center items-center py-7 w-full font-inter text-[16px]">
              {navItems.map(({ label, path, dropdown, submenu }) => (
                <div
                  key={label}
                  className="relative group"
                  onMouseEnter={() => dropdown && setOpenDropdown(label)}
                  onMouseLeave={() => dropdown && setOpenDropdown(null)}
                  onClick={() => dropdown && setOpenDropdown(openDropdown === label ? null : label)}
                >
                  <NavLink
                    to={path || "#"}
                    onClick={(e) => {
                      if (dropdown) {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === label ? null : label);
                      }
                    }}
                    className={`flex items-center gap-1 px-4 ${(path && location.pathname === path) ||
                      (dropdown && Array.isArray(submenu) &&
                        submenu.some((sub) => sub.path === location.pathname))
                      ? "text-[#553CDF] font-semibold"
                      : "text-black hover:text-[#553CDF]"
                      }`}
                  >
                    {label}
                    {dropdown && <MdKeyboardArrowDown />}
                  </NavLink>

                  {/* Big Dropdown */}
                  {dropdown && submenu && !Array.isArray(submenu) && (
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-[28px] bg-white border border-gray-200 rounded-sm shadow-lg z-50
                        ${openDropdown === label ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-6px] opacity-0 invisible'} 
                        transition-all duration-500 ease-in-out`}
                    >
                      <div className="grid grid-cols-3 gap-10 px-6 py-4 w-[700px] xl:w-[1000px]">
                        {Object.entries(submenu).map(([sectionTitle, items]) => (
                          <div key={sectionTitle}>
                            <h4 className="text-[#553CDF] text-lg font-semibold border-b pb-1 mb-2">{sectionTitle}</h4>
                            <ul className="space-y-2">
                              {items.map((item, idx) => (
                                <li key={idx}>
                                  <NavLink
                                    to={item.path}
                                    className="block text-[16px] font-inter text-gray-800 hover:text-[#553CDF] transition-colors"
                                  >
                                    {item.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dropdown && Array.isArray(submenu) && (
                    <div className={`absolute left-0 top-full w-44 mt-[28px] p-2 bg-white shadow-lg border border-gray-200 rounded-sm z-50
                      ${openDropdown === label ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-6px] opacity-0 invisible'} 
                      transition-all duration-500 ease-in-out`}
                    >
                      <ul className="flex flex-col font-inter text-[14px] text-black">
                        {submenu.map((subItem, idx) => (
                          <li key={idx}>
                            <NavLink
                              to={subItem.path}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-5 text-[16px] py-2 rounded-sm hover:text-[#553CDF] hover:bg-[#BBB1F2] transition-all ease-in-out duration-500"
                            >
                              {subItem.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile Burger Icon */}
          <div className='lg:hidden flex w-full max-md:w-1/2 justify-end'>
            <IoMdMenu
              className='text-3xl cursor-pointer'
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>

          {/* Auth + Search */}
          <div className='hidden lg:flex w-full txt-color md:w-[31%]'>
            <div className='w-full flex justify-end items-center'>
              <div className='border-r-2 pr-2.5'>
                <CiSearch className='w-6 h-6 drop-shadow-2xl cursor-pointer' />
              </div>
              <div className='relative pl-2.5 mr-7.5'>
                <IoCartOutline className='w-7 h-7 drop-shadow-2xl cursor-pointer' />
                {cartCount > 0 && (
                  <div className='absolute bottom-3 left-6'>
                    <span className='bg-dark-blue px-1.5 text-white py-0 rounded-full text-xs'>
                      {cartCount}
                    </span>
                  </div>
                )}
              </div>

              <div className='hidden xl:flex gap-x-2.5 font-inter'>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className='border rounded-sm px-5 py-1.5 cursor-pointer login-hover'
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className='border rounded-sm px-5 py-1.5 bg-dark-blue text-white cursor-pointer register-hover'
                    >
                      Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className='border rounded-sm px-5 py-1.5 login-hover cursor-pointer'
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className='border rounded-sm px-5 py-1.5 bg-dark-blue text-white cursor-pointer register-hover'
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <FaTimes
            className='text-xl cursor-pointer txt-color'
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
        <nav className='flex flex-col gap-4 p-4'>
          {navItems.map(({ label, path, dropdown, submenu }) => (
            <div key={label} className="flex flex-col">
              <div
                className="flex justify-between items-center py-2 border-b border-gray-100 text-black hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  if (dropdown && submenu) {
                    setOpenDropdown(openDropdown === label ? null : label);
                  } else {
                    setMobileMenuOpen(false);
                    navigate(path);
                  }
                }}
              >
                <span>{label}</span>
                {dropdown && (
                  <FaChevronDown
                    className={`text-xs transition-transform ${openDropdown === label ? "rotate-180" : ""}`}
                  />
                )}
              </div>
              {dropdown && submenu && openDropdown === label && (
                <div className="flex flex-col bg-white px-4 border-x border-x-gray-300 ml-2">
                  {Array.isArray(submenu)
                    ? submenu.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.path}
                        className="py-2 text-[16px] text-gray-800 hover:text-blue-600 font-inter border-b border-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </NavLink>
                    ))
                    : Object.entries(submenu).map(([sectionTitle, items]) => (
                      <div key={sectionTitle}>
                        <h4 className="text-[17px] font-semibold text-[#553CDF] mt-2 mb-1">{sectionTitle}</h4>
                        {items.map((subItem) => (
                          <div key={subItem.label} className="mb-2">
                            <NavLink
                              to={subItem.path}
                              className="block text-[16px] text-gray-800 hover:text-blue-600 font-inter transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
          {isAdmin && (
            <div className="flex flex-col">
              <NavLink
                to="/admin/dashboard"
                className="flex justify-between items-center py-2 border-b border-gray-100 text-black hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;