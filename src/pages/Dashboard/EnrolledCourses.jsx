import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEnrollments } from '../../redux/UserDashboard/UserDashAction';
import CourseCard from '../../Components/CourseCard/CourseCard';
import Loader from '../../Components/Loader/Loader';
import style from "../Courses/CoursesPage/coursesStyle.module.css";
import { FiPlus, FiMinus } from "react-icons/fi";

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const { enrollments, loading } = useSelector(state => state.userDashboard);

  const enrolled = enrollments?.enrolled || [];
  const active = enrollments?.active || [];
  const completed = enrollments?.completed || [];

  const [activeTab, setActiveTab] = useState('enrolled');
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchUserEnrollments());
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const getCourses = () => {
    switch (activeTab) {
      case 'enrolled':
        return enrolled;
      case 'active':
        return active;
      case 'completed':
        return completed;
      default:
        return [];
    }
  };

  const getHeadingText = () => {
    switch (activeTab) {
      case 'enrolled':
        return 'Enrolled Courses';
      case 'active':
        return 'Active Courses';
      case 'completed':
        return 'Completed Courses';
      default:
        return 'Enrolled Courses';
    }
  };

  const courses = getCourses();

  const toggleMobileMenu = () => {
    setMobileExpanded(!mobileExpanded);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setMobileExpanded(false);
    }
  };

  return (
    <div className="bg-white p-4 lg:p-5 rounded-lg shadow-sm mb-20">
      <h2 className="text-2xl font-bold mb-6 text-[#110C2D]">
        {getHeadingText()}
      </h2>
      
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-gray-200 mb-6">
        <button
          className={`mr-6 pb-2 font-medium border-b-2 transition-all ${
            activeTab === 'enrolled' ? 'text-[#553CDF] border-[#553CDF]' : 'text-gray-600 border-transparent'
          }`}
          onClick={() => handleTabChange('enrolled')}
        >
          Enrolled Courses ({enrolled.length})
        </button>
        <button
          className={`mr-6 pb-2 font-medium border-b-2 transition-all ${
            activeTab === 'active' ? 'text-[#553CDF] border-[#553CDF]' : 'text-gray-600 border-transparent'
          }`}
          onClick={() => handleTabChange('active')}
        >
          Active Courses ({active.length})
        </button>
        <button
          className={`pb-2 font-medium border-b-2 transition-all ${
            activeTab === 'completed' ? 'text-[#553CDF] border-[#553CDF]' : 'text-gray-600 border-transparent'
          }`}
          onClick={() => handleTabChange('completed')}
        >
          Completed Courses ({completed.length})
        </button>
      </div>

      {/* Mobile Accordion Tabs */}
      <div className="md:hidden mb-6">
        <div 
          className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg cursor-pointer"
          onClick={toggleMobileMenu}
        >
          <span className="font-medium">
            {getHeadingText()} (
            {activeTab === 'enrolled' && enrolled.length}
            {activeTab === 'active' && active.length}
            {activeTab === 'completed' && completed.length}
            )
          </span>
          {mobileExpanded ? <FiMinus /> : <FiPlus />}
        </div>
        
        {mobileExpanded && (
          <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className={`p-3 cursor-pointer ${
                activeTab === 'enrolled' ? 'bg-[#553CDF]/10 text-[#553CDF]' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('enrolled')}
            >
              Enrolled Courses ({enrolled.length})
            </div>
            <div 
              className={`p-3 cursor-pointer ${
                activeTab === 'active' ? 'bg-[#553CDF]/10 text-[#553CDF]' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('active')}
            >
              Active Courses ({active.length})
            </div>
            <div 
              className={`p-3 cursor-pointer ${
                activeTab === 'completed' ? 'bg-[#553CDF]/10 text-[#553CDF]' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('completed')}
            >
              Completed Courses ({completed.length})
            </div>
          </div>
        )}
      </div>

      {/* Loader */}
      {loading && <Loader />}

      {/* Courses */}
      <div className="flex flex-wrap -mx-[13.5px]">
        {!loading && courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className={`w-full mb-[25px] sm:w-1/2 ${style.CourseBox}`}>
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-gray-500 col-span-full">
              No courses found
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;