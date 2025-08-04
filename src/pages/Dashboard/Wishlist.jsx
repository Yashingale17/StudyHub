import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../redux/UserDashboard/WishlistAction';
import CourseCard from '../../Components/CourseCard/CourseCard';
import style from "../Courses/CoursesPage/coursesStyle.module.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { 
    items: wishlistItems, 
    loading, 
    error 
  } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className='border border-[#DDD8F9] p-[30px] mb-20'>
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="flex flex-wrap -mx-[13.5px]">
          {wishlistItems.map(item => (
            <div key={item.course.id} className={`w-full mb-[25px] sm:w-1/2 ${style.CourseBox}`} >
              <CourseCard
              course={item.course}
            />
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;