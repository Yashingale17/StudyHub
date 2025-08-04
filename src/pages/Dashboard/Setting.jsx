import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import style from './Dash.module.css';
import Cover from "./CoverPhoto.jpg";
import profile from './profile.jpg';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCameraOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { updateUser } from '../../redux/Auth/Authslice';
import { fetchUserProfile } from '../../redux/UserDashboard/UserDashAction';
import { fetchInstructorByIdSecure } from '../../redux/Instructor/InstructorAction';

const tabs = ['Profile', 'Password', 'Social Profile'];

const Setting = () => {
  const baseUrl = "http://localhost:8080";
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = user?.id;
  const role = user?.role;

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


  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    mob: '',
    displayName: '',
    timezone: 'Asia/Calcutta',
    bio: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isCoverImageDeleted, setIsCoverImageDeleted] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userName: user.userName || '',
        email: user.email || '',
        mob: user.mob || '',
        displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        timezone: user.timezone || 'Asia/Calcutta',
        bio: user.bio || ''
      });
      setProfilePreview(user.profileImage || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePassword = () => {
    const tempErrors = {};
    if (!passwordForm.currentPassword) tempErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) tempErrors.newPassword = "New password is required";
    if (passwordForm.newPassword === passwordForm.currentPassword)
      tempErrors.newPassword = "New password cannot be same as current";
    if (passwordForm.confirmPassword !== passwordForm.newPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    return tempErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8080/api/user/change-password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError("Something went wrong. Try again.");
      }
    }
  };


  const handleUploadCoverImage = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('coverImage', file);
      formData.append('deleteCoverImage', 'false');

      const response = await axios.put(
        `http://localhost:8080/api/user/updateProfile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setCoverPreview(URL.createObjectURL(file));
      setCoverImage(file);
      setIsCoverImageDeleted(false);

      dispatch(updateUser(response.data));
      dispatch(fetchUserProfile());

      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    }
  };

  const handleUploadProfileImage = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.put(
        `http://localhost:8080/api/user/updateProfile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update local state
      setProfilePreview(URL.createObjectURL(file));
      setProfileImage(file);

      // Update Redux store
      dispatch(updateUser(response.data));
      dispatch(fetchUserProfile());

      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload profile image");
      console.error(error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadProfileImage(file)
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadCoverImage(file)
    }
  };

  const handleRemoveCover = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('deleteCoverImage', 'true');


      const response = await axios.put(
        `http://localhost:8080/api/user/updateProfile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setCoverPreview(Cover);
      setCoverImage(null);
      setIsCoverImageDeleted(true);

      dispatch(updateUser(response.data));
      dispatch(fetchUserProfile());

      if (!toast.isActive('cover-remove-toast')) {
        toast.success("Cover image removed successfully!", {
          toastId: 'cover-remove-toast'
        });
      }
    } catch (error) {
      toast.error("Failed to remove cover image");
      console.error(error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    if (profileForm.firstName.trim()) data.append('firstName', profileForm.firstName);
    if (profileForm.lastName.trim()) data.append('lastName', profileForm.lastName);
    if (profileForm.email.trim()) data.append('email', profileForm.email);
    if (profileForm.mob.trim()) data.append('mob', profileForm.mob);

    const updatedLastName = profileForm.lastName?.trim() !== ''
      ? profileForm.lastName
      : user.lastName;

    const displayName = `${profileForm.firstName} ${updatedLastName || ''}`.trim();
    data.append('displayName', displayName);

    if (profileForm.timezone.trim()) data.append('timezone', profileForm.timezone);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put('http://localhost:8080/api/user/updateProfile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      dispatch(updateUser(response.data));
      dispatch(fetchUserProfile())
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  return (
    <div className="mb-20 px-2.5">
      <div className="p-[30px] mb-[60px] border border-[#DDD8F9] rounded-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#110C2D]">Setting</h2>

        <div className={`${style.desktopTabs} gap-4`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-[18px] font-inter font-semibold text-[#41454F] ${activeTab === tab
                ? 'border-b-2 border-b-[#553CDF] text-[#553DCF] font-semibold'
                : 'text-gray-500 hover:text-[#110C2D]'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>


        <div className={`${style.mobileDropdown} mb-6 relative`}>
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-[#DDD8F9] rounded text-left bg-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{activeTab}</span>
            {dropdownOpen ? (
              <FiChevronUp className="text-xl" />
            ) : (
              <FiChevronDown className="text-xl" />
            )}
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden bg-white shadow border border-[#DDD8F9] rounded ${dropdownOpen ? 'max-h-60' : 'max-h-0'
              }`}
          >
            <ul className="flex flex-col">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#f4f4ff] cursor-pointer"
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-t-[#DDD8F9] pt-4">
          {activeTab === 'Profile' &&
            <div>
              <div className='h-[344px]'>
                <div className='h-[245px] bg-center bg-no-repeat bg-cover rounded-sm relative' style={{
                  backgroundImage: `url(${userProfile?.coverImage
                    ? `${baseUrl}${userProfile.coverImage}`
                    : Cover
                    })`
                }}>
                  <div>
                    <span
                      onClick={handleRemoveCover}
                      className='h-[37px] w-[37px] bg-[#0000003f] text-[#fff] absolute text-center rounded-full flex justify-center items-center text-[19px] right-[22px] top-[22px] cursor-pointer'>
                      <span>
                        <RiDeleteBin6Line onClick={handleRemoveCover} />
                      </span>
                    </span>

                    <label className='absolute right-[22px] bottom-[22px] flex items-center flex-wrap py-2 px-4 bg-[#553CDF] text-white gap-1.5 rounded-sm text-[16px] font-inter cursor-pointer'>
                      <IoCameraOutline className='h-[20px] w-[20px]' />
                      <span>Upload Cover photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                    </label>

                    <div className='bg-center bg-no-repeat bg-cover w-[120px] h-[120px] md:w-[142px] md:h-[142px] rounded-full absolute left-[31px] top-[168px] md:left-[35px] md:top-[145px] border-[5px] border-[#fff] overflow-hidden' style={{ backgroundImage: `url(${userProfile?.profileImage ? `${baseUrl}${userProfile?.profileImage}` : profile})` }}>
                      <label className='absolute left-0 right-0 bottom-0 bg-[#00000041] h-[37px] text-[#fff] flex justify-center items-center cursor-pointer'>
                        <IoCameraOutline />
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-end flex-wrap pl-[190px] mt-[16px] text-[13px] font-inter text-[#7A7A7A]'>
                  <CiCircleInfo />
                  <span className='mr-2 ml-1'>Profile Photo Size: <span className='text-[#000]'>200x200 </span>pixels</span>
                  <span>Cover Photo Size: <span className='text-[#000]'>700x430 </span>pixels</span>
                </div>
              </div>

              <div>
                <form className="w-full py-8" onSubmit={handleProfileSubmit}>
                  <div className={style.formGrid}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                      <input
                        type="text"
                        name="userName"
                        value={profileForm.userName}
                        disabled
                        className="w-full px-4 py-3 border rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="mob"
                        value={profileForm.mob}
                        onChange={handleProfileChange}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <input
                        type="text"
                        name="mob"
                        value={profileForm.firstName + " " + profileForm.lastName}
                        disabled
                        onChange={handleProfileChange}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-not-allowed bg-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="Email"
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skill/Occupation</label>
                      <input
                        type="text"
                        name="displayName"
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                      <select
                        name="timezone"
                        value={profileForm.timezone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border rounded-md border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      >
                        <option value="Asia/Calcutta">Asia/Calcutta</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className='flex flex-col w-[100%] mt-4'>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      name="bio"
                      id="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className='border p-2 rounded-md resize-y min-h-[100px]'
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-[#553CDF] text-white px-5 py-2 rounded-md hover:bg-[#432bb8] transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }


          {activeTab === 'Password' &&
            <div>
              <div>
                <form className='mt-5' onSubmit={handlePasswordSubmit}>
                  <div className={`mb-[32px] w-[100%] sm:w-[66.66%] md:w-[100%] flex flex-col ${style.ChangePass}`}>
                    <label className='mb-2.5 text-[16px] font-inter text-[#737477] font-medium'>Current Password</label>
                    <input
                      className='border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                      type="password"
                      name="currentPassword"
                      placeholder='Current Password'
                      autoComplete='current-password'
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <span className='text-red-500 text-sm mt-1'>
                      {errors.currentPassword ? errors.currentPassword : ''}
                    </span>
                  </div>

                  <div className={`mb-[32px] w-[100%] sm:w-[66.66%] md:w-[100%] flex flex-col ${style.ChangePass}`}>
                    <label className='mb-2.5 text-[16px] font-inter text-[#737477] font-medium'>New Password</label>
                    <input
                      className='border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                      type="password"
                      name="newPassword"
                      placeholder='Type Password'
                      autoComplete='new-password'
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <span className='text-red-500 text-sm mt-1'>
                      {errors.newPassword ? errors.newPassword : ''}
                    </span>
                  </div>

                  <div className={`mb-[32px] w-[100%] sm:w-[66.66%] md:w-[100%] flex flex-col ${style.ChangePass}`}>
                    <label className='mb-2.5 text-[16px] font-inter text-[#737477] font-medium'>Confirm Password</label>
                    <input
                      className='border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                      type="password"
                      name="confirmPassword"
                      placeholder='Type Password'
                      autoComplete='Confirm-password'
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <span className='text-red-500 text-sm mt-1'>
                      {errors.confirmPassword ? errors.confirmPassword : ''}
                    </span>
                  </div>

                  {generalError && (
                    <p className='text-red-500 text-sm mb-4'>{generalError}</p>
                  )}

                  <div>
                    <button
                      type='submit'
                      className='text-[16px] font-inter font-semibold bg-[#553CDF] py-2 px-4 rounded-sm text-white hover:text-[#553CDF] hover:bg-white border border-[#553CDF] transition-all ease-in-out hover:cursor-pointer'
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
          {activeTab === 'Social Profile' &&
            <div>
              <form className='mt-5'>

                {/* Facebook */}
                <div className={`mb-[32px] w-full md:w-[100%] flex items-center flex-wrap gap-4 ${style.ChangePass}`}>
                  <label className='w-[150px] flex items-center gap-2 text-[16px] font-inter text-[#737477] font-medium'>
                    <FaFacebookF /> Facebook
                  </label>
                  <input
                    className='flex-1 border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                    type="text"
                    placeholder='https://facebook.com/username'
                  />
                </div>

                {/* Twitter */}
                <div className={`mb-[32px] w-full md:w-[100%] flex items-center flex-wrap gap-4 ${style.ChangePass}`}>
                  <label className='w-[150px] flex items-center gap-2 text-[16px] font-inter text-[#737477] font-medium'>
                    <FaTwitter /> Twitter
                  </label>
                  <input
                    className='flex-1 border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                    type="text"
                    placeholder='https://twitter.com/username'
                  />
                </div>

                {/* LinkedIn */}
                <div className={`mb-[32px] w-full md:w-[100%] flex items-center flex-wrap gap-4 ${style.ChangePass}`}>
                  <label className='w-[150px] flex items-center gap-2 text-[16px] font-inter text-[#737477] font-medium'>
                    <FaLinkedinIn /> LinkedIn
                  </label>
                  <input
                    className='flex-1 border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                    type="text"
                    placeholder='https://linkedin.com/username'
                  />
                </div>

                {/* Website */}
                <div className={`mb-[32px] w-full md:w-[100%] flex items-center flex-wrap gap-4 ${style.ChangePass}`}>
                  <label className='w-[150px] flex items-center gap-2 text-[16px] font-inter text-[#737477] font-medium'>
                    <FaGlobe /> Website
                  </label>
                  <input
                    className='flex-1 border border-[#DDD8F9] h-[56px] rounded-sm py-4 px-[33px] font-medium outline-[#7764e7]'
                    type="text"
                    placeholder='https://example.com/'
                  />
                </div>

                {/* Button */}
                <div>
                  <button className='text-[16px] font-inter font-semibold bg-[#553CDF] py-2 px-4 rounded-sm text-white hover:text-[#553CDF] hover:bg-white border border-[#553CDF] transition-all ease-in-out hover:cursor-pointer'>
                    Save Social Links
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Setting;
