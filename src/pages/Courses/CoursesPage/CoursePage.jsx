import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from "./coursesStyle.module.css"
import {
  fetchCategories,
  fetchTags,
  fetchLevels,
  fetchPrices
} from '../../../redux/Users/UserActions/UserAction';
import CourseCard from '../../../Components/CourseCard/CourseCard';
import { getAllCourses, fetchFilteredCourses, fetchSearchCourses } from '../../../redux/Courses/CourseAction';

import TopComp from '../../../Components/Top/TopComp';
import FilterSidebar from '../../../Components/FilterSideBar/FilterSideBar';
import { HiAdjustments } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import Loader from '../../../Components/Loader/Loader';
import { useSearchParams } from 'react-router-dom';

const CoursePage = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: [],
    tags: [],
    level: [],
    price: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const { categories, tags, levels, prices, loading, error } = useSelector(
    (state) => state.userData
  );
  const courses = useSelector(state => state.course.courses);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

  let sortedCourses = [...courses];

  if (sortOption === "") {
    sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "title-desc") {
    sortedCourses.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOption === "date-new") {
    sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === "date-old") {
    sortedCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);


  const totalPages = Math.ceil(courses.length / coursesPerPage);


  useEffect(() => {
    if (isSidebarOpen || window.innerWidth >= 1024) {
      dispatch(fetchCategories());
      dispatch(fetchTags());
      dispatch(fetchLevels());
      dispatch(fetchPrices());
    }
    if (
      !searchQuery &&
      filters.category.length === 0 &&
      filters.tags.length === 0 &&
      filters.level.length === 0 &&
      filters.price.length === 0
    ) {
      dispatch(getAllCourses());
    }
  }, [isSidebarOpen, dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        if (searchQuery) {
          await dispatch(fetchSearchCourses(searchQuery));
        } else {
          await dispatch(fetchFilteredCourses({
            category: filters.category,
            price: filters.price,
            level: filters.level,
            tag: filters.tags,
          }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Filter error:', error);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [filters, searchQuery, dispatch]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryIds = categoryParam.split(',').map(id => parseInt(id, 10));
      setFilters(prev => ({
        ...prev,
        category: categoryIds.filter(id => !isNaN(id))
      }));
    }
  }, [searchParams]);



  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  }, [currentPage]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div>
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Courses"} titleTwo={"Courses"} />
      </div>

      <div>
        {
          showLoader ? (
            <div className="w-full mt-[-100px] flex justify-center items-center">
              <Loader />
            </div>
          ) : (

            <div className='px-2.5 lg:px-0'>
              <div className='max-w-[1410px] mx-auto pt-[60px] md:pt-[120px] md:pb-5 pb-[50px]'>
                <div className='flex items-center justify-between mb-[32px] lg:hidden'>
                  <span className='font-inter text-[30.5px] text-[#212327] font-medium'>Courses</span>
                  <div
                    className='bg-[#553CDF1A] w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer'
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <HiAdjustments className='text-[#553CDF] text-[20px]' />
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row '>
                  <div className='hidden lg:block lg:w-[25%] lg:px-[13.5px] xl:x-[27px]'>
                    <div className='border border-[#DDD8F9] w-full rounded-sm p-[30px]'>
                      <FilterSidebar
                        categories={categories}
                        tags={tags}
                        levels={levels}
                        prices={prices}
                        loading={loading}
                        error={error}
                        onFilterChange={setFilters}
                        onSearchChange={setSearchQuery}
                      />
                    </div>
                  </div>
                  <div className='w-full lg:w-[75%] lg:px-[20px]'>
                    <div className='flex items-center gap-4'>
                      <div className='hidden lg:flex items-center text-[16px] text-[#737477] font-inter font-medium'>
                        Sort By
                      </div>

                      <div className="relative inline-block hover:cursor-pointer">
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="appearance-none py-2 px-[16px] pr-10 border hover:cursor-pointer border-[#dfdbf5] outline-none rounded-sm w-full"
                        >
                          <option value="">Course Title (A-Z)</option>
                          <option value="title-desc">Course Title (Z-A)</option>
                          <option value="date-new">Release Date (Newest First)</option>
                          <option value="date-old">Release Date (Oldest First)</option>
                        </select>


                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg
                            className="w-4 h-4 text-[#444]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                    </div>
                    <div className='flex flex-wrap -mx-[13.5px]'>
                      {currentCourses.length > 0 ? (
                        currentCourses.map(course => (
                          <div key={course.id} className={`w-full mb-[25px] sm:w-1/2 ${style.CourseBox}`}>
                            <CourseCard course={course} />
                          </div>
                        ))
                      ) : (
                        <div className="w-full text-center text-[#777] font-inter text-[18px] py-12">
                          No courses found for the selected filters.
                        </div>
                      )}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-3 mt-10">

                        {currentPage > 1 && (
                          <button onClick={() => setCurrentPage(prev => prev - 1)}
                            className="w-10 h-10 rounded-full border border-[#DDD8F9] bg-[#553CDF1A] hover:bg-[#553CDF] transition-all ease-in-out duration-300 hover:text-white cursor-pointer text-[#212327]"
                          >
                            &lt;
                          </button>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full border cursor-pointer border-[#DDD8F9] text-sm ${currentPage === i + 1 ? 'bg-[#553CDF] text-white' : 'text-[#212327]'
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        {currentPage < totalPages && (
                          <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="w-10 h-10 rounded-full border border-[#DDD8F9] bg-[#553CDF1A] hover:bg-[#553CDF] transition-all ease-in-out duration-300 hover:text-white cursor-pointer text-[#212327]"
                          >
                            &gt;
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                </div>


                {/* {sidebar filter} */}
                <div>
                  {/* Blure Bg*/}
                  <div
                    className={`fixed inset-0 z-[60] bg-black/10 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                      }`}
                    onClick={() => setIsSidebarOpen(false)}
                  />

                  {/* Sidebar */}
                  <div
                    className={`fixed top-0 right-0 w-[320px] h-full bg-white overflow-y-scroll shadow-lg z-[999] p-8 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                      }`}
                  >
                    <div className='border border-[#DDD8F9] rounded-sm p-[30px]'>
                      <div className='flex justify-end mb-4 text-xl'>
                        <button className='text-red-500' onClick={() => setIsSidebarOpen(false)}>
                          <RxCross2 />
                        </button>
                      </div>

                      <FilterSidebar
                        categories={categories}
                        tags={tags}
                        levels={levels}
                        prices={prices}
                        loading={loading}
                        error={error}
                        onFilterChange={setFilters}
                        onSearchChange={setSearchQuery}
                        onClearFiltersDone={() => setIsSidebarOpen(false)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CoursePage;
