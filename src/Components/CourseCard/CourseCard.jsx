import React from 'react'
import { useEffect, useState } from 'react';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import StarRating from '../Star/StarRating';
import style from "./courses.module.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../redux/UserDashboard/WishlistAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CourseCard = ({ course }) => {

   if (!course.active) {
    return null;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = "http://localhost:8080";

  const wishlist = useSelector(state => state.wishlist.items);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const inWishlist = wishlist.some(item => item.course?.id === course.id);
    setIsInWishlist(inWishlist);
  }, [wishlist, course.id]);

  const handleClick = () => {
    navigate(`/course/${course.id}`)
  }
const handleWishlistClick = async (e) => {
  e.stopPropagation();

  try {
    if (isInWishlist) {
      await dispatch(removeFromWishlist(course.id));
      toast.info("Removed from wishlist");
    } else {
      await dispatch(addToWishlist(course.id));
      toast.success("Added to wishlist");
    }

    // ✅ Refetch the updated wishlist to keep Redux in sync
    await dispatch(fetchWishlist());
  } catch (error) {
    console.error("Error updating wishlist:", error);
    toast.error("Failed to update wishlist");
  }
};

  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;

  return (
    <div onClick={handleClick} className={`cursor-pointer px-[13px] h-full ${style.card} ${style.fadein}`}>

      <div className="w-full md:w-1/2 lg:w-1/3 p-2 transition-transform duration-300 ease-in-out transform hover:scale-[1.02] animate-fadeIn">
      </div>

      <div className='p-6 pb-[10px] border border-[#EFECFF] rounded-md flex flex-col justify-start h-full'>

        <div className='relative mb-5 overflow-hidden cursor-pointer w-full'>
          <img
            src={`${BASE_URL}${course.thumbnail}`}
            loading='lazy'
            width="100%"
            alt="Course Thumbnail"
            className='rounded-md object-contain h-auto w-full transition-transform duration-300 hover:scale-105'
          />
          <div className='absolute top-[12px] right-[15px]'>
            <button
              onClick={handleWishlistClick}
              className='inline-flex items-center justify-center w-[34px] h-[34px] bg-[#3125751a] rounded-2xl'
            >
              {isInWishlist ? (
                <FaBookmark className='text-[#553CDF]' />
              ) : (
                <FaRegBookmark className='text-white' />
              )}
            </button>
          </div>
        </div>

        <div className='w-full'>
          <span className='inline-block bg-[#EEEBFF] text-[#553CDF] py-[3px] px-[8px] rounded-sm text-[14px] font-medium mb-3'>
            {course.categoryName}
          </span>

          <div className='my-[18px]'>
            <ul className='flex gap-6'>
              <li className='flex items-center text-[#737477] text-sm'>
                <LuNotebookPen className='mr-1' />
                {course.totalLessons || 0} Lessons
              </li>
              <li className='flex items-center text-[#737477] text-sm'>
                <FiUsers className='mr-1' />
                {course.totalEnrollments || 0} Students
              </li>
            </ul>
          </div>

          <h3 className='text-[#110C2D] font-hind text-[20px] font-semibold leading-snug hover:text-[#553CDF] transition-colors duration-300'>
            <a href="#">{course.title}</a>
          </h3>

          <a href="/instructor-profile">
            <h6 className='font-hind text-[14px] mt-[15px] text-[#444]'>{course.instructorName}</h6>
          </a>

          <div className='flex justify-between flex-wrap items-center mt-4'>
            <div className='flex items-center gap-1'>
              <StarRating rating={course.rating || 0} />
              {course.rating && (
                <span className='text-sm font-inter text-[#110C2D] ml-1'>
                  ({course.rating.toFixed(1)})
                </span>
              )}
            </div>

            <div className='text-right'>
              {course.price === 0 ? (
                <span className='text-[18px] font-inter text-[#553CDF] font-semibold'>
                  Free
                </span>
              ) : hasDiscount ? (
                <>
                  <span className='text-[18px] font-inter text-[#110C2D] font-semibold'>
                    ${Math.round(course.discountedPrice).toFixed(2)}
                  </span>
                  <span className='ml-2 line-through text-[14px] font-inter text-[#737477]'>
                    ${Math.round(course.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className='text-[18px] font-inter text-[#110C2D] font-semibold'>
                  ${Math.round(course.price).toFixed(2)}
                </span>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
