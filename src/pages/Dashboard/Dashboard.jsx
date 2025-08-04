import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEnrollments } from '../../redux/UserDashboard/UserDashAction';
import Loader from '../../Components/Loader/Loader';
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaBookOpen, FaTrophy, FaGraduationCap } from "react-icons/fa";
import style from './Dash.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const dashboardData = useSelector(state => state.userDashboard);
  const counts = dashboardData?.counts || { enrolled: 0, active: 0, completed: 0 };
  const loading = dashboardData?.loading || false;
  const error = dashboardData?.error || null;

  useEffect(() => {
    dispatch(fetchUserEnrollments());
  }, [dispatch]);

  if (loading) return <Loader className="mb-[-50%]" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className='border border-[#DDD8F9] p-[30px] mb-20'>
      {/* Profile section */}
      <div className='flex items-center justify-between gap-2.5 flex-wrap py-[13px] px-4 border border-[#553cdfd3] rounded-sm mb-4'>
        <div className='flex flex-wrap gap-2'>
          <span className='flex items-center h-6 w-6'><IoAlertCircleOutline className='h-full w-full' /></span>
          <span>Set Your Profile Photo</span>
        </div>
        <div onClick={() => {navigate('/dashboard/setting')}} className='py-1.5 px-[13px] ml-auto bg-[#553cdf26] border border-[#553cdf4d] rounded-sm hover:cursor-pointer'>
          Click Here
        </div>
      </div>

      <div className='mb-6 text-[#110C2D] text-[22.5px] font-inter font-bold'>
        Dashboard
      </div>

      {/* Count cards */}
      <div className={`flex flex-col flex-wrap ${style.CountMain}`}>
        {/* Enrolled Courses */}
        <div className={`px-[13.5px] mb-4 ${style.countContainer}`}>
          <div className='p-[47px] border border-[#DDD8F9] rounded-sm'>
            <div className={`flex items-center gap-5 flex-wrap py-2 px-3 ${style.countBox}`}>
              <span className='flex justify-center items-center m-auto h-[60px] w-[60px] border border-[#DDD8F9] rounded-full bg-[#F9F8FF]'>
                <FaBookOpen className='text-[#553CDF] h-[50%] w-[40%]'/>
              </span>
              <span className='font-hind text-center text-[#737477]'>
                Enrolled Courses
              </span>
              <span className='m-auto text-[#212327] text-[26px] font-inter font-semibold'>
                {counts.enrolled}
              </span>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className={`px-[13.5px] mb-4 ${style.countContainer}`}>
          <div className='p-[47px] border border-[#DDD8F9] rounded-sm'>
            <div className={`flex items-center gap-5 flex-wrap py-2 px-3 ${style.countBox}`}>
              <span className='flex justify-center items-center m-auto h-[60px] w-[60px] border shrink-0 border-[#DDD8F9] rounded-full bg-[#F9F8FF]'>
                <FaGraduationCap className='text-[#553CDF] h-[50%] w-[40%] shrink-0'/>
              </span>
              <span className='font-hind text-center text-[#737477]'>
                Active Courses
              </span>
              <span className='m-auto text-[#212327] text-[26px] font-inter font-semibold'>
                {counts.active}
              </span>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className={`px-[13.5px] mb-4 ${style.countContainer}`}>
          <div className='p-[47px] border border-[#DDD8F9] rounded-sm'>
            <div className={`flex items-center gap-5 flex-wrap py-2 px-3 ${style.countBox}`}>
              <span className='flex justify-center items-center m-auto h-[60px] w-[60px] border border-[#DDD8F9] rounded-full bg-[#F9F8FF]'>
                <FaTrophy className='text-[#553CDF] h-[50%] w-[40%]'/>
              </span>
              <span className='font-hind text-center text-[#737477]'>
                Completed Courses
              </span>
              <span className='m-auto text-[#212327] text-[26px] font-inter font-semibold'>
                {counts.completed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;