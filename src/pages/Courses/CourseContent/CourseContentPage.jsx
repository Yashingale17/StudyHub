import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../../../redux/Courses/CourseAction';
import { Disclosure } from '@headlessui/react';
import { FaArrowLeft, FaPlay } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from 'react-player';
import YouTube from 'react-youtube';
import style from '../CourseDetail/Detail.module.css'
import {
  FaVolumeUp,
  FaCog,
  FaExpand,
  FaArrowRight
} from "react-icons/fa";

const CourseContentPage = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseDetail } = useSelector(state => state.course);

  const [selectedLessonId, setSelectedLessonId] = useState(lessonId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    setSelectedLessonId(lessonId);
  }, [lessonId]);

  const selectedLesson = courseDetail?.content?.find(
    lesson => lesson.id === parseInt(selectedLessonId)
  );

  const handleLessonSelect = (lessonId) => {
    setSelectedLessonId(lessonId);
    navigate(`/course/${courseId}/content/${lessonId}`);
    setIsSidebarOpen(false);
  };

  const getYouTubeVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes("youtube.com")) {
        if (urlObj.pathname.includes("/embed/")) {
          return urlObj.pathname.split("/embed/")[1];
        }
        if (urlObj.pathname === "/watch") {
          return urlObj.searchParams.get("v");
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        console.error("User not logged in");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/user/${lessonId}/complete?userId=${user.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCompletedLessons(prev => [...prev, lessonId]);
      console.log("Lesson marked as complete:", response.data);

    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/login');
      }
    }
  };

  const lessons = courseDetail?.content || [];
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === parseInt(selectedLessonId));

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      handleLessonSelect(nextLesson.id);
      setIsPlaying(false);
      setIsIframeLoaded(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = lessons[currentLessonIndex - 1];
      handleLessonSelect(previousLesson.id);
      setIsPlaying(false);
      setIsIframeLoaded(false);
    }
  };

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) return;

        const response = await axios.get(
          `http://localhost:8080/api/user/${user.id}/completed-lessons?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const completedLessonIds = response.data;
        setCompletedLessons(completedLessonIds);

      } catch (error) {
        console.error("Error fetching completed lessons:", error);
      }
    };

    fetchCompletedLessons();
  }, [courseId]);

  const totalLessons = courseDetail?.content?.length || 0;
  const completedCount = completedLessons.length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="relative flex min-h-screen">
      {/* Permanent Sidebar for Large Screens */}
      <div className="hidden lg:block w-[378px] h-full bg-white border-r border-gray-200 overflow-y-auto fixed left-0 top-0 z-40">
        <div className='p-3'>
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Lessons</h2>
          </div>

          <div className="mt-6">
            <div className="w-full bg-white rounded border border-[#dad5f7]">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div>
                    <Disclosure.Button className="flex justify-between w-full px-[15px] py-[15px] text-[16px] font-inter text-[#110C2D] text-left bg-white border-b border-b-[#dad5f7]">
                      <div className="font-medium text-[16px] font-inter text-[#110C2D] hover:text-[#553CDF] transition-all ease-in-out duration-300 hover:cursor-pointer">
                        {courseDetail?.title}
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
                              {courseDetail?.content && courseDetail.content.length > 0 ? (
                                courseDetail.content.map((lesson, index) => (
                                  <div
                                    key={lesson.id}
                                    className={`flex justify-between items-start gap-2 py-2 text-[16px] flex-wrap hover:bg-gray-100 transition-all ease-in-out duration-600 cursor-pointer ${selectedLessonId == lesson.id ? 'bg-gray-50' : ''}`}
                                    onClick={() => handleLessonSelect(lesson.id)}
                                  >
                                    <div className="flex items-center justify-between gap-2 w-full">
                                      <div className="flex items-center gap-2">
                                        <FaPlay className="text-gray-400 text-xs w-[20px]" />
                                        <span className={`text-wrap ${selectedLessonId == lesson.id ? 'text-[#553CDF] font-medium' : 'text-[#1F1F25]'}`}>
                                          {lesson.title}
                                        </span>
                                      </div>

                                      <div className='flex gap-2 items-center'>
                                        <span className='text-sm text-gray-500'>{lesson.duration}</span>
                                        <input
                                          type="checkbox"
                                          readOnly
                                          checked={completedLessons.includes(lesson.id)}
                                          className="accent-[#553CDF]"
                                        />
                                      </div>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[378px]">
        {/* Top Bar - Progress only shown on lg and above */}
        <div className='flex items-center py-2 px-4 bg-[#553CDF] text-white'>
          <div onClick={() => navigate(-1)} className="cursor-pointer hover:opacity-80 transition">
            <FaArrowLeft />
          </div>
          <div className='text-[18px] font-inter mr-2 font-medium ml-3 leading-[30px]'>
            {courseDetail?.title}
          </div>
          <div className='hidden ml-auto text-right lg:flex text-sm text-gray-200'>
            {completedCount}/{totalLessons} completed ({completionPercentage}%)
          </div>

          <div className='ml-auto cursor-pointer lg:hidden' onClick={() => setIsSidebarOpen(true)}>
            <GiHamburgerMenu size={22} />
          </div>
        </div>

        {/* Video Section */}
        <div className="w-full aspect-video relative bg-black">
          {selectedLesson?.videoUrl && isPlaying ? (
            <>
              {!isIframeLoaded && (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <YouTube
                className="h-full w-full"
                videoId={getYouTubeVideoId(selectedLesson?.videoUrl)}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    fs: 1,
                  },
                }}
                onReady={() => setIsIframeLoaded(true)}
                onEnd={() => handleLessonComplete(selectedLesson.id)}
              />
            </>
          ) : (
            <div
              className="relative w-full h-full cursor-pointer brightness-125"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={`https://img.youtube.com/vi/${getYouTubeVideoId(selectedLesson?.videoUrl)}/hqdefault.jpg`}
                alt="YouTube Thumbnail"
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

        <div className='py-8'>
          <div className='w-full p-9'>
            <div className='text-[#212327] mb-3 text-[23px] font-inter font-semibold'>
              About Lesson
            </div>

            <div className='text-[16px] font-inter text-[#000000] leading-7'>
              {selectedLesson?.aboutLessons}
            </div>
          </div>

          <div className='flex py-5 px-[40px] justify-between border-t border-t-[#DDD8F9]'>
            {/* Previous Button */}
            <button
              onClick={handlePreviousLesson}
              disabled={currentLessonIndex <= 0}
              className={`flex items-center gap-1.5 py-[5px] px-3 rounded-sm hover:cursor-pointer
                ${currentLessonIndex <= 0
                  ? 'bg-[#e9e9ea] text-[#777777] cursor-not-allowed'
                  : 'bg-[#553CDF] text-white hover:bg-[#4329c8]'
                }`}
            >
              <FaArrowLeft />
              <span>Previous</span>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextLesson}
              disabled={currentLessonIndex >= lessons.length - 1}
              className={`flex items-center gap-1.5 flex-row-reverse py-[5px] px-3 rounded-sm hover:cursor-pointer
                ${currentLessonIndex >= lessons.length - 1
                  ? 'bg-[#e9e9ea] text-[#777777] cursor-not-allowed'
                  : 'bg-[#553CDF] text-white hover:bg-[#4329c8]'
                }`}
            >
              <FaArrowRight />
              <span>Next</span>
            </button>
          </div>

          {/* Progress Bar - Only shown on mobile (below lg) */}
          <div className="lg:hidden py-4 px-[40px] pb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {completedCount}/{totalLessons} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#553CDF] h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed top-0 right-0 h-full px-3 max-w-[378px] w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Lessons</h2>
            <IoMdClose
              className="cursor-pointer"
              size={22}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Lessons List */}
          <div className='mt-6'>
            <div className="w-full bg-white rounded border border-[#dad5f7]">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div>
                    <Disclosure.Button className="flex justify-between w-full px-[15px] py-[15px] text-[16px] font-inter text-[#110C2D] text-left bg-white border-b border-b-[#dad5f7]">
                      <div className="font-medium text-[16px] font-inter text-[#110C2D] hover:text-[#553CDF] transition-all ease-in-out duration-300 hover:cursor-pointer">
                        {courseDetail?.title}
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
                              {courseDetail?.content && courseDetail.content.length > 0 ? (
                                courseDetail.content.map((lesson, index) => (
                                  <div
                                    key={lesson.id}
                                    className={`flex justify-between items-start gap-2 py-2 text-[16px] flex-wrap hover:bg-gray-100 transition-all ease-in-out duration-600 cursor-pointer ${selectedLessonId == lesson.id ? 'bg-gray-50' : ''}`}
                                    onClick={() => handleLessonSelect(lesson.id)}
                                  >
                                    <div className="flex items-center justify-between gap-2 w-full">
                                      <div className="flex items-center gap-2">
                                        <FaPlay className="text-gray-400 text-xs w-[20px]" />
                                        <span className={`text-wrap ${selectedLessonId == lesson.id ? 'text-[#553CDF] font-medium' : 'text-[#1F1F25]'}`}>
                                          {lesson.title}
                                        </span>
                                      </div>

                                      <div className='flex gap-2 items-center'>
                                        <span className='text-sm text-gray-500'>{lesson.duration}</span>
                                        <input
                                          type="checkbox"
                                          readOnly
                                          checked={completedLessons.includes(lesson.id)}
                                          className="accent-[#553CDF]"
                                        />
                                      </div>
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
      )}
    </div>
  );
};

export default CourseContentPage;