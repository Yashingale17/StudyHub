import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/UserDashboard/UserDashAction';
import { fetchInstructorByIdSecure } from '../../redux/Instructor/InstructorAction';
import Loader from '../../Components/Loader/Loader';
import style from './Dash.module.css';
import { format, parseISO } from 'date-fns';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const role = user?.role;


  const dispatch = useDispatch();
  const {
    userProfile
  } = useSelector(state => state.userDashboard);
  const { instructor, loading: instructorLoading } = useSelector((state) => state.instructor);



  useEffect(() => {
    dispatch(fetchUserProfile());
    if (role === 'INSTRUCTOR') {
      dispatch(fetchInstructorByIdSecure(userId));
    }
  }, [dispatch, userId, role]);

  return (
    <div className='border border-[#DDD8F9] p-[30px] mb-20'>
      <div className='mb-6 text-[#110C2D] text-[22.5px] font-inter font-bold'>
        My Profile
      </div>

      <div>
        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            Registration Date
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.registrationDate ? formatRegistrationDate(userProfile.registrationDate) : 'N/A'}</div>
        </div>

        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            First Name
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.firstName ? (userProfile.firstName) : '-'}</div>
        </div>

        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            Last Name
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.lastName}</div>
        </div>

        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            user Name
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.userName ? (userProfile.userName) : '-'}</div>
        </div>

        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            Email
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.email ? (userProfile.email) : '-'}</div>
        </div>

        <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
          <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
            Phone Number
          </div>
          <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.mob ? (userProfile.mob) : '-'}</div>
        </div>

        {
          role === "INSTRUCTOR" ? (

            <div>
              <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
                <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
                  Skill/Occupation
                </div>
                <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{instructor?.specialization ? (instructor.specialization) : '-'}</div>
              </div>

              <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
                <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
                  Biography
                </div>
                <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{instructor?.bio ? (instructor.bio) : '-'}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
                <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
                  Skill/Occupation
                </div>
                <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.specialization ? (userProfile.specialization) : '-'}</div>
              </div>

              <div className={`flex font-inter mb-6 ${style.profileInfoContent}`}>
                <div className={`w-[41.66%] px-3.5 text-[#110C2D] font-medium ${style.profileInfoBox} `}>
                  Biography
                </div>
                <div className={`w-[58.33%] px-3.5 text-[#737477] ${style.profileInfoBox}`}>{userProfile?.bio ? (userProfile.bio) : '-'}</div>
              </div>
            </div>
          )
        }


      </div>
    </div>
  )
}

export default Profile


const formatRegistrationDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};



