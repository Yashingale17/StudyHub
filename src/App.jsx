import React from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import {
  Routes,
  BrowserRouter,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


import Home from "./pages/Home/Home";
import Header from "./Components/Global/Header/Header";
import Footer from "./Components/Global/Footer/Footer";
import Login from "./Components/Login/Login";
import Register from "./pages/Register/Register";
import ScrollToTop from "./Components/ScroleTop/ScroleTop";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import AddInstructor from "./pages/Admin/Instructor/AddInstructor";
import Instructors from "./pages/Admin/Instructor/Instructors";
import Courses from "./pages/Admin/Courses/Courses";
import AddCourses from "./pages/Admin/Courses/AddCourses";
import ContactUs from "./pages/Contact/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import CoursePage from "./pages/Courses/CoursesPage/CoursePage";
import Instructorss from "./pages/Instructor/AllInstructors/Instructors";
import InstructorInfo from "./pages/Instructor/InstructorInfo/InstructorInfo";
import Blog from "./Components/Blog";
import CourseDetail from "./pages/Courses/CourseDetail/CourseDetail";
import CourseContentPage from "./pages/Courses/CourseContent/CourseContentPage";
import CheckOut from "./pages/CheckOut/CheckOut";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/Auth/Authslice";
import Cart from "./pages/Cart/Cart";
import Profile from "./pages/Dashboard/Profile";
import EnrolledCourses from "./pages/Dashboard/EnrolledCourses";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ProtectedRoute from "./Components/Protected/ProtectedRoute";
import Loader from "./Components/Loader/Loader";
import Wishlist from "./pages/Dashboard/Wishlist";
import Setting from "./pages/Dashboard/Setting";
import InstructorPannel from "./pages/InstructorPanel/InstructorPannel";
import Unauthorized from "./Components/Unauthorized/Unauthorized";
import { Navigate } from 'react-router-dom';
import NotFound from "./Components/PageNotFound/NotFound";
import UsersPage from "./pages/Admin/Users/UserPage";
import AddContent from "./pages/Admin/CourseContent/AddContent";
import CourseContentTable from "./pages/Admin/Courses/CourseContentTable";
import OrderHistery from "./pages/Dashboard/OrderHistery";

const AppWrapper = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [authInitialized, setAuthInitialized] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
    setAuthInitialized(true);
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCourseContentPage = location.pathname.includes("/content/");
  const isUserDashboard = location.pathname.includes("/dashboard")

  if (!authInitialized) {
    return <Loader />
  }

  return (
    <>
      <ScrollToTop />
      <ToastContainer />

      {!isAdminRoute && !isCourseContentPage && <Header />}

      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course/:courseId/content/:lessonId" element={<CourseContentPage />} />
        <Route path="/instructors" element={<Instructorss />} />
        <Route path="/instructor-info/:id" element={<InstructorInfo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="checkOut" element={<CheckOut />} />
        <Route path="/instructor-pannel" element={user?.role === 'INSTRUCTOR' && user?.role === "ADMIN" ? <InstructorPannel /> : <Navigate to="/unauthorized" />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<EnrolledCourses />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="setting" element={<Setting />} />
            <Route path="orders" element={<OrderHistery/>} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/add" element={<AddInstructor />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/add" element={<AddCourses />} />
          <Route path="addContent" element={<AddContent/>}/>
          <Route path="users" element={<UsersPage/>} />
          <Route path="content" element={<CourseContentTable/>} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && !isCourseContentPage && !isUserDashboard && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
