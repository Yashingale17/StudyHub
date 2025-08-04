import React from 'react'
import man from "./manwithpen.jpg"
import womenHead from "./womenHead.png"
import rotate from "./rotate.svg"
import buld2 from "../../pages/Home/bulb2.png";
import bigBlue from "./bgbigBlue.jpg";
import style from "../../pages/Home/home.module.css"
import chooseUs1 from "./chooseUs1.svg"
import chooseUs2 from "./chooseUs2.svg"
import chooseUs3 from "./chooseUs3.svg"
import chooseUs4 from "./chooseUs4.svg"
import chooseUs5 from "./chooseUs5.svg"
import chooseUs6 from "./chooseUs6.svg"
import circle from '../../Components/AboutUsTwo/circles.png'

import { GoArrowRight } from "react-icons/go";
import ShakyImage from '../Shake/ShakyImage';
import smbook from './smBook.svg';
import sWave from './wave2.png'

const ChooseUs = () => {

  const chooseUsItems = [
    { img: chooseUs3, title: "Expert", subtitle: "Instructors" },
    { img: chooseUs6, title: "Interactive", subtitle: "Learning" },
    { img: chooseUs4, title: "Affordable", subtitle: "Learining" },
    { img: chooseUs2, title: "Career", subtitle: "Advance" },
    { img: chooseUs5, title: "Course", subtitle: "Selection" },
    { img: chooseUs1, title: "Support", subtitle: "Community" },
  ];

  return (
    <div>
      <div className='bg-cover px-2.5 md:px-5 relative' style={{ backgroundImage: `url(${bigBlue})` }}>
        <div className='absolute right-[3%] top-[30%]'>
          <ShakyImage src={circle} />
        </div>
        <div className='absolute hidden md:block left-[35%] top-30 '>
          <ShakyImage src={smbook} />
        </div>
        <div className='absolute hidden md:block left-[5%] bottom-70 z-50 '>
          <ShakyImage src={sWave} />
        </div>
        <div className='flex flex-col md:justify-center lg:flex-row max-w-[1410px] mx-auto py-[65px] md:py-[110px]'>
          <div className='flex gap-5 relative md:w-full lg:w-[50%]'>
            <div className={`absolute left-[20%] top-[50%] w-[25%] lg:top-[40%] ${style.rotateDiv} `}>
              <div className={`rounded-full w-fit backdrop-blur-[12px] ${style.rotateImg} `}>
                <img className='rounded-full w-fit h-auto filter brightness-100 contrast-100 saturate-100 blur-0 hue-rotate-0
                ' src={rotate} alt="Rotate" />
              </div>
            </div>
            <div className='w-[30%]'>
              <div className='w-[100%]'>
                <img className='rounded-lg w-[100%]' src={man} alt="manwithPen" />
              </div>
            </div>

            <div className='w-[50%] md:w-[61%] '>
              <div className="mt-6 md:mt-[80px] w-[100%]">
                <img className='rounded-sm w-[100%]' src={womenHead} alt="WomenHead" />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5 mt-5 lg:w-[50%] lg:pl-[40px]'>
            <div>
              <div>
                <div className='flex'>
                  <img src={buld2} alt="" />
                  <span className='px-2.5 font-inter text-[#FFFFFF] font-medium'>Why Choose Us</span>
                </div>
                <h2 className='mt-2.5 mb-5 font-hind text-2xl md:text-[40px] text-[#FFFFFF] leading-[30px] md:leading-[45px] font-semibold'>
                  Studyhub Your Path to
                  <br />
                  Excellence & Success
                </h2>
              </div>

              <div>
                <p className='mb-3.5 font-inter text-[#FFFFFF] lg:mb-[14px] lg:pr-[150px] '>We are passionate about education and dedicated to providing high-quality learning resources for learners of all backgrounds.</p>
              </div>
              <div>

              </div>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-3.5 lg:mb-[30px] lg:mt-[5px] ${style.Straightgrid} `}>
              {chooseUsItems.map((item, index) => (
                <div
                  key={index}
                  className="flex min-w-0 border border-[#674EF2] rounded px-2.5 pr-5 py-2.5"
                >
                  <div className="mr-4 shrink-0">
                    <img width={32} height={34} src={item.img} alt="" />
                  </div>
                  <div className="flex flex-col font-inter text-[#FFFFFF] gap-0 leading-none">
                    <span className="break-words">{item.title}</span>
                    <span className="break-words">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className='lg:mt-[15px]'>
                <div className='flex'>
                  <a href="#" className={`px-[30px] py-[14px] light-bg flex items-center gap-2 rounded-sm txt-color font-inter login-hover ${style.borderHover}`}>
                    <span>View All Courses</span>
                    <GoArrowRight className='text-[20px]' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseUs
