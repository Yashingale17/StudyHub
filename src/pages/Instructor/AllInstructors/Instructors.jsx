import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

import TopComp from '../../../Components/Top/TopComp'
import InstructorCard from '../../../Components/InstructorCard/InstructorCard'

const BASE_URL = 'http://localhost:8080';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getAllInstructors`);
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div>
      <div className='mt-[79px]  md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Instructors"} titleTwo={"Instructor"} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className='md:px-2.5'>
          <div className='flex flex-wrap max-w-[1410px] mx-auto pb-[40px] pt-[60px] md:pt-[110px] md:p-0'>
            {instructors.map((instructor, index) => (
              <InstructorCard
                id={instructor.id}
                key={index}
                imageUrl={`${BASE_URL}${instructor.imageUrl}`}
                fullName={instructor.fullName}
                specialization={instructor.specialization}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Instructors
