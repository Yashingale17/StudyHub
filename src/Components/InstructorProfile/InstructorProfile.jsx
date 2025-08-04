import React, { useState, useEffect } from 'react';
import { GoArrowRight } from "react-icons/go";
import bulb from "../../pages/Home/bulb.png";
import InstructorCard from '../InstructorCard/InstructorCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';

const InstructorProfile = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/instructors');
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getAllInstructors`);
        console.log("Fetched instructors:", response.data);
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <>
      <div className='flex flex-col md:gap-4.5 hover:cursor-pointer'>
        <div className='px-2.5 md:px-5'>
          <div className='max-w-[1410px] mx-auto pt-[60px] pb-[40px] md:pt-[110px] md:pb-0'>
            <div className='flex flex-col md:justify-between gap-5 md:gap-6 md:flex-row lg:justify-between md:items-center'>
              <div>
                <div>
                  <div className='flex items-center'>
                    <img className='w-[22px]' src={bulb} alt="buld" />
                    <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Instructor</span>
                  </div>
                  <h2 className='mt-2 mb-2.5 text-[24px] md:text-[40px] font-hind text-[#110C2D] font-semibold'>Our Professional Instructor</h2>
                </div>

                <div>
                  <p className='font-hind text-[16px] text-[#777777] mb-3.5'>You'll find something to spark your curiosity and enhance</p>
                </div>
              </div>

              <div onClick={handleCardClick}>
                <div className='lg:mt-[15px]'>
                  <div className='flex'>
                    <a href="#" className={`px-[30px] py-[14px] bg-dark-blue flex items-center gap-2 rounded-sm text-white border border-[#553CDF] hover:bg-white hover:text-[#553CDF] transition-all duration-300 ease-in-out font-inter login-hove`}>
                      <span>View All Teachers</span>
                      <GoArrowRight className='text-[20px]' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap max-w-[1410px] mx-auto pb-[60px] md:p-0'>
          {instructors.slice(0, 4).map((instructor, index) => {
            return (
              <InstructorCard
                key={index}
                id={instructor.id}
                imageUrl={`${BASE_URL}${instructor.imageUrl}`}
                fullName={instructor.fullName}
                specialization={instructor.specialization}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default InstructorProfile;
