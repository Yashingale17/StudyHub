import React from 'react'
import { useState } from 'react'
import trust1 from "./trust1.svg"
import trust2 from "./trust2.svg"
import trust3 from "./trust3.svg"
import trust4 from "./trust4.svg"
import trust5 from "./trust5.svg"
import style from "./home.module.css"
import bannerImg from "./bannerimg.png"
import buld1 from "./bulb.png"
import one from "./one.png"
import two from "./two.png"
import three from "./three.png"
import { GoArrowRight } from "react-icons/go";
import star from "./stars.svg"
import cap from "./cap.svg"
import line from "./line.png"
import CourseCard from '../../Components/CourseCard/CourseCard'
import { useEffect } from 'react'
import ExploerCoursesBg from "./ExploerCoursesBg.jpg"

import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../redux/Courses/CourseAction";
import TopCat from '../../Components/TopCategorySwiper/TopCat'
import AboutTwo from '../../Components/AboutUsTwo/AboutTwo'
import FeedBack from '../../Components/FeedBack/FeedBack'
import ChooseUs from '../../Components/ChooseUs/ChooseUs'
import InstructorProfile from '../../Components/InstructorProfile/InstructorProfile'
import LifeLong from '../../Components/LifeLong/LifeLong'

import LadyFeed from "../../Components/FeedBack/LadyFeedback.jpg"
import ManFeed from "../../Components/FeedBack/ManFeedBack.jpg"
import StudentFeed from "./StudentFeedBg.jpg";
import WhiteCo from "./Whiteco.svg";
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { CiClock2 } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import Event1 from "./Event1.jpg";
import Event2 from "./Event2.jpg";
import Event3 from "./Event3.jpg";

import news2 from "./News2.jpg"
import news1 from "./News1.jpg"
import news3 from "./News3.jpg"
import { SlCalender } from "react-icons/sl";
import { CiUser } from "react-icons/ci";
import ShakeyImage from '../../Components/Shake/ShakyImage'
import green from './gBuld.svg'
import book from './booksvg.svg'
import dna from './dna.svg'
import SWave from './SWave.png'
import starss from './star.png'
import wave2 from '../../Components/ChooseUs/wave2.png'
import { useNavigate } from 'react-router-dom'

// bg-[#FBFAFF]

