import React from 'react'
import logo from "../Header/logo-1.svg"
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import Bgimage from "./cirtificateFrombg.jpg";
import women from "./cirtificateWomen.jpg"
import smallIcon from "./CSmallIcon.svg"
import smallIcon2 from "./CSmallIcon2.svg"
import style from "./foot.module.css"
import ShakyImage from '../../Shake/ShakyImage';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className=''>
        <div>
          <div className='px-2.5 mb-[-140px]'>
            <div className='py-2.5 lg:pt-[100px] max-w-[1410px] mx-auto'>
              <div className=" bg-cover rounded-sm relative overflow-x-hidden" style={{ backgroundImage: `url(${Bgimage})` }}>
                <div className='absolute right-[1.5%] top-[47%]'>
                  <ShakyImage className='image-container' src={smallIcon2} alt="" />
                </div>
                <div className='absolute left-[4%] top-[21%] hover:cursor-pointer'>
                  <ShakyImage className='image-container' src={smallIcon} alt="" />
                </div>
                <div className='flex items-center justify-center flex-col-reverse md:justify-start md:flex-row gap-[30px] [@media(min-width:1200px)]:gap-[50px]' >
                  <div className="md:w-[40%] [@media(min-width:1200px)]:w-[20%] md:pt-[30px] md:flex md:justify-center [@media(min-width:1200px)]:justify-end">
                    <div>
                      <img src={women} className="" alt="Certificate logo" />
                    </div>
                  </div>

                  <div className='p-5 w-full text-center md:w-[50%] [@media(min-width:1200px)]:w-[80%] md:text-left md:p-0'>
                    <div className='flex flex-col gap-3 [@media(min-width:1200px)]:flex-row [@media(min-width:1200px)]:justify-between [@media(min-width:1200px)]:items-center '>
                      <div>
                        <h2 className='text-[27px] md:text-[38px] [@media(min-width:1200px)]:text-[48px] tracking-wide mt-2 mb-2.5 font-hind text-[#FFFFFF] font-semibold leading-[1.2]'>
                          Skills Certificate From
                          <br />
                          the Studyhub
                        </h2>
                      </div>

                      <div>
                        <a href="#" className={`inline-flex relative z-50 justify-center flex-wrap items-center gap-2 px-[16px] py-2 md:px-[34px] md:py-3.5 txt-color mr-[100px] bg-[#FFFFFF] rounded-sm ${style.viewAllBtn}`}>
                          <span className='text-[16px] font-inter '>View All Course</span>
                          <GoArrowRight className='text-[16px]' />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='pt-36 light-bg'>
            <div className='flex flex-wrap px-2.5'>
              <div className={`flex md:max-w-[1410px] w-full mx-auto gap-x-[100px] pt-17.5 mb-1 ${style.divParent}`}>
                <div className={`md:w-1/4 w-auto flex flex-col gap-5.5 ${style.logoFooter}`}>
                  <div>
                    <img src={logo} alt="StudyHub" />
                  </div>
                  <div>
                    <div className='font-inter leading-6.5 text-[#777777]'>
                      <p>We are passionate education dedicated to providing high-quality resources learners all backgrounds.</p>
                    </div>
                  </div>
                  <div>
                    <div className='flex flex-col gap-3.5'>
                      <div className='flex items-center'>
                        <IoLocationOutline className='txt-color text-lg' />
                        <span className='pl-2.5 text-[#777777]'>Yarra Park, Melbourne, Australia</span>
                      </div>
                      <div className='flex items-center'>
                        <FiPhone className='txt-color text-lg' />
                        <span className='pl-2.5 text-[#777777]'>+(61) 485-826-710</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`md:w-[14%] w-auto pt-0 p-2.5 flex flex-col gap-4 ${style.userFullLink}`}>
                  <div>
                    <h6 className='font-hind text-lg font-bold'>Usefull Links</h6>
                  </div>
                  <div>
                    <ul>
                      {['Course', 'Mission & Vision', 'Join career', 'Zoom Meeting', 'Pricing Plan'].map((item, index) => (
                        <li key={index} className='py-1.5 text-[#777777] font-inter'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`md:w-[14%] w-auto pt-0 p-2.5 flex flex-col gap-4 ${style.Explore}`}>
                  <div>
                    <h6 className='font-hind text-lg font-bold'>Explore</h6>
                  </div>
                  <div>
                    <ul>
                      {['Course One', 'Course Two', 'Course Three', 'Lesson Details', 'Instructor'].map((item, index) => (
                        <li key={index} className='py-1.5 text-[#777777] font-inter'>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`md:w-[27%] w-auto pt-0 p-2.5 flex flex-col gap-4 ${style.newsLetter}`}>
                  <div>
                    <h6 className='font-hind text-lg font-bold' >Newsletter</h6>
                  </div>
                  <div className='mt-1.5'>
                    <p className='text-[#777777] font-inter mb-4'>Subscribe Our newsletter get update our new course</p>
                  </div>
                  <div className="bg-[#f8f7ff] border border-[#d9d6fc] p-2 rounded-lg flex items-center max-w-md">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className="flex-grow min-w-0 outline-none bg-transparent text-gray-700 placeholder-gray-500"
                    />
                    <button className="bg-dark-blue px-2.5 py-1 rounded-md flex-shrink-0">
                      <span className='font-inter text-white'>Subscribe</span>
                    </button>
                  </div>

                  <div className='flex items-center mt-2.5'>
                    <label className='custom-checkbox-wrapper'>
                      <input type="checkbox" className='accent-[#553CDF]' />
                      <span className="custom-checkbox-box"></span>
                    </label>
                    <span className='ml-2.5 font-inter text-[#777777]'>I agree to the terms of use and privacy policy.</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col md:max-w-[1410px] w-full mx-auto justify-center items-center flex-wrap md:flex-row md:justify-between border-t border-t-[#DDD8F9] py-5'>
                <div className='mb-5 text-[16px] font-inter text-[#777777] text-center'>
                  <p>Copyright © 2024 All Rights Reserved by Studyhub</p>
                </div>

                <div className="py-4 flex justify-center flex-wrap gap-6">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3b5998] hover:scale-110 transition-transform"
                  >
                    <FaFacebookF size={20} />
                  </a>

                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e1306c] hover:scale-110 transition-transform"
                  >
                    <FaInstagram size={20} />
                  </a>

                  <a
                    href="https://www.linkedin.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0077b5] hover:scale-110 transition-transform"
                  >
                    <FaLinkedinIn size={20} />
                  </a>

                  <a
                    href="https://www.pinterest.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#bd081c] hover:scale-110 transition-transform"
                  >
                    <FaPinterestP size={20} />
                  </a>

                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff0000] hover:scale-110 transition-transform"
                  >
                    <FaYoutube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
