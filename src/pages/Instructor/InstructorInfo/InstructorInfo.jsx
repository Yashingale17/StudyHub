import React, { useEffect } from 'react';
import style from './Instructorinfoo.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchInstructorById, fetchInstructorCourses } from '../../../redux/Instructor/InstructorAction';
import instructorBg from './InfoBg.jpg';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import CourseCard from '../../../Components/CourseCard/CourseCard';


const InstructorInfo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { instructor, courses, loading, error } = useSelector(state => state.instructor);

  useEffect(() => {
    if (id) {
      dispatch(fetchInstructorById(id));
      dispatch(fetchInstructorCourses(id));
    }
  }, [id]);

  const BASE_URL = "http://localhost:8080"

  // if (loading) return <p className="text-center mt-10 text-lg">Loading instructor info...</p>;
  // if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className='mt-[79px] md:mt-[78px] lg:mt-[117px]'>
      <div className='px-2.5'>
        <div className='max-w-[1410px] mx-auto'>
          <div className='relative h-auto'>
            {/* Background Header */}
            <div
              className={`h-[220px] rounded-md bg-center bg-no-repeat bg-cover ${style.instructorbg}`}
              style={{ backgroundImage: `url(${instructorBg})` }}
            ></div>

            {/* Profile Section */}
            <div className={`flex flex-col justify-center items-center mt-[-83px] h-auto w-full ${style.instructorprofile}`}>
              <div
                className={`h-[160px] w-[153px] rounded-full border-8 border-[#fff] bg-center bg-no-repeat bg-cover ${style.instructorimg}`}
                style={{ backgroundImage: `url(${BASE_URL}${instructor?.imageUrl})` }}
              ></div>

              <div className={`text-center ${style.ratingName}`}>
                <div className={`flex flex-col justify-center gap-1 ${style.ratingDiv}`}>
                  <div className={`flex items-center justify-center gap-1 ${style.starDiv}`}>
                    <span className='text-[18px] font-semibold text-[#000]'>
                      {instructor?.averageRating?.toFixed(1) || '0.0'}
                    </span>
                    <div className='flex items-center gap-[2px] ml-2'>
                      {Array.from({ length: 5 }, (_, i) => {
                        const rating = instructor?.averageRating || 0;
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


                  <div className={`hidden ${style.specilization}`}>
                    {instructor?.specialization || 'N/A'}
                  </div>
                </div>

                <div className={`${style.instructorCourseName}`}>
                  <h3 className='font-hind text-[30px] text-[#161616] font-semibold'>
                    {instructor?.fullName || 'Unnamed Instructor'}
                  </h3>
                  <span className='text-[16px] font-inter text-[#757575] mx-1'>
                    <span className='text-[#000]'>{instructor?.totalCourses || 0}</span> Courses
                  </span>
                  <span className={`text-[20px] font-bold text-[#C4C4C4] mx-0.5 ${style.dot}`}>.</span>
                  <span className='text-[16px] font-inter text-[#757575] mx-1'>
                    <span className='text-[#000]'>{instructor?.totalStudents || 0}</span> Students
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biography + Social Links */}
          <div className={`${style.bioCourseWrapper}`}>
            <div className={`mt-[50px] mb-8 ${style.bioCourses}`}>
              <h3 className='text-[23px] font-hind text-[#212327] font-semibold mb-[23px]'>Biography</h3>
              <p className='text-[16px] font-inter text-[#737477] mb-[26px] leading-[28px]'>
                {instructor?.bio?.trim()
                  ? instructor.bio
                  : 'No biography available for this instructor.'}
              </p>

              {/* Social Icons */}
              <div className="flex gap-6 text-[#212327] items-center mt-[15px]">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="hover:text-blue-500 text-[#41454f] text-[20px] cursor-pointer transition-colors duration-200" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="hover:text-sky-400 text-[#41454f] text-[20px] cursor-pointer transition-colors duration-200" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="hover:text-red-500 text-[#41454f] text-[20px] cursor-pointer transition-colors duration-200" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="hover:text-pink-500 text-[#41454f] text-[20px] cursor-pointer transition-colors duration-200" />
                </a>
              </div>

              <div className="mt-[60px]">
                <h3 className='text-[23px] font-hind text-[#212327] font-semibold mb-[20px]'>Courses by {instructor?.fullName}</h3>

                <div className="flex flex-wrap">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <div key={course.id} className={`w-full md:w-[50%] mb-[25px] ${style.CourseBox}`}>
                        <CourseCard course={course} />
                      </div>
                    ))
                  ) : (
                    <p className="text-[#737477]">No courses available for this instructor.</p>
                  )}
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default InstructorInfo;