const Home = () => {
  const trustImages = [trust2, trust3, trust4, trust2, trust5, trust1];

  const navigate = useNavigate();
  const categories = ['All', 'Accounting', 'Business', 'Dance', 'Development', 'Marketing'];
  const [selected, setSelected] = useState('All');

  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  return (
    <>
      <div className='bg-[#FBFAFF] overflow-hidden '>
        <div className={`flex flex-col-reverse pt-5 max-w-[1410px] mx-auto pb-[50px] md:py-2.5  md:flex-row md:gap-[20px] md:items-center md:px-2.5  ${style.content} mt-[130px] gap-4 `}>
          <div className={`px-2.5 md:px-0 md:w-[50%] ${style.rightcontent}`}>
            <div className={`flex flex-col py-2.5 md:py-[60px] gap-[20px] relative md:gap-0 ${style.rightContentcontainer} `}>
              <div className='absolute hidden md:block bottom-[210px] left-[-45px]'>
                <ShakeyImage src={dna} />
              </div>
              <div className={`${style.jumpAnimation} ${style.capimg} absolute z-[998] left-[40%] w-full top-[-225px] md:top-[545px] md:left-[650px] lg:left-[800px] lg:top-[515px]`}>
                <div className={`flex items-center gap-[18px] w-fit p-2 rounded-[6px] border border-[#BBB1F2] bg-white shadow-[0px_4px_30px_0px_rgba(85,60,223,0.1)] ${style.boxTxt} `}>
                  <div>
                    <img src={cap} alt="Stars" />
                  </div>
                  <div>
                    <h6 className='text-[24px] leading-7 font-hind font-semibold'>100+</h6>
                    <span className='font-inter'>(Online Course)</span>
                  </div>
                </div>
              </div>
              <div className={`${style.jumpAnimation} ${style.starimg} absolute z-[998] w-full left-[13px] top-[-141px] md:left-[661px] md:top-[356px] lg:top-[360px] `}>
                <div className={`flex items-center gap-[18px] w-fit p-2 rounded-[6px] border border-[#BBB1F2] bg-white shadow-[0px_4px_30px_0px_rgba(85,60,223,0.1)] ${style.boxTxt} `}>
                  <div>
                    <img src={star} alt="Stars" />
                  </div>
                  <div className=''>
                    <h6 className='text-[24px] leading-7 font-hind font-semibold'>4.5</h6>
                    <span className='font-inter' >(2.4k Review)</span>
                  </div>
                </div>
              </div>
              <div className={`absolute left-[45px] top-[375px] lg:left-[49px] ${style.line}`}>
                <div>
                  <img src={line} alt="line" />
                </div>
              </div>

              <div className='md:mb-[20px]'>
                <div>
                  <div className='flex'>
                    <img className='w-[22px]' src={buld1} alt="buld" />
                    <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Gateway to lifelong learning</span>
                  </div>
                  <h1 className={`mt-6 mb-5 text-[26px] text-[#221859] md:text-[56px] font-hind font-semibold leading-[1.2] md:leading-[66px] ${style.title}`}>
                    Unlock Your Potential
                    <br />
                    {"with "}
                    <span className='font-medium'>Online Learning</span>
                  </h1>
                </div>

                <div>
                  <p className={`mb-3.5 font-inter text-[#777777] ${style.paddingpara}`}>Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
                </div>
              </div>

              <div className={`flex flex-col gap-5 md:gap-y-8 ${style.allcoursesMain}`}>
                <div className=''>
                  <div onClick={() => {
                    navigate("/courses")
                  }} className='flex'>
                    <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter hover:bg-white hover:text-[#553CDF] border border-[#553CDF] transition-all ease-in-out duration-300'>
                      <span>View All Courses</span>
                      <GoArrowRight className='text-[20px]' />
                    </a>
                  </div>
                </div>

                <div className={`${style.threeimg}`}>
                  <div className='flex'>
                    <div className='flex items-center w-[46%]'>
                      <div className='max-w-full'>
                        <div>
                          <img className='h-auto max-w-[80%]' src={one} alt="one" />
                        </div>
                      </div>
                      <div className='max-w-full'>
                        <div className='ml-[-14px]'>
                          <img className='h-auto max-w-[90%]' src={two} alt="two" />
                        </div>
                      </div>
                      <div className='max-w-full'>
                        <div className='ml-[-16px]'>
                          <img className='h-auto max-w-[95%]' src={three} alt="three" />
                        </div>
                      </div>
                    </div>

                    <div className='w-[50%] flex flex-col'>
                      <div>
                        <h5 className='font-hind text-[24px] font-semibold'>2K Students</h5>
                      </div>
                      <div>
                        <p className='font-inter text-[#777777]'>Join out online Class</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='px-2.5 relative md:w-[50%]'>
            <div className='absolute hidden md:block top-[130px] left-[640px]'>
              <ShakeyImage src={green} />
            </div>

            <div className='absolute hidden md:block left-[-35px] top-[18%]'>
              <ShakeyImage src={book} />
            </div>
            <div className='pt-2.5 md:p-0 lg:pt-2.5'>
              <div className='flex justify-center '>
                <img src={bannerImg} loading='lazy' alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2.5 md:px-5">
        <div className="flex flex-col md:flex-row md:items-center max-w-[1410px] mx-auto gap-4 pt-[60px] md:pt-[100px] xl:px-[120px]">

          <div className="text-center md:text-left md:min-w-max">
            <h5 className="mt-2 mb-2.5 text-[24px] font-hind font-semibold whitespace-nowrap">
              Trusted by:
            </h5>
          </div>

          {/* Swiper */}
          <div className="w-full overflow-hidden">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 6 },
              }}
            >
              {trustImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center items-center h-[100px]">
                    <img
                      src={img}
                      alt={`Trust ${index + 1}`}
                      className=" cursor-pointer
                  object-contain
                  w-[80px]
                  md:w-[90px]
                  lg:w-[74.5px]
                  xl:w-[50.5px]
                  mr-[131px]
                  xl:mr-[60px]
                  last:mr-0
                "
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>


      <LifeLong className="pt-0" />

      <div className='bg-cover px-2.5 mt-[60px] relative' style={{ backgroundImage: `url(${ExploerCoursesBg})` }}>
        <div className='absolute right-[930px] top-18'>
          <ShakeyImage src={book} />
        </div>
        <div className='absolute right-[10px] top-[30%]'>
          <ShakeyImage src={green} />
        </div>

        <div className='absolute right-[90%] top-[58%] z-40'>
          <ShakeyImage src={wave2} />
        </div>

        <div className='max-w-[1410px] mx-auto py-[60px] md:py-[110px]'>
          <div className='flex flex-col gap-5'>
            <div>
              <div className='flex items-center flex-col'>
                <div className='flex'>
                  <img className='w-[22px]' src={buld1} alt="buld" />
                  <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Top Category</span>
                </div>
                <h2 className='mt-[5px] mb-[10px] font-hind text-[24px] md:text-[40px] text-[#110C2D] font-semibold text-center'>
                  Explore 2000+ Free Online Courses
                </h2>
              </div>

              <div>
                <div className='text-center font-inter text-[#777777]'>
                  <p className='mb-[14px]'>You'll find something to spark your curiosity and enhance</p>
                </div>
              </div>
            </div>

            <div>
              <TopCat />
            </div>
          </div>
        </div>
      </div>

      <div className={` ${style.courseSection} w-full`}>
        <div className='max-w-[1410px] mx-auto pb-[40px] pt-[60px] md:pb-[90px] md:pt-[110px]'>
          <div className="w-full xl:flex xl:justify-between xl:items-center px-[13px] md:px-[20px]">
            <div>
              <div className='flex items-center'>
                <img className='w-[22px]' src={buld1} alt="buld" />
                <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Courses</span>
              </div>

              <h2 className='font-hind text-[24px] text-[#110C2D] md:text-[40px] font-semibold mt-[12px] mb-2.5'>
                Explore Featured Courses
              </h2>

              <p className='font-inter mb-4 text-[#777777]'>
                You'll find something to spark your curiosity and enhance
              </p>
            </div>

            <div className="mt-5 md:mt-6 xl:mt-0 flex justify-end flex-wrap gap-2 mb-[40px] md:mb-[50px]">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelected(category)}
                  className={`px-2.5 py-0.5 lg:py-1 text-[14.5px] text-sm rounded-sm font-normal font-inter cursor-pointer transition 
            ${selected === category
                      ? 'bg-[#553CDF] text-white'
                      : 'bg-[#EEEBFF] text-[#553CDF] hover:bg-purple-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Course List */}
          <div className="flex flex-wrap mt-6">
            {loading ? (
              <p>Loading courses...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className='w-full flex flex-wrap items-stretch'>
                  {courses.filter((course) => selected === "All" || course.categoryName === selected).length === 0 ? (
                    <p className="text-center w-full text-[#777] text-lg font-inter mt-6">
                      No courses available in this category.
                    </p>
                  ) : (
                    courses
                      .filter((course) => selected === "All" || course.categoryName === selected)
                      .map((course, index) => (
                        <div key={course.id} className={`w-[50%] mb-[25px] ${style.homeCourseCard}`}>
                          <CourseCard course={course} />
                        </div>
                      ))
                  )}
                </div>

              </>
            )}

          </div>
        </div>
      </div>

      <ChooseUs />

      <div className='px-2.5 md:px-5'>
        <div className='py-[60px] md:py-[110px] max-w-[1410px] mx-auto flex flex-col gap-8 '>
          <div className='text-center'>
            <div className='flex items-center justify-center'>
              <img className='w-[22px]' src={buld1} alt="buld" />
              <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Our Event</span>
            </div>

            <h2 className='font-hind text-[24px] text-[#110C2D] md:text-[40px] font-semibold mt-[12px] mb-2.5'>
              Upcoming Events
            </h2>

            <p className='font-inter mb-4 text-[#777777]'>
              You'll find something to spark your curiosity and enhance
            </p>
          </div>

          <div className='px-2.5 lg:px-0'>
            <div className={`flex flex-col p-[15px] md:py-5 md:px-[25px] border border-[#EFECFF] mb-5 rounded-sm ${style.eventBox}`} style={{ boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.05)' }}>
              <div className={`${style.eventTop}`}>
                <div className={`${style.eventImg}`}>
                  <img src={Event2} className='rounded-sm' alt="" />
                </div>

                <div className='py-4.5'>
                  <div className='mb-2.5'>
                    <ul className='flex flex-col gap-1 text-[#777777]'>
                      <li>
                        <p className='flex items-center font-inter'>
                          <SlCalender className='mr-1.5' />
                          July 24, 2023 </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiClock2 className='mr-1.5 text-[18px]' />
                          10:45 AM-01:30 PM
                        </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiLocationOn className='mr-1.5 text-[18px]' />
                          Yarra Park, Melbourne
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-hind text-[20px] font-semibold cursor-pointer hover:text-[#553CDF] transition-all ease-in-out duration-200'>Edu Fest 2023: Igniting Minds Off On Transforming Lives</h4>
                  </div>
                </div>
              </div>

              <div className={`${style.eventBtn}`}>
                <div className='flex'>
                  <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                    <span>Read More</span>
                    <GoArrowRight className='text-[20px]' />
                  </a>
                </div>
              </div>

            </div>

            <div className={`flex flex-col p-[15px] md:py-5 md:px-[25px] border border-[#EFECFF] mb-5 rounded-sm ${style.eventBox}`} style={{ boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.05)' }}>
              <div className={`${style.eventTop}`}>
                <div className={`${style.eventImg}`}>
                  <img src={Event3} className='rounded-sm' alt="" />
                </div>

                <div className='py-4.5'>
                  <div className='mb-2.5'>
                    <ul className='flex flex-col gap-1 text-[#777777]'>
                      <li>
                        <p className='flex items-center font-inter'>
                          <SlCalender className='mr-1.5' />
                          July 24, 2023 </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiClock2 className='mr-1.5 text-[18px]' />
                          10:45 AM-01:30 PM
                        </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiLocationOn className='mr-1.5 text-[18px]' />
                          Yarra Park, Melbourne
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-hind text-[20px] font-semibold cursor-pointer hover:text-[#553CDF] transition-all ease-in-out duration-200'>Mind Masters Workshop: Unlock Your Cognitive Potential</h4>
                  </div>
                </div>
              </div>

              <div className={`${style.eventBtn}`}>
                <div className='flex'>
                  <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                    <span>Read More</span>
                    <GoArrowRight className='text-[20px]' />
                  </a>
                </div>
              </div>

            </div>

            <div className={`flex flex-col p-[15px] md:py-5 md:px-[25px] border border-[#EFECFF] mb-5 rounded-sm ${style.eventBox}`} style={{ boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.05)' }}>
              <div className={`${style.eventTop}`}>
                <div className={`${style.eventImg}`}>
                  <img src={Event1} className='rounded-sm' alt="" />
                </div>

                <div className='py-4.5'>
                  <div className='mb-2.5'>
                    <ul className='flex flex-col gap-1 text-[#777777]'>
                      <li>
                        <p className='flex items-center font-inter'>
                          <SlCalender className='mr-1.5' />
                          July 24, 2023 </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiClock2 className='mr-1.5 text-[18px]' />
                          10:45 AM-01:30 PM
                        </p>
                      </li>
                      <li>
                        <p className='flex items-center font-inter'>
                          <CiLocationOn className='mr-1.5 text-[18px]' />
                          Yarra Park, Melbourne
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-hind text-[20px] font-semibold cursor-pointer hover:text-[#553CDF] transition-all ease-in-out duration-150'>Tech Talks 2023: Navigating the Digital Frontier</h4>
                  </div>
                </div>
              </div>

              <div className={`${style.eventBtn}`}>
                <div className='flex'>
                  <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                    <span>Read More</span>
                    <GoArrowRight className='text-[20px]' />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <AboutTwo />

      <InstructorProfile />

      <div>
        <div className='bg-[#F9F8FF] px-2.5 md:px-5'>
          <div className='max-w-[1410px] mx-auto py-[60px] md:py-[110px] flex flex-col gap-5'>
            <div>
              <div>
                <div className='flex justify-center items-center'>
                  <img className='w-[22px]' src={buld1} alt="buld" />
                  <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Student Review </span>
                </div>
                <h2 className='mt-[7px] mb-[10px] font-hind text-[24px] md:text-[40px] text-[#110C2D] font-semibold text-center'>
                  Our Students FeedBack
                </h2>
              </div>

              <div className='text-center'>
                <p className='font-inter text-[16px] text-[#777777] mb-[14px]'>You'll find something to spark your curiosity and enhance</p>
              </div>
            </div>

            <div className='rounded-sm bg-center bg-no-repeat bg-cover relative' style={{ background: `url(${StudentFeed})` }}>
              <div className='absolute top-23 left-[74%]'>
                <ShakeyImage src={starss} />
              </div>
              <div className='absolute left-[84%] top-[55%]'>
                <ShakeyImage src={SWave} />
              </div>
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                loop={true}
                fadeEffect={{ crossFade: true }}
                speed={1000}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                className="w-full"
              >
                {[1, 2, 3].map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex flex-col lg:flex-row gap-5 lg:gap-[50px] p-5 lg:pt-[40px] lg:pl-[40px] lg:pb-[50px] lg:pr-[30px] relative">
                      <div>
                        <img src={index === 1 ? ManFeed : LadyFeed} className="rounded-sm" alt="" />
                      </div>

                      {/* Right Content */}
                      <div className="lg:w-[60%] flex flex-col justify-center">
                        <div className="mt-[30px]">
                          <img className="mb-3.5" src={WhiteCo} alt="Comas" />
                          <div className="lg:w-[75%]">
                            <p className="font-inter text-[18px] md:text-[20px] mb-[25px] text-white font-medium">
                              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.
                            </p>
                          </div>
                        </div>

                        {/* Ratings */}
                        <div className="flex gap-1 mb-2.5">
                          <FaStar className="text-amber-300" />
                          <FaStar className="text-amber-300" />
                          <FaStar className="text-amber-300" />
                          <FaStar className="text-amber-300" />
                          <FaRegStar className="text-yellow-300" />
                        </div>

                        {/* Name + Role */}
                        <div className="text-white">
                          <h2 className="mb-[5px] font-hind text-[22px] font-semibold">Emma Elizabeth</h2>
                          <p className="font-medium">Assistant Teacher</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
          </div>
        </div>
      </div>

      <div className='px-2.5 md:px-5'>
        <div className='flex flex-col gap-4 max-w-[1410px] mx-auto pt-[60px] md:pt-[110px]'>
          <div className='mb-[15px]'>
            <div>
              <div className='flex justify-center items-center'>
                <img className='w-[22px]' src={buld1} alt="buld" />
                <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>News & Article</span>
              </div>
              <h2 className='mt-[5px] mb-[10px] font-hind text-[24px] md:text-[40px] text-[#110C2D] font-semibold text-center'>
                Read Our Latest News
              </h2>
            </div>

            <div className='text-center'>
              <p className='font-inter text-[16px] text-[#777777] mb-[14px]'>Our mission is to provide you with valuable insights</p>
            </div>
          </div>

          <div className='flex flex-wrap'>
            <div className='px-[13.5px] mb-[15px] md:w-[50%] lg:w-[33.33%]'>
              <div className='p-[30px] border border-[#DDD8F9] rounded-sm h-full flex flex-col justify-start'>
                <div className='relative'>
                  <img src={news2} className='rounded-sm' alt="news" />

                  <div className='absolute top-[15px] left-[15px] py-1 px-2.5 w-fit bg-[#EEEBFF] rounded-sm'>
                    <p className='text-[#553CDF] text-[16px] font-inter'>Story</p>
                  </div>
                </div>

                <div>
                  <div>
                    <ul className='pt-[30px] pb-[10px] flex gap-2.5 md:gap-4'>
                      <li className='flex items-center text-[16px] font-inter text-[#777777]'>
                        <SlCalender className='mr-[4px] text-[#553CDF] text-[18px]' />
                        May 12, 2024
                      </li>

                      <li className='flex items-center text-[16px] font-inter text-[#777777]'>
                        <CiUser className='mr-[4px] text-[#553CDF] text-[20px]' />
                        Jhon Sina
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='mb-[26px] text-[24px] font-hind font-bold leading-8 hover:text-[#553CDF] hover:cursor-pointer transition-all ease-in duration-150'>
                      Maximizing Your Learning Potential: A Guide to StudyHub
                    </h3>

                    <div className='flex'>
                      <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                        <span>Read More</span>
                        <GoArrowRight className='text-[20px]' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-[13.5px] mb-[15px] md:w-[50%] lg:w-[33.33%]'>
              <div className='p-[30px] border border-[#DDD8F9] rounded-sm h-full flex flex-col justify-start'>
                <div className='relative'>
                  <img src={news1} className='rounded-sm' alt="news" />

                  <div className='absolute top-[15px] left-[15px] py-1 px-2.5 w-fit bg-[#EEEBFF] rounded-sm'>
                    <p className='text-[#553CDF] text-[16px] font-inter'>Story</p>
                  </div>
                </div>

                <div>
                  <div>
                    <ul className='pt-[30px] pb-[10px] flex gap-2.5 md:gap-4'>
                      <li className='flex items-center text-[16px] font-inter text-[#777777]'>
                        <SlCalender className='mr-[4px] text-[#553CDF] text-[18px]' />
                        May 12, 2024
                      </li>

                      <li className='flex items-center text-[16px] font-inter text-[#777777]'>
                        <CiUser className='mr-[4px] text-[#553CDF] text-[20px]' />
                        Jhon Sina
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='mb-[26px] text-[24px] font-hind font-bold leading-8  hover:text-[#553CDF] hover:cursor-pointer transition-all ease-in duration-150'>
                      Announcing the winners the 2023 Education com Story
                    </h3>

                    <div className='flex'>
                      <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                        <span>Read More</span>
                        <GoArrowRight className='text-[20px]' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-[13.5px] mb-[15px] md:w-[50%] lg:w-[33.33%]'>
              <div className='p-[30px] border border-[#DDD8F9] rounded-sm h-full flex flex-col justify-start'>
                <div className='relative'>
                  <img src={news3} className='rounded-sm' alt="news" />

                  <div className='absolute top-[15px] left-[15px] py-1 px-2.5 w-fit bg-[#EEEBFF] rounded-sm'>
                    <p className='text-[#553CDF] text-[16px] font-inter'>Story</p>
                  </div>
                </div>

                <div>
                  <div>
                    <ul className='pt-[30px] pb-[10px] flex gap-2.5 md:gap-4'>
                      <li className='flex items-center text-[16px] font-inter text-[#777777]'>
                        <SlCalender className='mr-[4px] text-[#553CDF] text-[18px]' />
                        May 12, 2024
                      </li>

                      <li className=' flex items-center text-[16px] font-inter text-[#777777]'>
                        <CiUser className='mr-[4px] text-[#553CDF] text-[20px]' />
                        Jhon Sina
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='mb-[26px] text-[24px] font-hind font-bold leading-8 hover:text-[#553CDF] hover:cursor-pointer transition-all ease-in duration-150'>
                      Azure AI Fundamentals: How to Pass the AI-900 Exam
                    </h3>

                    <div className='flex'>
                      <a href="#" className='px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-[#FFFFFF] font-inter border border-[#553CDF] hover:text-[#553CDF] hover:bg-white transition-all ease-in duration-150'>
                        <span>Read More</span>
                        <GoArrowRight className='text-[20px]' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
