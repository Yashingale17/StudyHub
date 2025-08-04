import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEnrollments } from '../../redux/UserDashboard/UserDashAction';
import CourseCard from '../../Components/CourseCard/CourseCard';
import Loader from '../../Components/Loader/Loader';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { enrollments, loading } = useSelector(state => state.userDashboard);

  useEffect(() => {
    dispatch(fetchUserEnrollments());
  }, [dispatch]);

  // Filter courses where paid === true or price > 0
  const paidCourses = enrollments?.enrolled?.filter(course => course.paid || course.price > 0) || [];

  return (
    <div className="mb-20 px-2.5">
      <div className="p-[30px] mb-[60px] border border-[#DDD8F9] rounded-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#110C2D]">Order History</h2>

        {/* Loader */}
        {loading && <Loader />}

        {/* Paid Courses List */}
        {!loading && paidCourses.length > 0 ? (
          <div className="flex flex-wrap -mx-[13.5px]">
            {paidCourses.map(course => (
              <div key={course.id} className="w-full sm:w-1/2 mb-[25px] px-[13.5px] lg:w-[35.33%]">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-500">
              No paid courses found in your order history.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
