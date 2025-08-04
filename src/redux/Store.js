import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/Authslice";
import dashboardReducre from "./Admin/DashboardSlice"
import courseReducer from "./Courses/CourseSlice"
import categoryReducer from "./Users/UserSlice";
import userReducer from "./Users/UserSlice";
import instructorReducer from './Instructor/InstructorSlice';
import userEnrollmentsReducer from "./Enrollment/EnrollmentSlice"
import cartReducer from "./Enrollment/CartSlice"
import userDashboardReducer from "./UserDashboard/UserDashSlice";
import wishlistReducer from './UserDashboard/WishlistSlice';
import instructorCourseReducer from './InstructorPannel/InstructorPannelSlice';
import userManagementAdmin from './Admin/Users/UserActionSlice'
import adminCourseContentReducer from '../redux/Admin/CourseContent/CourseContentSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    adminDashboard: dashboardReducre,
    course: courseReducer,
    Categories: categoryReducer,
    userData: userReducer,
    instructor: instructorReducer,
    enrollment: userEnrollmentsReducer,
    cart: cartReducer,
    userDashboard: userDashboardReducer,
    wishlist: wishlistReducer,
    instructorCourse: instructorCourseReducer,
    userManagementA : userManagementAdmin ,
    admincoursecontent: adminCourseContentReducer,
  },
});

export default store;
