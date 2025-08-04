import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { fetchCourseById, getAllCourses } from '../../../redux/Courses/CourseAction';
import { useDispatch, useSelector } from 'react-redux';
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { LuNotebookPen, LuChartBarDecreasing } from "react-icons/lu";
import { LiaGraduationCapSolid } from "react-icons/lia";
import { CiClock2 } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaPlay,
  FaVolumeUp,
  FaCog,
  FaExpand,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from "react-toastify";
import { GoDeviceCameraVideo } from "react-icons/go";
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import CourseCard from '../../../Components/CourseCard/CourseCard';
import { MdCheck } from "react-icons/md";
import { FaPlus, FaMinus, FaLock } from "react-icons/fa";
import CourseDetailBg from "./CourseDetailBg.jpg";
import style from './Detail.module.css';
import Loader from "../../../Components/Loader/Loader";
import { Clock1, GraduationCap } from 'lucide-react';
import bulb from "../../Home/bulb.png"
import { fetchUserEnrollments } from '../../../redux/Enrollment/EnrollmentAction';
import { fetchUserCart } from '../../../redux/Enrollment/CartAction';

const BASE_URL = "http://localhost:8080";

const CourseDetail = () => {
  // Hooks and state management
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseDetail, courses, loading, error } = useSelector((state) => state.course);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState('150px');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);


  const contentRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const cartItems = useSelector(state => state.cart.items);
  const { userEnrollments } = useSelector((state) => state.enrollment);

  const isEnrolled = userEnrollments.some(
    (enrollment) => enrollment.courseId === courseDetail?.id
  );

  // Find the enrollment date if enrolled
  const enrollmentDate = isEnrolled
    ? userEnrollments.find((enrollment) => enrollment.courseId === courseDetail.id)?.enrollmentDate
    : null;

  // Fetch course data
  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      dispatch(getAllCourses());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserEnrollments(token));
      dispatch(fetchUserCart(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const isInCart = cartItems.some(item => item.courseId === courseDetail?.id);
    setIsAddedToCart(isInCart);
  }, [cartItems, courseDetail?.id]);

  // Show content after loading
  useEffect(() => {
    if (!loading && courseDetail && courseDetail.instructor && courseDetail.introVideo) {
      const timeout = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading, courseDetail]);

  // Toggle description expand/collapse
  const toggleDescription = () => setIsExpanded(prev => !prev);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '120px');
    }
  }, [isExpanded]);

  // Related courses filtering
  const relatedCourses = courseDetail && courseDetail.categoryName
    ? courses
      .filter(course => course.categoryName === courseDetail.categoryName && course.id !== courseDetail.id)
      .slice(0, 2)
    : [];

  // Navigation handlers
  const viewAllCourses = () => navigate('/courses');

  const handleLessonClick = (lessonId) => {
    if (!isLoggedIn) {
      toast.warning('You must be logged in to access this content.');
      navigate('/login');
      return;
    }

    if (!isEnrolled) {
      toast.info('Please enroll in the course to view lessons.');
      return;
    }
    navigate(`/course/${courseDetail.id}/content/${lessonId}`);
  };

  // Enrollment handler
  const handleEnrollClick = async () => {
    if (!token) {
      toast.warning("Please login to continue.");
      navigate("/login");
      return;
    }

    try {
      if (courseDetail.priceType === 'FREE') {
        const res = await axios.post(
          "http://localhost:8080/api/user/enrollUser",
          { courseId: courseDetail.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Enrolled successfully!");
        dispatch(fetchUserEnrollments(token));
        navigate("/dashboard");
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/user/addCart",
          { courseId: courseDetail.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Course added to cart!");
        setIsAddedToCart(true); // Set state to show "View Cart" button
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.general ||
        "Something went wrong.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        setIsLoadingProgress(true);
        const token = localStorage.getItem("token");
        if (!token || !user?.id || !courseDetail?.id) {
          setCompletedLessons([]);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/user/${user.id}/completed-lessons?courseId=${courseDetail.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompletedLessons(response.data);
      } catch (error) {
        console.error("Error fetching completed lessons:", error);
        setCompletedLessons([]);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchCompletedLessons();
  }, [user?.id, courseDetail?.id, isAuthenticated]);


  // ✅ Use courseDetail.content instead of courseDetail.lessons
  const totalLessons = Array.isArray(courseDetail?.content) ? courseDetail.content.length : 0;
  const completedCount = completedLessons.length;
  const completionPercentage = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;



  // Loading and error states
  if (loading || !courseDetail || !courseDetail.instructor || !courseDetail.introVideo || !showContent) {
    return <Loader />;
  }

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className={`mt-[79px] md:mt-[77px] lg:mt-[117px] ${style.fadeIn}`}>
      {/* Hero Section */}
      <div className='bg-cover bg-no-repeat bg-center overflow-hidden' style={{ backgroundImage: `url(${CourseDetailBg})` }}>
        <div className={`w-full px-2.5 lg:px-5 py-[60px] md:py-[120px] ${style.container}`}>
          <div className='max-w-[1410px] mx-auto'>
            {/* Breadcrumbs */}
            <div>
              <span className='text-[#553DC4] text-[16px] font-inter mr-1'>Home</span>
              {">"}
              <span className='text-[#553DC4] text-[16px] font-inter mx-1'>Courses</span>
              {">"}
              <span className='font-hind text-[17.6px] text-[#777777] mx-1'>{courseDetail.title}</span>
            </div>

            {/* Course Title */}
            <h1 className='mt-[25px] text-[44px] text-[#110C2D] font-semibold font-hind leading-[54px] md:max-w-[67%]'>
              {courseDetail.title}
            </h1>

            {/* Course Stats */}
            <div className='flex flex-col md:flex-row gap-[30px] mt-5 mb-[30px]'>
              <div className='flex items-center text-[#777777] text-[17px]'>
                <FiUsers className='text-[#777777] mr-2.5' />
                {courseDetail.totalEnrollments || 0} Students
              </div>
              <div className='flex items-center text-[#777777] text-[17px]'>
                <LuNotebookPen className='text-[#777777] mr-2.5' />
                Last Updated: {new Date(courseDetail.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Instructor Info */}
            <div className='flex items-center gap-4 mt-16px'>
              <div className='h-[36px] w-[36px] flex-shrink-0'>
                <img
                  className='h-full w-full object-cover rounded-full'
                  src={`${BASE_URL}${courseDetail.instructor.imageUrl}`}
                  alt="Instructor"
                />
              </div>
              <div className='flex items-center flex-wrap gap-1 text-[16px] font-medium font-inter'>
                <span className='text-[#737477]'>By</span>
                <p className='text-[18px] font-bold text-[#212327] mr-4'>
                  {courseDetail.instructorName}</p>
                <div className='flex flex-wrap gap-1'>
                  <span className='text-[16px] font-medium font-inter text-[#737477]'>Categories: </span>
                  <p className='text-[18px] font-medium text-[#212327]'>{courseDetail.categoryName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='pb-[40px] pt-[60px] md:pb-[60px] md:pt-[120px]'>
        <div className='px-2.5'>
          <div className='max-w-[1410px] mx-auto'>
            <div className={`flex flex-col ${style.rowsContainer}`}>
              {/* Left Column (Main Content) */}
              <div className={`mb-[30px] ${style.row}`}>
                {/* Video Section */}
                <div className='mb-[20px]'>
                  <div className="w-full aspect-video relative overflow-hidden shadow-lg mx-auto bg-black">
                    {isPlaying ? (
                      <>
                        <iframe
                          className="w-full h-full"
                          src={`${courseDetail.introVideo}?autoplay=1&modestbranding=1&rel=0&controls=1`}
                          title="YouTube Video Player"
                          frameBorder="0"
                          onLoad={() => setIsIframeLoaded(true)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        {!isIframeLoaded && (
                          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="relative w-full h-full cursor-pointer brightness-140" onClick={() => setIsPlaying(true)}>
                        <img
                          src={courseDetail.introThumbnail}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between">
                          <div className="flex-1 flex items-center justify-center relative">
                            <div className={style.ring}></div>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-10 relative">
                              <FaPlay className="text-[#553CDF] text-lg" />
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-black/60 flex items-center gap-3 text-white text-xs">
                            <FaPlay className="text-sm" />
                            <div className="relative flex-1 h-1 bg-white/30 rounded-full">
                              <div className="absolute left-[0%] -top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </div>
                            <span className="ml-1">06:01</span>
                            <FaVolumeUp className="text-sm ml-4" />
                            <div className="w-20 h-1 bg-white/30 rounded-full">
                              <div className="h-full w-3/5 bg-blue-400 rounded-full"></div>
                            </div>
                            <FaCog className="text-sm ml-4" />
                            <FaExpand className="text-sm" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Course Section */}
                <div>
                  <div className='mb-[40px]'>
                    <h2 className='text-[22px] font-hind mb-3 font-semibold'>About Course</h2>
                    <div
                      className='transition-all duration-500 overflow-hidden font-normal text-[#949392] text-[19.2px] leading-[30px]'
                      style={{ maxHeight }}
                      ref={contentRef}
                    >
                      {courseDetail.description}
                    </div>
                    {courseDetail.description.length > 200 && (
                      <div
                        onClick={toggleDescription}
                        className='flex items-center gap-2 text-[#553DC4] font-medium cursor-pointer mt-7 w-fit'
                      >
                        {isExpanded ? <FaMinus size={12} /> : <FaPlus size={12} />}
                        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                      </div>
                    )}

                    {/* What You'll Learn Section */}
                    <div className='mt-8 mb-[40px] p-[30px] border border-[#DDD8F9] rounded-sm'>
                      <h3 className='font-bold text-[22px] font-hind text-[#000000] mb-5 leading-[45px]'>What Will You Learn?</h3>
                      <ul className='flex flex-col md:flex-row leading-[28px]'>
                        <div className='md:w-[50%]'>
                          <li className='flex items-center mb-3 font-inter text-[16px] text-[#5F6C76]'>
                            <span className='text-xl mt-0.5 mr-2'><MdCheck /></span>
                            <span>Learn New Things</span>
                          </li>
                          <li className='flex items-center mb-3 font-inter text-[16px] text-[#5F6C76]'>
                            <span className='text-xl mt-0.5 mr-2'><MdCheck /></span>
                            <span>Self Development</span>
                          </li>
                        </div>
                        <div>
                          <li className='flex items-center mb-3 font-inter text-[16px] text-[#5F6C76]'>
                            <span className='text-xl mt-0.5 mr-2'><MdCheck /></span>
                            <span>Skills Update</span>
                          </li>
                          <li className='flex items-center mb-3 font-inter text-[16px] text-[#5F6C76]'>
                            <span className='text-xl mt-0.5 mr-2'><MdCheck /></span>
                            <span>Prepared Yourself</span>
                          </li>
                        </div>
                      </ul>
                    </div>

                    {/* Course Content Section */}
                    <div className='mb-[40px]'>
                      <h3 className='font-bold text-[22px] font-hind text-[#000000] mb-5 leading-[45px]'>Course Content</h3>
                      <div className='mt-6'>
                        <div className="w-full bg-white rounded border border-[#e7f1ff]">
                          <Disclosure defaultOpen>
                            {({ open }) => (
                              <div>
                                <Disclosure.Button className="flex justify-between w-full px-[15px] py-[15px] text-[16px] font-inter text-[#110C2D] text-left bg-white border-b border-b-[#e7f1ff]">
                                  <div className="font-medium text-[16px] font-inter text-[#110C2D] hover:text-[#553CDF] transition-all ease-in-out duration-300 hover:cursor-pointer">
                                    {courseDetail.title}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span>{courseDetail.content.length} Lectures</span>
                                    <span>·</span>
                                    <span>{(courseDetail.duration.replace('h', 'hr : ').replace('m', 'min '))}</span>
                                    <ChevronUpIcon
                                      className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                                    />
                                  </div>
                                </Disclosure.Button>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      key="content"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="px-[15px] py-[20px] origin-top"
                                      >
                                        <Disclosure.Panel static>
                                          {courseDetail.content && courseDetail.content.length > 0 ? (
                                            courseDetail.content.map((lesson, index) => (
                                              <div
                                                key={lesson.id}
                                                className="flex justify-between items-start gap-2 py-2 text-[16px] flex-wrap hover:bg-gray-100 transition-all ease-in-out duration-600"
                                                onClick={() => handleLessonClick(lesson.id)}
                                              >
                                                <div className="flex items-center gap-2 max-w-[80%]">
                                                  <FaPlay className="text-gray-400 text-xs w-[20px]" />
                                                  <span className="text-[#1F1F25]">
                                                    {lesson.title}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm ml-auto">
                                                  <span>{lesson.duration}</span>
                                                  {isEnrolled && isAuthenticated ? <LuEye className='text-xs' /> : <FaLock className="text-xs" />}
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-gray-500 text-center py-4">
                                              No lessons available for this course yet.
                                            </div>
                                          )}
                                        </Disclosure.Panel>
                                      </motion.div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </Disclosure>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Section */}
                    <div className='mb-[40px]'>
                      <div className='flex flex-col md:flex-row gap-[30px] p-10 border border-[#DDD8F9]'>
                        <div className='mb-6 flex items-center'>
                          <div className='max-h-[200px] max-w-[200px] md:h-[200px] md:w-[200px]'>
                            <img
                              className='h-full w-full object-cover rounded-md'
                              src={`${BASE_URL}${courseDetail.instructor.imageUrl}`}
                              alt="Instructor"
                            />
                          </div>
                        </div>

                        <div>
                          <h5 className='text-[24px] font-hind mb-1.5 font-bold'>{courseDetail.instructorName}</h5>
                          <div className='font-hind text-[#757C8E]'>
                            {courseDetail.instructor.specialization}
                          </div>

                          <div className='flex items-center flex-wrap gap-[30px] my-3'>
                            <div className={`flex items-center gap-0.5`}>
                              <span className='text-[18px] font-semibold text-[#000]'>
                                {courseDetail.instructor?.averageRating?.toFixed(1) || '0.0'}
                              </span>
                              <div className='flex items-center gap-[2px] ml-2'>
                                {Array.from({ length: 5 }, (_, i) => {
                                  const rating = courseDetail.instructor?.averageRating || 0;
                                  if (rating >= i + 1) {
                                    return <FaStar key={i} className="text-yellow-400 text-[18px]" />;
                                  } else if (rating >= i + 0.5) {
                                    return <FaStarHalfAlt key={i} className="text-yellow-400 text-[18px]" />;
                                  } else {
                                    return <FaRegStar key={i} className="text-yellow-400 text-[18px]" />;
                                  }
                                })}
                              </div>
                            </div>

                            <div className='flex items-center text-[#777777] text-[17px]'>
                              <FiUsers className='text-[#777777] mr-2.5' />
                              {courseDetail.instructor.totalStudents || 0} Students
                            </div>

                            <div className='flex items-center text-[#777777] text-[17px]'>
                              <GoDeviceCameraVideo className='text-[#777777] mr-2.5' />
                              {courseDetail.instructor.totalCourses || 0} Courses
                            </div>
                          </div>

                          <div>
                            <p className='text-[16px] font-inter text-[#777777] leading-[27.5px] mb-[26px]'>
                              {courseDetail.instructor.bio}
                            </p>
                          </div>

                          <div className="flex items-center flex-wrap text-[#777777]">
                            <span className="text-gray-700 font-medium">Follow</span>
                            <div className='flex gap-4 ml-[30px]'>
                              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className="hover:text-[#3b5998] w-4 h-4 hover:scale-110 transition-transform" />
                              </a>
                              <a href="https://twitter.com/login" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="hover:text-[#1da1f2] w-4 h-4 hover:scale-110 transition-transform" />
                              </a>
                              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                                <FaYoutube className="hover:text-[#ff0000] w-4 h-4 hover:scale-110 transition-transform" />
                              </a>
                              <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="hover:text-[#e1306c] w-4 h-4 hover:scale-110 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* More Courses Section */}
                  <div className='flex-wrap mt-[50px] rounded-sm border border-[#DDD8F9] pb-[25px]'>
                    <div className='flex items-start flex-col md:flex-row md:justify-between p-[25px] pb-0'>
                      <h5 className='font-hind text-[24px] text-[#1F1F25] font-bold'>More Courses By StudyHub</h5>
                      <div
                        onClick={viewAllCourses}
                        className='flex items-center text-[#553CDF] font-inter text-[15px] font-medium hover:cursor-pointer'
                      >
                        View All Courses <GoArrowRight />
                      </div>
                    </div>

                    <div className='mt-[45px] flex flex-wrap'>
                      {courses
                        .filter(course => course.id !== courseDetail.id)
                        .slice(0, 2)
                        .map(course => (
                          <div key={course.id} className={`w-[50%] xl:w-[40%] ${style.MoreCourses}`}>
                            <CourseCard course={course} />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className={`${style.rowSide}`}>
                {/* Pricing and Enrollment Section */}
                <div className='p-[30px] border border-[#DDD8F9] rounded-sm'>
                  <div>
                    <div>
                      <span className="flex items-center text-[18px] font-medium text-[#212327]">
                        {isEnrolled && isAuthenticated ? (
                          <span className='text-[24px] font-hind font-semibold mb-[16px]'>Course Progress</span>
                        ) : courseDetail.discountedPrice && courseDetail.discountedPrice < courseDetail.price ? (
                          <>
                            <span className="text-[#1F1F25] text-[27px] font-bold">
                              ${Math.round(courseDetail.discountedPrice).toFixed(2)}
                            </span>
                            <span className="line-through text-gray-500 mr-2 ml-4 text-[16px] font-hind">
                              ${Math.round(courseDetail.price).toFixed(2)}
                            </span>
                          </>
                        ) : courseDetail.price > 0 ? (
                          <span className="text-[#1F1F25] text-[27px] font-bold">
                            ${Math.round(courseDetail.price).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[#1F1F25] text-[27px] font-bold">
                            {courseDetail.priceType.charAt(0).toUpperCase() + courseDetail.priceType.slice(1).toLowerCase()}
                          </span>
                        )}
                      </span>

                    </div>

                    <div className='mt-6 w-full'>
                      {isLoadingProgress ? (
                        <div className="flex justify-center py-4">
                          <div className="w-6 h-6 border-2 border-[#553DCF] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : isEnrolled && isAuthenticated ? (
                        <div className='flex flex-col gap-4 w-full'>
                          <div className="mt-4 text-[27px] text-hind">
                            <div className="flex justify-between font-bold text-gray-800 mb-1">
                              <span className='text-[27px] font-inter'>{completedCount}/{totalLessons}</span>
                              <span>{completionPercentage}% Complete</span>
                            </div>
                            <div className="w-full h-[6px] bg-gray-200 rounded">
                              <div
                                className="h-full bg-[#553DCF] rounded text-inter"
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {completionPercentage < 100 && (
                            <>
                              <button
                                className='flex items-center justify-center text-[16px] font-inter rounded-sm cursor-pointer w-full py-[14px] px-[34px] bg-[#553CDF] text-white border border-[#553DCF] hover:text-[#553DCF] hover:bg-white transition-all ease-in-out duration-300'

                              >
                                Continue Learning
                              </button>
                              <button
                                className='flex items-center justify-center text-[16px] font-inter rounded-sm cursor-pointer w-full py-[14px] px-[34px] bg-white text-[#553DCF] border border-[#553DCF] hover:text-white hover:bg-[#553DCF] transition-all ease-in-out duration-300'
                                onClick={() => {
                                  const firstLessonId = courseDetail.content?.[0]?.id;
                                  navigate(`/course/${courseDetail.id}/content/${firstLessonId}`);
                                }}

                              >
                                Complete Course
                              </button>
                            </>
                          )}

                        </div>
                      ) : (
                        <button
                          onClick={isAddedToCart ? () => navigate('/cart') : handleEnrollClick}
                          className='flex items-center justify-center text-[16px] font-inter rounded-sm cursor-pointer w-full py-[14px] px-[34px] bg-[#553CDF] text-white border border-[#553DCF] hover:text-[#553DCF] hover:bg-white transition-all ease-in-out duration-300'
                        >
                          {courseDetail.priceType === 'FREE' ? (
                            'Enroll Now'
                          ) : isAddedToCart ? (
                            'View Cart'
                          ) : (
                            <>
                              <FiShoppingCart className='mr-2' />
                              Add to Cart
                            </>
                          )}
                        </button>
                      )}

                      <p className='mt-5 text-[#777777] text-[15.6px] text-center'>
                        {isEnrolled && enrollmentDate && isAuthenticated ? (
                          <span className='flex flex-col text-start font-bold'>
                            <span className=' text-[#757C8E] text-[27px] font-hind'>You enrolled in this course on </span>
                            <span className='text-[#24A148] text-[27px] font-hind'>
                              {new Date(enrollmentDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </span>
                        ) : courseDetail.priceType === 'FREE' ? (
                          <span className='text-[#777777]'>Free access this course</span>
                        ) : (
                          ''
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Course Includes Section */}
                  <div>
                    <h5 className='mt-5 text-[24px] font-hind text-[#1F1F25] font-bold'> This Course Includes: </h5>
                    <ul>
                      <li className='flex flex-wrap items-center justify-between py-[18px] border-b font-inter text-[16px] w-full text-[#777777] border-b-[#DDD8F9]'>
                        <span className='flex items-center gap-2'><LuChartBarDecreasing /> Level</span>
                        <span className='ml-auto'>{courseDetail.level.charAt(0).toUpperCase() + courseDetail.level.slice(1).toLowerCase()}</span>
                      </li>
                      <li className='flex items-center flex-wrap justify-between py-[18px] border-b font-inter text-[16px] w-full text-[#777777] border-b-[#DDD8F9]'>
                        <span className='flex items-center gap-2'><GraduationCap /> Total Enrolled</span>
                        <span className='ml-auto'>{courseDetail.totalEnrollments} Enrolled</span>
                      </li>
                      <li className='flex items-center flex-wrap justify-between py-[18px] border-b font-inter text-[16px] w-full text-[#777777] border-b-[#DDD8F9]'>
                        <span className='flex items-center gap-2'><Clock1 /> Duration</span>
                        <span className='ml-auto'>{courseDetail.duration.replace('h', ' hours ').replace('m', ' minutes')}</span>
                      </li>
                      <li className='flex items-center flex-wrap justify-between py-[18px] font-inter text-[16px] w-full text-[#777777]'>
                        <span className='flex items-center gap-2'><LuNotebookPen className='w-' /> Last Updated </span>
                        <span className='ml-auto'>
                          {new Date(courseDetail.lastUpdated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Course Details Sidebar */}
                <div className='p-[30px] border border-[#DDD8F9] rounded-sm mt-6'>
                  {/* Instructor Info */}
                  <div className='pb-[40px] border-b border-b-[#DDD8F9]'>
                    <h5 className='text-[22px] mb-4 font-hind text-[#1F1F25] font-bold'> A Course By </h5>
                    <div className='flex py-[20px]'>
                      <div className='h-[36px] w-[36px] flex-shrink-0 mr-4'>
                        <img
                          className='h-full w-full object-cover rounded-full'
                          src={`${BASE_URL}${courseDetail.instructor.imageUrl}`}
                          alt="Instructor"
                        />
                      </div>
                      <span className='text-[27px] font-hind font-bold text-[#5F6C76]'>{courseDetail.instructorName}</span>
                    </div>
                  </div>

                  {/* Requirements Section */}
                  <div className='py-[30px] border-b border-b-[#DDD8F9]'>
                    <h3 className='text-[22px] mb-4 font-hind text-[#1F1F25] font-bold leading-[45px]'>Requirements</h3>
                    <ul>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Basic Programming
                      </li>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Daily Update
                      </li>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Routine Study
                      </li>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-3'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Regular Join Class
                      </li>
                    </ul>
                  </div>

                  {/* Share Section */}
                  <div className="py-[30px] border-b border-b-[#DDD8F9]">
                    <h2 className="text-[22px] font-bold font-hind text-black mb-[20px]">Share</h2>
                    <div className="flex gap-6 items-center">
                      <FaFacebookF className="text-[#1d1b4e] text-[24px] cursor-pointer hover:scale-110 transition" />
                      <FaXTwitter className="text-[#1d1b4e] text-[24px] cursor-pointer hover:scale-110 transition" />
                      <FaLinkedinIn className="text-[#1d1b4e] text-[24px] cursor-pointer hover:scale-110 transition" />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className='py-[30px] border-b border-b-[#DDD8F9]'>
                    <h2 className="text-[22px] font-bold font-hind text-black mb-[20px]">Tags</h2>
                    <div className="flex flex-wrap gap-3">
                      {courseDetail.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-[6px] border border-[#DDD8F9] text-[#000] rounded-sm text-[14px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Audience Section */}
                  <div className='pt-[30px]'>
                    <h3 className='text-[22px] mb-4 font-hind text-[#1F1F25] font-bold leading-[45px]'>Audience</h3>
                    <ul>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Technical People
                      </li>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Engineering Students
                      </li>
                      <li className='flex items-center gap-2 text-[#5F6C76] font-inter font-normal mb-7'>
                        <IoIosCheckmarkCircleOutline className='w-[23px] h-[23px] text-[#553DC4]' />
                        Programming Lover
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Courses Section */}
            <div className='pt-[60px]'>
              <div className='flex items-center'>
                <img className='w-[22px]' src={bulb} alt="bulb" />
                <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>More Similar Courses</span>
              </div>
              <h2 className='font-hind text-[35px] text-[#110C2D] md:text-[40px] font-bold mt-2 mb-2.5 leading-[50px]'>
                Related Courses
              </h2>
            </div>

            <div className="mt-[18px] md:mt-[25px] lg:mt-[40px]">
              {relatedCourses.length > 0 ? (
                <div className="flex flex-wrap">
                  {relatedCourses.map(course => (
                    <div key={course.id} className={`w-[50%] xl:w-[25%] ${style.MoreCourses}`}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#777] text-[16px] font-inter mt-2">
                  No related courses of this Category at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;