import React from 'react'
import { useState } from 'react';
import bulb from "../../pages/Home/bulb.png"
import smallBg from "../../pages/AboutUs/smallBg.png";
import aboutImg1 from "../../pages/AboutUs/Aboutimg1.jpg";
import threeStar from "../../pages/AboutUs/threeStar.svg";
import abourimg2 from '../../pages/AboutUs/Aboutimg2.jpg';
import book from "../../pages/AboutUs/book.svg";
import manwit from "../../pages/AboutUs/Man.svg";
import circle from "../../pages/AboutUs/circleimg.svg"
import { FaTimes } from "react-icons/fa";

import { FaPlay } from "react-icons/fa";

import style from '../../pages/AboutUs/About.module.css';

const LifeLong = () => {

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className='px-2.5 md:px-5 py-[60px] md:py-[120px]'>
        <div className={`flex flex-col max-w-[1410px] mx-auto ${style.MainContent}`}>
          <div className={`flex flex-col md:flex-row gap-5.5 ${style.left}`}>
            <div className='flex flex-col gap-4 md:w-[31.89%]'>
              <div
                className='flex justify-between items-center px-[15px] py-[20px] bg-cover bg-center rounded-sm'
                style={{ backgroundImage: `url(${smallBg})` }}
              >
                <div className='text-[#FFFFFF]'>
                  <h1 className='text-[48px] font-hind font-semibold'>2.4k</h1>
                  <p className='font-inter mt-[-2px]'>Positive Review</p>
                </div>
                <div className={`mr-5 flex justify-end ${style.star}`}>
                  <img src={threeStar} alt="Three Star" />
                </div>
              </div>
              <div className={`${style.img1}`}>
                <img src={aboutImg1} alt="Lady"
                />
              </div>
            </div>

            <div
              className='flex justify-center bg-center bg-no-repeat bg-cover md:w-[67%] p-2.5 min-h-[470px] rounded-sm'
              style={{ backgroundImage: `url(${abourimg2})` }}
            >
              <div className="relative flex items-center justify-center">
                <span className={style.ring}></span>

                <button className='' onClick={() => setIsVideoOpen(true)}>
                  <div className='w-[60px] h-[60px] bg-white flex items-center hover:cursor-pointer justify-center rounded-full z-10'>
                    <FaPlay className='w-3.5 h-3.5 text-[#553CDF]' />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className={`pt-5 flex flex-col gap-6.5 ${style.right}`}>
            <div className='max-w-[550px]'>
              <div className='flex items-center'>
                <img className='w-[22px]' src={bulb} alt="buld" />
                <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Gateway to Lifelong Learning</span>
              </div>
              <h2 className='mt-3.5 mb-5.5 text-[24px] md:text-[40px] font-hind font-semibold leading-7.5 md:leading-12'>
                Know Studyhub Empowering <br />
                Learners Worldwide
              </h2>
              <div>
                <p className='mb-[14px] font-inter text-[#777777]'>We are passionate about education and dedicated to providing high-quality learning resources for learners of all backgrounds.</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-10'>
              <div className='flex font-hind'>
                <div>
                  <img className='mr-[20px]' src={book} alt="book" />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[20px] text-[#221859] font-semibold'>
                    Learn with Expert
                  </span>
                  <span className='text-[15px] text-[#737477]'>
                    We are passionate education.
                  </span>
                </div>
              </div>
              <div className='flex'>
                <div>
                  <img src={manwit} className='mr-[20px]' alt="book" />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[20px] text-[#221859] font-semibold'>
                    Expert Instructors
                  </span>
                  <span className='text-[15px] text-[#737477]'>
                    We are passionate education.
                  </span>
                </div>
              </div>
            </div>

            <div className="py-[15px]">
              <span className="block w-full border-t border-t-[#DDD8F9]"></span>
            </div>

            <div className='flex flex-wrap gap-10'>
              <div className='flex items-center'>
                <div>
                  <img className='mr-[15px]' src={circle} alt="Circle" />
                </div>
                <div className='flex flex-col font-hind'>
                  <span className='text-[20px] text-[#221859] font-semibold'>Williams James</span>
                  <span className='text-[16px] text-[#737477]'>CEO, Studyhub Online Education</span>
                </div>
              </div>

              <div className='font-inter text-[#FFFFFF] hover:text-[#553CDF] text-center hover:cursor-pointer py-[14px] px-[34px] bg-[#553CDF] hover:bg-white rounded-sm flex items-center border border-[#553CDF] transition-all ease-in duration-150'>
                <button className=''>
                  About Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isVideoOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
          }}
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-7 -right-2 p-2 rounded-full shadow-lg z-50"
            >
              <FaTimes className="text-black w-4 h-4" />
            </button>

            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/zfx5JN2wZQU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  )
}

export default LifeLong
