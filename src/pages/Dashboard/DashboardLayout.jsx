import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/UserDashboard/UserDashAction';
import { fetchInstructorByIdSecure } from '../../redux/Instructor/InstructorAction';
import profile from "./profile.jpg";
import dashboardBg from './dashboardBg.jpg';
import style from './Dash.module.css';
import { AiFillDashboard, AiFillSetting } from "react-icons/ai";
import { FaUser, FaGraduationCap, FaBookmark, FaShoppingCart } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Auth/Authslice';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const role = user?.role;
  const baseUrl = "http://localhost:8080"

  const {
    userProfile
  } = useSelector(state => state.userDashboard);
  const { instructor, loading: instructorLoading } = useSelector((state) => state.instructor);



  useEffect(() => {
    dispatch(fetchUserProfile());
    if (role === 'INSTRUCTOR') {
      dispatch(fetchInstructorByIdSecure(userId));
    }
  }, [dispatch, userId, role]);

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <div className='px-2.5'>
          <div className='max-w-[1410px] mx-auto'>
            {/* Profile Banner */}
            <div className={`h-[450px] ${style.container}`}>
              <div
                style={{ backgroundImage: `url(${dashboardBg})` }}
                className={`h-[220px] relative rounded-sm bg-center bg-no-repeat bg-cover ${style.dashbg}`}
              >
              </div>
              <div className={`relative top-[-80px] flex justify-center items-center flex-col gap-3 z-50 ${style.profile}`}>
                <div
                  style={{ backgroundImage: `url(${userProfile?.profileImage ? `${baseUrl}${userProfile.profileImage}` : profile})` }}
                  className={`h-[160px] w-[160px] bg-center bg-no-repeat bg-cover rounded-full border-8 border-[#fff] p-2.5 ${style.profileDiv}`}
                ></div>

                <h3 className={`font-hind text-[40px] text-[#110c2D] font-bold ${style.profileName}`}>{userProfile?.displayName}</h3>
                {
                  role !== "INSTRUCTOR" ? (
                    <div className={`px-4 py-3.5 rounded-sm text-[17px] font-semibold text-[#553CDF] bg-[#553CDF26] ${style.becomeInstructor}`}>
                      <p>Become an instructor</p>
                    </div>
                  ) : (
                    <div className={`px-4 py-3.5 rounded-sm text-[17px] font-semibold flex flex-col items-center gap-2 justify-center ${style.becomeInstructor2}`}>
                      <div className='flex items-center gap-[4px] ml-2'>
                        {Array.from({ length: 5 }, (_, i) => {
                          const rating = instructor?.averageRating || 0;
                          if (rating >= i + 1) {
                            return <FaStar key={i} className="text-yellow-400 text-[18px]" />;
                          } else if (rating >= i + 0.5) {
                            return <FaStarHalfAlt key={i} className="text-yellow-400 text-[18px]" />;
                          } else {
                            return <FaRegStar key={i} className="text-yellow-400 text-[18px]" />;
                          }
                        })}
                      </div>
                      <div>
                        {instructor?.specialization}
                      </div>
                    </div>
                  )
                }
              </div>
            </div>

            {/* Main Content Area */}
            <div className='flex flex-col md:flex-row'>
              {/* Desktop Sidebar */}
              <div className={`${style.DashdoardLinks} hidden md:block w-full md:w-[33.33%] lg:w-[25%] pr-2.5`}>
                <ul className='p-10 mb-5 border border-[#DDD8F9] rounded-sm'>
                  <NavItem
                    to="/dashboard"
                    icon={<AiFillDashboard className='w-5' />}
                    label="Dashboard"
                    isActive={isActive('/dashboard', true)}
                  />
                  <NavItem
                    to="/dashboard/profile"
                    icon={<FaUser />}
                    label="My Profile"
                    isActive={isActive('/dashboard/profile')}
                  />
                  <NavItem
                    to="/dashboard/courses"
                    icon={<FaGraduationCap />}
                    label="Enrolled Courses"
                    isActive={isActive('/dashboard/courses')}
                  />
                  <NavItem
                    to="/dashboard/wishlist"
                    icon={<FaBookmark />}
                    label="Wishlist"
                    isActive={isActive('/dashboard/wishlist')}
                  />
                  <NavItem
                    to="/dashboard/orders"
                    icon={<FaShoppingCart />}
                    label="Order History"
                    isActive={isActive('/dashboard/orders')}
                  />
                  <NavItem
                    to="/dashboard/setting"
                    icon={<AiFillSetting />}
                    label="Setting"
                    isActive={isActive('/dashboard/setting')}
                  />
                  <li onClick={handleLogout} className='flex items-center gap-3 text-[#737477] py-[18px] cursor-pointer'>
                    <IoIosLogOut className='w-5' />
                    <span className='ml-3 text-[17px]'>Logout</span>
                  </li>
                </ul>
              </div>

              {/* Mobile Menu */}
              <div className={`${style.DashdoardLinks} md:hidden overflow-hidden transition-all duration-300 ease-in-out ${showMenu ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className='p-10 mb-5 border border-[#DDD8F9] rounded-sm'>
                  <MobileNavItem
                    to="/dashboard"
                    icon={<AiFillDashboard />}
                    label="Dashboard"
                    onClick={() => setShowMenu(false)}
                  />
                  <MobileNavItem
                    to="/dashboard/profile"
                    icon={<FaUser />}
                    label="My Profile"
                    isActive={isActive('profile')}
                  />
                  <MobileNavItem
                    to="/dashboard/courses"
                    icon={<FaGraduationCap />}
                    label="Enrolled Courses"
                    isActive={isActive('courses')}
                  />
                  <MobileNavItem
                    to="/dashboard/wishlist"
                    icon={<FaBookmark />}
                    label="Wishlist"
                    isActive={isActive('wishlist')}
                  />
                  <MobileNavItem
                    to="/dashboard/orders"
                    icon={<FaShoppingCart />}
                    label="Order History"
                    isActive={isActive('orders')}
                  />
                  <MobileNavItem
                    to="/dashboard/setting"
                    icon={<AiFillSetting />}
                    label="Setting"
                    isActive={isActive('setting')}
                  />
                  <li onClick={handleLogout} className='flex items-center gap-3 text-[#737477] py-[18px] cursor-pointer'>
                    <IoIosLogOut className='w-5' />
                    <span className='ml-3 text-[17px]'>Logout</span>
                  </li>
                </ul>
              </div>

              {/* Content Area */}
              <div className={`w-full md:w-[66.67%] ${style.outluck} `}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Menu */}
        <div className='shadow-2xl shadow-black/50 bg-white p-2.5 fixed left-0 right-0 bottom-0 md:hidden z-[999]'>
          <div className='flex justify-center items-center'>
            <BottomNavItem
              icon={<AiFillDashboard />}
              label="Dashboard"
            // onClick={() => navigate('/dashboard')}
            />
            <BottomNavItem
              icon={<FaUser />}
              label="Profile"
            // onClick={() => navigate('/dashboard/profile')}
            />
            <BottomNavItem
              icon={<CiMenuBurger />}
              label="Menu"
              onClick={() => setShowMenu(!showMenu)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, isActive }) => (
  <li className={`flex items-center gap-3 py-[18px] border-b border-b-[#DDF8F9] cursor-pointer ${isActive ? 'text-[#553CDF]' : 'text-[#737477]'}`}>
    <Link to={to} className="flex items-center w-full">
      {icon}
      <span className='ml-3 text-[17px]'>{label}</span>
    </Link>
  </li>
);

const MobileNavItem = ({ to, icon, label, onClick }) => (
  <li className='flex items-center gap-3 text-[#737477] py-[18px] border-b border-b-[#DDF8F9] cursor-pointer'>
    <Link to={to} className="flex items-center w-full" onClick={onClick}>
      {icon}
      <span className='ml-3 text-[17px]'>{label}</span>
    </Link>
  </li>
);

const BottomNavItem = ({ icon, label, onClick }) => (
  <div
    className='w-[33.33%] flex flex-col items-center gap-1 py-1 cursor-pointer'
    onClick={onClick}
  >
    <div className="text-[20px]">{icon}</div>
    <span className='text-xs text-[#757C8E]'>{label}</span>
  </div>
);

export default DashboardLayout;